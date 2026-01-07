// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IEngagementRewards.sol";

/**
 * @title BenefitsPoolV2
 * @dev A decentralized benefits pool for gig workers with GoodDollar Engagement Rewards integration
 * @notice This version adds referral rewards and engagement incentives
 */
contract BenefitsPoolV2 is Ownable, ReentrancyGuard, Pausable {
    // cUSD token interface
    IERC20 public immutable cUSD;

    // GoodDollar Engagement Rewards contract
    IEngagementRewards public engagementRewards;
    bool public engagementRewardsEnabled;

    // Structs
    struct Worker {
        bool isRegistered;
        bool isVerified; // Self Protocol verification status
        uint256 totalContributions;
        uint256 lastContributionTime;
        uint256 joinedAt;
        uint256 lastWithdrawalTime;
        uint256 withdrawalCount;
        address invitedBy; // Referrer address
        uint256 totalInvites; // Number of successful invites
        bool hasClaimedEngagementReward; // Claimed registration reward
        // Worker metadata
        string gigWorkType;
        string location;
        uint8 yearsExperience;
        uint256 monthlyIncome;
    }

    struct WithdrawalRequest {
        address worker;
        uint256 amount;
        string reason;
        uint256 createdAt;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        bool approved;
        mapping(address => bool) hasVoted;
    }

    // State variables
    mapping(address => Worker) public workers;
    mapping(uint256 => WithdrawalRequest) public withdrawalRequests;
    mapping(address => bool) public verifiedIdentities; // Self Protocol verified addresses

    uint256 public totalWorkers;
    uint256 public totalPoolBalance;
    uint256 public withdrawalRequestCount;
    uint256 public minimumContribution = 5 * 10**18; // 5 cUSD minimum
    uint256 public votingPeriod = 7 days;
    uint256 public withdrawalCooldown = 90 days;
    uint256 public votingThreshold = 60; // 60% approval needed
    uint256 public maxWithdrawalPercentage = 50; // Max 50% of contributions

    // Events
    event WorkerRegistered(
        address indexed worker,
        address indexed inviter,
        string gigWorkType,
        string location,
        uint8 yearsExperience,
        uint256 monthlyIncome,
        uint256 timestamp
    );
    event EngagementRewardClaimed(
        address indexed worker,
        address indexed inviter,
        bool success,
        uint256 timestamp
    );
    event WorkerVerified(address indexed worker, uint256 timestamp);
    event ContributionMade(address indexed worker, uint256 amount, uint256 timestamp);
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed worker,
        uint256 amount,
        string reason,
        uint256 timestamp
    );
    event VoteCast(
        uint256 indexed requestId,
        address indexed voter,
        bool support,
        uint256 timestamp
    );
    event WithdrawalExecuted(
        uint256 indexed requestId,
        address indexed worker,
        uint256 amount,
        uint256 timestamp
    );
    event WithdrawalRejected(uint256 indexed requestId, uint256 timestamp);
    event EmergencyPause(uint256 timestamp);
    event EmergencyUnpause(uint256 timestamp);
    event EngagementRewardsUpdated(address indexed newContract, bool enabled);

    // Modifiers
    modifier onlyRegistered() {
        require(workers[msg.sender].isRegistered, "Not registered");
        _;
    }

    modifier onlyVerified() {
        require(workers[msg.sender].isVerified, "Not verified");
        _;
    }

    modifier validWithdrawalRequest(uint256 _requestId) {
        require(_requestId < withdrawalRequestCount, "Invalid request ID");
        require(!withdrawalRequests[_requestId].executed, "Already executed");
        _;
    }

    /**
     * @dev Constructor
     * @param _cUSDAddress Address of cUSD token on Celo
     * @param _engagementRewards Address of GoodDollar Engagement Rewards contract (can be zero)
     */
    constructor(address _cUSDAddress, address _engagementRewards) Ownable(msg.sender) {
        require(_cUSDAddress != address(0), "Invalid cUSD address");
        cUSD = IERC20(_cUSDAddress);

        if (_engagementRewards != address(0)) {
            engagementRewards = IEngagementRewards(_engagementRewards);
            engagementRewardsEnabled = true;
        }
    }

    /**
     * @dev Register as a new worker in the pool with optional engagement rewards
     * @param _gigWorkType Type of gig work
     * @param _location Worker's location
     * @param _yearsExperience Years of experience in gig work
     * @param _monthlyIncome Average monthly income in USD
     * @param _inviter Address of the person who invited this worker (address(0) if none)
     * @param _validUntilBlock Block number until signature is valid (0 if not claiming reward)
     * @param _signature User signature for engagement rewards (empty if not claiming)
     */
    function registerWorker(
        string calldata _gigWorkType,
        string calldata _location,
        uint8 _yearsExperience,
        uint256 _monthlyIncome,
        address _inviter,
        uint256 _validUntilBlock,
        bytes calldata _signature
    ) external whenNotPaused {
        require(!workers[msg.sender].isRegistered, "Already registered");
        require(bytes(_gigWorkType).length > 0, "Gig work type required");
        require(bytes(_location).length > 0, "Location required");

        // Validate inviter if provided
        if (_inviter != address(0)) {
            require(workers[_inviter].isRegistered, "Inviter not registered");
            require(_inviter != msg.sender, "Cannot invite yourself");
        }

        // Register worker
        workers[msg.sender] = Worker({
            isRegistered: true,
            isVerified: false,
            totalContributions: 0,
            lastContributionTime: 0,
            joinedAt: block.timestamp,
            lastWithdrawalTime: 0,
            withdrawalCount: 0,
            invitedBy: _inviter,
            totalInvites: 0,
            hasClaimedEngagementReward: false,
            gigWorkType: _gigWorkType,
            location: _location,
            yearsExperience: _yearsExperience,
            monthlyIncome: _monthlyIncome
        });

        totalWorkers++;

        // Update inviter's invite count
        if (_inviter != address(0)) {
            workers[_inviter].totalInvites++;
        }

        emit WorkerRegistered(
            msg.sender,
            _inviter,
            _gigWorkType,
            _location,
            _yearsExperience,
            _monthlyIncome,
            block.timestamp
        );

        // Claim engagement reward (don't revert if it fails)
        if (engagementRewardsEnabled && _validUntilBlock > 0) {
            _claimEngagementReward(msg.sender, _inviter, _validUntilBlock, _signature);
        }
    }

    /**
     * @dev Internal function to claim engagement rewards
     * @notice Uses try-catch to prevent registration from failing if reward claim fails
     */
    function _claimEngagementReward(
        address _user,
        address _inviter,
        uint256 _validUntilBlock,
        bytes calldata _signature
    ) internal {
        if (workers[_user].hasClaimedEngagementReward) {
            return; // Already claimed
        }

        try engagementRewards.appClaim(
            _user,
            _inviter,
            _validUntilBlock,
            _signature
        ) returns (bool success) {
            if (success) {
                workers[_user].hasClaimedEngagementReward = true;
            }
            emit EngagementRewardClaimed(_user, _inviter, success, block.timestamp);
        } catch Error(string memory reason) {
            emit EngagementRewardClaimed(_user, _inviter, false, block.timestamp);
        } catch {
            emit EngagementRewardClaimed(_user, _inviter, false, block.timestamp);
        }
    }

    /**
     * @dev Manually claim engagement reward if registration was done before rewards integration
     * @param _inviter Address of inviter
     * @param _validUntilBlock Block number until signature is valid
     * @param _signature User signature
     */
    function claimEngagementReward(
        address _inviter,
        uint256 _validUntilBlock,
        bytes calldata _signature
    ) external onlyRegistered whenNotPaused {
        require(engagementRewardsEnabled, "Engagement rewards not enabled");
        require(!workers[msg.sender].hasClaimedEngagementReward, "Already claimed");

        _claimEngagementReward(msg.sender, _inviter, _validUntilBlock, _signature);
    }

    /**
     * @dev Verify a worker's identity (called by owner/oracle after Self Protocol verification)
     * @param _worker Address of the worker to verify
     */
    function verifyWorker(address _worker) external onlyOwner {
        require(workers[_worker].isRegistered, "Worker not registered");
        require(!workers[_worker].isVerified, "Already verified");

        workers[_worker].isVerified = true;
        verifiedIdentities[_worker] = true;

        emit WorkerVerified(_worker, block.timestamp);
    }

    /**
     * @dev Make a contribution to the pool
     * @param _amount Amount of cUSD to contribute
     */
    function contribute(uint256 _amount) external onlyRegistered whenNotPaused nonReentrant {
        require(_amount >= minimumContribution, "Below minimum contribution");

        // Transfer cUSD from worker to contract
        require(cUSD.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        workers[msg.sender].totalContributions += _amount;
        workers[msg.sender].lastContributionTime = block.timestamp;
        totalPoolBalance += _amount;

        emit ContributionMade(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Request an emergency withdrawal with tiered verification
     * @param _amount Amount requested
     * @param _reason Reason for the emergency
     */
    function requestWithdrawal(uint256 _amount, string calldata _reason)
        external
        onlyRegistered
        whenNotPaused
        returns (uint256)
    {
        require(_amount > 0, "Amount must be > 0");
        require(bytes(_reason).length > 0, "Reason required");

        Worker storage worker = workers[msg.sender];

        // Tier 1: Up to 100% of contributions
        uint256 tier1Limit = worker.totalContributions;
        // Tier 2: Up to 200% of contributions (with verification)
        uint256 tier2Limit = worker.totalContributions * 2;

        // Check verification requirements
        if (_amount > tier1Limit) {
            require(worker.isVerified, "Verification required to access community funds");
            require(_amount <= tier2Limit, "Exceeds maximum withdrawal (200%)");
        } else {
            require(_amount <= tier1Limit, "Amount exceeds your contributions");
        }

        require(_amount <= totalPoolBalance, "Insufficient pool balance");

        // Check cooldown
        if (worker.lastWithdrawalTime > 0) {
            require(
                block.timestamp >= worker.lastWithdrawalTime + withdrawalCooldown,
                "Cooldown period active"
            );
        }

        uint256 requestId = withdrawalRequestCount++;
        WithdrawalRequest storage request = withdrawalRequests[requestId];
        request.worker = msg.sender;
        request.amount = _amount;
        request.reason = _reason;
        request.createdAt = block.timestamp;
        request.votesFor = 0;
        request.votesAgainst = 0;
        request.executed = false;
        request.approved = false;

        emit WithdrawalRequested(requestId, msg.sender, _amount, _reason, block.timestamp);
        return requestId;
    }

    /**
     * @dev Vote on a withdrawal request
     * @param _requestId ID of the withdrawal request
     * @param _support True to approve, false to reject
     */
    function voteOnWithdrawal(uint256 _requestId, bool _support)
        external
        onlyVerified
        validWithdrawalRequest(_requestId)
        whenNotPaused
    {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];

        require(block.timestamp <= request.createdAt + votingPeriod, "Voting period ended");
        require(!request.hasVoted[msg.sender], "Already voted");
        require(request.worker != msg.sender, "Cannot vote on own request");

        request.hasVoted[msg.sender] = true;

        if (_support) {
            request.votesFor++;
        } else {
            request.votesAgainst++;
        }

        emit VoteCast(_requestId, msg.sender, _support, block.timestamp);
    }

    /**
     * @dev Execute a withdrawal request after voting period
     * @param _requestId ID of the withdrawal request
     */
    function executeWithdrawal(uint256 _requestId)
        external
        validWithdrawalRequest(_requestId)
        whenNotPaused
        nonReentrant
    {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];

        require(block.timestamp > request.createdAt + votingPeriod, "Voting still active");
        require(!request.executed, "Already executed");

        uint256 totalVotes = request.votesFor + request.votesAgainst;
        require(totalVotes > 0, "No votes cast");

        uint256 approvalPercentage = (request.votesFor * 100) / totalVotes;

        request.executed = true;

        if (approvalPercentage >= votingThreshold) {
            request.approved = true;

            Worker storage worker = workers[request.worker];
            worker.lastWithdrawalTime = block.timestamp;
            worker.withdrawalCount++;

            totalPoolBalance -= request.amount;
            require(cUSD.transfer(request.worker, request.amount), "Transfer failed");

            emit WithdrawalExecuted(_requestId, request.worker, request.amount, block.timestamp);
        } else {
            emit WithdrawalRejected(_requestId, block.timestamp);
        }
    }

    /**
     * @dev Get worker information including referral stats
     */
    function getWorkerInfo(address _worker)
        external
        view
        returns (
            bool isRegistered,
            bool isVerified,
            uint256 totalContributions,
            uint256 lastContributionTime,
            uint256 joinedAt,
            uint256 lastWithdrawalTime,
            uint256 withdrawalCount,
            address invitedBy,
            uint256 totalInvites,
            bool hasClaimedEngagementReward,
            string memory gigWorkType,
            string memory location,
            uint8 yearsExperience,
            uint256 monthlyIncome
        )
    {
        Worker storage worker = workers[_worker];
        return (
            worker.isRegistered,
            worker.isVerified,
            worker.totalContributions,
            worker.lastContributionTime,
            worker.joinedAt,
            worker.lastWithdrawalTime,
            worker.withdrawalCount,
            worker.invitedBy,
            worker.totalInvites,
            worker.hasClaimedEngagementReward,
            worker.gigWorkType,
            worker.location,
            worker.yearsExperience,
            worker.monthlyIncome
        );
    }

    /**
     * @dev Get withdrawal request details
     */
    function getWithdrawalRequest(uint256 _requestId)
        external
        view
        returns (
            address worker,
            uint256 amount,
            string memory reason,
            uint256 createdAt,
            uint256 votesFor,
            uint256 votesAgainst,
            bool executed,
            bool approved
        )
    {
        WithdrawalRequest storage request = withdrawalRequests[_requestId];
        return (
            request.worker,
            request.amount,
            request.reason,
            request.createdAt,
            request.votesFor,
            request.votesAgainst,
            request.executed,
            request.approved
        );
    }

    /**
     * @dev Check if an address has voted on a request
     */
    function hasVoted(uint256 _requestId, address _voter) external view returns (bool) {
        return withdrawalRequests[_requestId].hasVoted[_voter];
    }

    /**
     * @dev Get pool statistics
     */
    function getPoolStats()
        external
        view
        returns (
            uint256 balance,
            uint256 workers_count,
            uint256 activeRequests
        )
    {
        return (totalPoolBalance, totalWorkers, withdrawalRequestCount);
    }

    /**
     * @dev Get withdrawal limits for a worker
     */
    function getWithdrawalLimits(address _worker)
        external
        view
        returns (
            uint256 tier1Limit,
            uint256 tier2Limit,
            bool needsVerification
        )
    {
        Worker storage worker = workers[_worker];
        tier1Limit = worker.totalContributions;
        tier2Limit = worker.totalContributions * 2;
        needsVerification = !worker.isVerified;
    }

    /**
     * @dev Update engagement rewards contract (owner only)
     * @param _newContract New engagement rewards contract address
     * @param _enabled Whether to enable engagement rewards
     */
    function setEngagementRewards(address _newContract, bool _enabled) external onlyOwner {
        if (_newContract != address(0)) {
            engagementRewards = IEngagementRewards(_newContract);
        }
        engagementRewardsEnabled = _enabled;
        emit EngagementRewardsUpdated(_newContract, _enabled);
    }

    /**
     * @dev Update minimum contribution (owner only)
     */
    function setMinimumContribution(uint256 _newMinimum) external onlyOwner {
        minimumContribution = _newMinimum;
    }

    /**
     * @dev Update voting threshold (owner only)
     */
    function setVotingThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold > 0 && _newThreshold <= 100, "Invalid threshold");
        votingThreshold = _newThreshold;
    }

    /**
     * @dev Emergency pause (owner only)
     */
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPause(block.timestamp);
    }

    /**
     * @dev Unpause (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpause(block.timestamp);
    }

    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }
}

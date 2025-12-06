// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title BenefitsPool
 * @dev A decentralized benefits pool for gig workers to collectively pool resources
 * for emergency funds with community voting on withdrawal requests
 */
contract BenefitsPool is Ownable, ReentrancyGuard, Pausable {
    // cUSD token interface
    IERC20 public immutable cUSD;

    // Structs
    struct Worker {
        bool isRegistered;
        bool isVerified; // Self Protocol verification status
        uint256 totalContributions;
        uint256 lastContributionTime;
        uint256 joinedAt;
        uint256 lastWithdrawalTime;
        uint256 withdrawalCount;
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
    uint256 public withdrawalCooldown = 90 days; // 3 months between withdrawals
    uint256 public votingThreshold = 60; // 60% approval needed
    uint256 public maxWithdrawalPercentage = 50; // Max 50% of contributions

    // Events
    event WorkerRegistered(
        address indexed worker,
        string gigWorkType,
        string location,
        uint8 yearsExperience,
        uint256 monthlyIncome,
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
     */
    constructor(address _cUSDAddress) Ownable(msg.sender) {
        require(_cUSDAddress != address(0), "Invalid cUSD address");
        cUSD = IERC20(_cUSDAddress);
    }

    /**
     * @dev Register as a new worker in the pool
     * @param _gigWorkType Type of gig work (e.g., "Ride-share Driver")
     * @param _location Worker's location (e.g., "San Francisco, USA")
     * @param _yearsExperience Years of experience in gig work
     * @param _monthlyIncome Average monthly income in USD
     */
    function registerWorker(
        string calldata _gigWorkType,
        string calldata _location,
        uint8 _yearsExperience,
        uint256 _monthlyIncome
    ) external whenNotPaused {
        require(!workers[msg.sender].isRegistered, "Already registered");
        require(bytes(_gigWorkType).length > 0, "Gig work type required");
        require(bytes(_location).length > 0, "Location required");

        workers[msg.sender] = Worker({
            isRegistered: true,
            isVerified: false,
            totalContributions: 0,
            lastContributionTime: 0,
            joinedAt: block.timestamp,
            lastWithdrawalTime: 0,
            withdrawalCount: 0,
            gigWorkType: _gigWorkType,
            location: _location,
            yearsExperience: _yearsExperience,
            monthlyIncome: _monthlyIncome
        });

        totalWorkers++;
        emit WorkerRegistered(
            msg.sender,
            _gigWorkType,
            _location,
            _yearsExperience,
            _monthlyIncome,
            block.timestamp
        );
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
     * @notice Verification is NOT required to contribute - only registration needed
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
     * @notice Tier 1 (≤100% contributions): No verification needed - it's your money
     * @notice Tier 2 (>100% contributions): Verification required - accessing community funds
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

        // Tier 1: Withdrawing your own contributions (up to 100%)
        // NO VERIFICATION NEEDED - it's your money
        uint256 tier1Limit = worker.totalContributions;

        // Tier 2: Community assistance (up to 200% of contributions)
        // VERIFICATION REQUIRED - accessing community funds
        uint256 tier2Limit = worker.totalContributions * 2;

        // Check verification requirements based on withdrawal amount
        if (_amount > tier1Limit) {
            require(worker.isVerified, "Verification required to access community funds above your contributions");
            require(_amount <= tier2Limit, "Exceeds maximum withdrawal (200% of contributions)");
        } else {
            require(_amount <= tier1Limit, "Amount exceeds your total contributions");
        }

        // Check pool has sufficient funds
        require(_amount <= totalPoolBalance, "Insufficient pool balance");

        // Check cooldown period
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

        // Calculate approval percentage
        uint256 approvalPercentage = (request.votesFor * 100) / totalVotes;

        request.executed = true;

        if (approvalPercentage >= votingThreshold) {
            request.approved = true;

            // Update worker state
            Worker storage worker = workers[request.worker];
            worker.lastWithdrawalTime = block.timestamp;
            worker.withdrawalCount++;

            // Transfer funds
            totalPoolBalance -= request.amount;
            require(cUSD.transfer(request.worker, request.amount), "Transfer failed");

            emit WithdrawalExecuted(_requestId, request.worker, request.amount, block.timestamp);
        } else {
            emit WithdrawalRejected(_requestId, block.timestamp);
        }
    }

    /**
     * @dev Get worker information
     * @param _worker Address of the worker
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
            worker.gigWorkType,
            worker.location,
            worker.yearsExperience,
            worker.monthlyIncome
        );
    }

    /**
     * @dev Get withdrawal request details
     * @param _requestId ID of the withdrawal request
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
     * @param _requestId ID of the withdrawal request
     * @param _voter Address to check
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
     * @dev Get withdrawal limits for a worker based on verification status
     * @param _worker Address of the worker
     * @return tier1Limit Maximum withdrawal without verification (100% of contributions)
     * @return tier2Limit Maximum withdrawal with verification (200% of contributions)
     * @return needsVerification Whether verification is required for tier 2
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
     * @dev Update minimum contribution (owner only)
     * @param _newMinimum New minimum contribution amount
     */
    function setMinimumContribution(uint256 _newMinimum) external onlyOwner {
        minimumContribution = _newMinimum;
    }

    /**
     * @dev Update voting threshold (owner only)
     * @param _newThreshold New voting threshold (percentage)
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

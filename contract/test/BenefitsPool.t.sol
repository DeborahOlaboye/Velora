// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BenefitsPool.sol";
import "../src/MockcUSD.sol";

contract BenefitsPoolTest is Test {
    BenefitsPool public pool;
    MockcUSD public cUSD;

    address public owner;
    address public worker1;
    address public worker2;
    address public worker3;

    uint256 constant INITIAL_BALANCE = 10000 * 10**18; // 10,000 cUSD

    event WorkerRegistered(address indexed worker, uint256 timestamp);
    event WorkerVerified(address indexed worker, uint256 timestamp);
    event ContributionMade(address indexed worker, uint256 amount, uint256 timestamp);
    event WithdrawalRequested(
        uint256 indexed requestId,
        address indexed worker,
        uint256 amount,
        string reason,
        uint256 timestamp
    );
    event VoteCast(uint256 indexed requestId, address indexed voter, bool support, uint256 timestamp);
    event WithdrawalExecuted(
        uint256 indexed requestId,
        address indexed worker,
        uint256 amount,
        uint256 timestamp
    );

    function setUp() public {
        owner = address(this);
        worker1 = makeAddr("worker1");
        worker2 = makeAddr("worker2");
        worker3 = makeAddr("worker3");

        // Deploy mock cUSD
        cUSD = new MockcUSD();

        // Deploy BenefitsPool
        pool = new BenefitsPool(address(cUSD));

        // Distribute cUSD to workers
        cUSD.mint(worker1, INITIAL_BALANCE);
        cUSD.mint(worker2, INITIAL_BALANCE);
        cUSD.mint(worker3, INITIAL_BALANCE);
    }

    /*//////////////////////////////////////////////////////////////
                        WORKER REGISTRATION TESTS
    //////////////////////////////////////////////////////////////*/

    function test_RegisterWorker() public {
        vm.prank(worker1);
        vm.expectEmit(true, false, false, true);
        emit WorkerRegistered(worker1, block.timestamp);
        pool.registerWorker();

        (bool isRegistered, , , , uint256 joinedAt, , ) = pool.getWorkerInfo(worker1);
        assertTrue(isRegistered);
        assertEq(joinedAt, block.timestamp);
        assertEq(pool.totalWorkers(), 1);
    }

    function test_CannotRegisterTwice() public {
        vm.startPrank(worker1);
        pool.registerWorker();

        vm.expectRevert("Already registered");
        pool.registerWorker();
        vm.stopPrank();
    }

    function test_VerifyWorker() public {
        vm.prank(worker1);
        pool.registerWorker();

        vm.expectEmit(true, false, false, true);
        emit WorkerVerified(worker1, block.timestamp);
        pool.verifyWorker(worker1);

        (, bool isVerified, , , , , ) = pool.getWorkerInfo(worker1);
        assertTrue(isVerified);
        assertTrue(pool.verifiedIdentities(worker1));
    }

    function test_CannotVerifyUnregisteredWorker() public {
        vm.expectRevert("Worker not registered");
        pool.verifyWorker(worker1);
    }

    function test_OnlyOwnerCanVerify() public {
        vm.prank(worker1);
        pool.registerWorker();

        vm.prank(worker2);
        vm.expectRevert();
        pool.verifyWorker(worker1);
    }

    /*//////////////////////////////////////////////////////////////
                        CONTRIBUTION TESTS
    //////////////////////////////////////////////////////////////*/

    function test_Contribute() public {
        // Register and verify worker
        vm.prank(worker1);
        pool.registerWorker();
        pool.verifyWorker(worker1);

        uint256 contributionAmount = 100 * 10**18; // 100 cUSD

        vm.startPrank(worker1);
        cUSD.approve(address(pool), contributionAmount);

        vm.expectEmit(true, false, false, true);
        emit ContributionMade(worker1, contributionAmount, block.timestamp);
        pool.contribute(contributionAmount);
        vm.stopPrank();

        (, , uint256 totalContributions, uint256 lastContribution, , , ) = pool.getWorkerInfo(worker1);
        assertEq(totalContributions, contributionAmount);
        assertEq(lastContribution, block.timestamp);
        assertEq(pool.totalPoolBalance(), contributionAmount);
    }

    function test_CannotContributeBelowMinimum() public {
        vm.prank(worker1);
        pool.registerWorker();
        pool.verifyWorker(worker1);

        uint256 belowMinimum = 1 * 10**18; // 1 cUSD

        vm.startPrank(worker1);
        cUSD.approve(address(pool), belowMinimum);
        vm.expectRevert("Below minimum contribution");
        pool.contribute(belowMinimum);
        vm.stopPrank();
    }

    function test_CannotContributeWithoutVerification() public {
        vm.prank(worker1);
        pool.registerWorker();

        uint256 amount = 100 * 10**18;

        vm.startPrank(worker1);
        cUSD.approve(address(pool), amount);
        vm.expectRevert("Not verified");
        pool.contribute(amount);
        vm.stopPrank();
    }

    function test_MultipleContributions() public {
        vm.prank(worker1);
        pool.registerWorker();
        pool.verifyWorker(worker1);

        uint256 firstContribution = 100 * 10**18;
        uint256 secondContribution = 150 * 10**18;

        vm.startPrank(worker1);
        cUSD.approve(address(pool), firstContribution + secondContribution);
        pool.contribute(firstContribution);
        pool.contribute(secondContribution);
        vm.stopPrank();

        (, , uint256 totalContributions, , , , ) = pool.getWorkerInfo(worker1);
        assertEq(totalContributions, firstContribution + secondContribution);
        assertEq(pool.totalPoolBalance(), firstContribution + secondContribution);
    }

    /*//////////////////////////////////////////////////////////////
                    WITHDRAWAL REQUEST TESTS
    //////////////////////////////////////////////////////////////*/

    function test_RequestWithdrawal() public {
        // Setup: worker1 makes contributions
        _setupWorkerWithContributions(worker1, 500 * 10**18);

        uint256 withdrawalAmount = 200 * 10**18; // Within 50% limit
        string memory reason = "Medical emergency";

        vm.prank(worker1);
        vm.expectEmit(true, true, false, true);
        emit WithdrawalRequested(0, worker1, withdrawalAmount, reason, block.timestamp);
        uint256 requestId = pool.requestWithdrawal(withdrawalAmount, reason);

        assertEq(requestId, 0);

        (address worker, uint256 amount, string memory requestReason, , , , bool executed, ) =
            pool.getWithdrawalRequest(requestId);

        assertEq(worker, worker1);
        assertEq(amount, withdrawalAmount);
        assertEq(requestReason, reason);
        assertFalse(executed);
    }

    function test_CannotWithdrawMoreThanLimit() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);

        // Try to withdraw more than 50% of contributions
        uint256 excessiveAmount = 300 * 10**18;

        vm.prank(worker1);
        vm.expectRevert("Exceeds withdrawal limit");
        pool.requestWithdrawal(excessiveAmount, "Emergency");
    }

    function test_CannotWithdrawWithoutReason() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);

        vm.prank(worker1);
        vm.expectRevert("Reason required");
        pool.requestWithdrawal(100 * 10**18, "");
    }

    function test_CannotWithdrawDuringCooldown() public {
        _setupWorkerWithContributions(worker1, 1000 * 10**18);

        // First withdrawal
        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "First emergency");

        // Fast forward past voting period
        vm.warp(block.timestamp + 8 days);

        // Approve and execute
        _approveWithdrawal(requestId);

        // Try to request another withdrawal immediately
        vm.prank(worker1);
        vm.expectRevert("Cooldown period active");
        pool.requestWithdrawal(100 * 10**18, "Second emergency");
    }

    /*//////////////////////////////////////////////////////////////
                            VOTING TESTS
    //////////////////////////////////////////////////////////////*/

    function test_VoteOnWithdrawal() public {
        // Setup multiple workers
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);

        // Worker1 requests withdrawal
        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        // Worker2 votes
        vm.prank(worker2);
        vm.expectEmit(true, true, false, true);
        emit VoteCast(requestId, worker2, true, block.timestamp);
        pool.voteOnWithdrawal(requestId, true);

        assertTrue(pool.hasVoted(requestId, worker2));
        (, , , , uint256 votesFor, uint256 votesAgainst, , ) = pool.getWithdrawalRequest(requestId);
        assertEq(votesFor, 1);
        assertEq(votesAgainst, 0);
    }

    function test_CannotVoteTwice() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        vm.startPrank(worker2);
        pool.voteOnWithdrawal(requestId, true);

        vm.expectRevert("Already voted");
        pool.voteOnWithdrawal(requestId, true);
        vm.stopPrank();
    }

    function test_CannotVoteOnOwnRequest() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);

        vm.startPrank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        vm.expectRevert("Cannot vote on own request");
        pool.voteOnWithdrawal(requestId, true);
        vm.stopPrank();
    }

    function test_CannotVoteAfterPeriodEnds() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        // Fast forward past voting period
        vm.warp(block.timestamp + 8 days);

        vm.prank(worker2);
        vm.expectRevert("Voting period ended");
        pool.voteOnWithdrawal(requestId, true);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAWAL EXECUTION TESTS
    //////////////////////////////////////////////////////////////*/

    function test_ExecuteApprovedWithdrawal() public {
        // Setup multiple workers and contributions
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);
        _setupWorkerWithContributions(worker3, 500 * 10**18);

        uint256 withdrawalAmount = 200 * 10**18;

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(withdrawalAmount, "Emergency");

        uint256 initialBalance = cUSD.balanceOf(worker1);

        // Vote in favor (2 out of 2 votes = 100% approval)
        vm.prank(worker2);
        pool.voteOnWithdrawal(requestId, true);
        vm.prank(worker3);
        pool.voteOnWithdrawal(requestId, true);

        // Fast forward past voting period
        vm.warp(block.timestamp + 8 days);

        vm.expectEmit(true, true, false, true);
        emit WithdrawalExecuted(requestId, worker1, withdrawalAmount, block.timestamp);
        pool.executeWithdrawal(requestId);

        // Verify execution
        (, , , , , , bool executed, bool approved) = pool.getWithdrawalRequest(requestId);
        assertTrue(executed);
        assertTrue(approved);

        // Verify balance increased
        assertEq(cUSD.balanceOf(worker1), initialBalance + withdrawalAmount);

        // Verify pool balance decreased
        assertEq(pool.totalPoolBalance(), 1500 * 10**18 - withdrawalAmount);
    }

    function test_RejectWithdrawalWithInsufficientVotes() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);
        _setupWorkerWithContributions(worker3, 500 * 10**18);

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        // Vote against (1 for, 1 against = 50% < 60% threshold)
        vm.prank(worker2);
        pool.voteOnWithdrawal(requestId, true);
        vm.prank(worker3);
        pool.voteOnWithdrawal(requestId, false);

        vm.warp(block.timestamp + 8 days);
        pool.executeWithdrawal(requestId);

        (, , , , , , bool executed, bool approved) = pool.getWithdrawalRequest(requestId);
        assertTrue(executed);
        assertFalse(approved);
    }

    function test_CannotExecuteDuringVotingPeriod() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        vm.expectRevert("Voting still active");
        pool.executeWithdrawal(requestId);
    }

    function test_CannotExecuteTwice() public {
        _setupWorkerWithContributions(worker1, 500 * 10**18);
        _setupWorkerWithContributions(worker2, 500 * 10**18);

        vm.prank(worker1);
        uint256 requestId = pool.requestWithdrawal(100 * 10**18, "Emergency");

        vm.prank(worker2);
        pool.voteOnWithdrawal(requestId, true);

        vm.warp(block.timestamp + 8 days);
        pool.executeWithdrawal(requestId);

        vm.expectRevert("Already executed");
        pool.executeWithdrawal(requestId);
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN FUNCTIONS TESTS
    //////////////////////////////////////////////////////////////*/

    function test_SetMinimumContribution() public {
        uint256 newMinimum = 10 * 10**18;
        pool.setMinimumContribution(newMinimum);
        assertEq(pool.minimumContribution(), newMinimum);
    }

    function test_SetVotingThreshold() public {
        uint256 newThreshold = 75;
        pool.setVotingThreshold(newThreshold);
        assertEq(pool.votingThreshold(), newThreshold);
    }

    function test_CannotSetInvalidThreshold() public {
        vm.expectRevert("Invalid threshold");
        pool.setVotingThreshold(0);

        vm.expectRevert("Invalid threshold");
        pool.setVotingThreshold(101);
    }

    function test_EmergencyPause() public {
        pool.emergencyPause();
        assertTrue(pool.paused());

        // Cannot register while paused
        vm.prank(worker1);
        vm.expectRevert();
        pool.registerWorker();
    }

    function test_Unpause() public {
        pool.emergencyPause();
        pool.unpause();
        assertFalse(pool.paused());
    }

    /*//////////////////////////////////////////////////////////////
                        HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _setupWorkerWithContributions(address worker, uint256 amount) internal {
        vm.prank(worker);
        pool.registerWorker();
        pool.verifyWorker(worker);

        vm.startPrank(worker);
        cUSD.approve(address(pool), amount);
        pool.contribute(amount);
        vm.stopPrank();
    }

    function _approveWithdrawal(uint256 requestId) internal {
        // Get 3 voters to approve
        address[] memory voters = new address[](3);
        voters[0] = makeAddr("voter1");
        voters[1] = makeAddr("voter2");
        voters[2] = makeAddr("voter3");

        for (uint256 i = 0; i < voters.length; i++) {
            vm.prank(voters[i]);
            pool.registerWorker();
            pool.verifyWorker(voters[i]);

            vm.prank(voters[i]);
            pool.voteOnWithdrawal(requestId, true);
        }

        pool.executeWithdrawal(requestId);
    }
}

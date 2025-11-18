// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 ^0.8.20 ^0.8.24;

// lib/openzeppelin-contracts/contracts/utils/Context.sol

// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}

// lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol

// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol

// OpenZeppelin Contracts (last updated v5.1.0) (utils/StorageSlot.sol)
// This file was procedurally generated from scripts/generate/templates/StorageSlot.js.

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC-1967 implementation slot:
 * ```solidity
 * contract ERC1967 {
 *     // Define the slot. Alternatively, use the SlotDerivation library to derive the slot.
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(newImplementation.code.length > 0);
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * TIP: Consider using this library along with {SlotDerivation}.
 */
library StorageSlot {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    struct Int256Slot {
        int256 value;
    }

    struct StringSlot {
        string value;
    }

    struct BytesSlot {
        bytes value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `Int256Slot` with member `value` located at `slot`.
     */
    function getInt256Slot(bytes32 slot) internal pure returns (Int256Slot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns a `StringSlot` with member `value` located at `slot`.
     */
    function getStringSlot(bytes32 slot) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `StringSlot` representation of the string storage pointer `store`.
     */
    function getStringSlot(string storage store) internal pure returns (StringSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }

    /**
     * @dev Returns a `BytesSlot` with member `value` located at `slot`.
     */
    function getBytesSlot(bytes32 slot) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BytesSlot` representation of the bytes storage pointer `store`.
     */
    function getBytesSlot(bytes storage store) internal pure returns (BytesSlot storage r) {
        assembly ("memory-safe") {
            r.slot := store.slot
        }
    }
}

// lib/openzeppelin-contracts/contracts/access/Ownable.sol

// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// lib/openzeppelin-contracts/contracts/utils/Pausable.sol

// OpenZeppelin Contracts (last updated v5.3.0) (utils/Pausable.sol)

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

// lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol

// OpenZeppelin Contracts (last updated v5.5.0) (utils/ReentrancyGuard.sol)

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 *
 * IMPORTANT: Deprecated. This storage-based reentrancy guard will be removed and replaced
 * by the {ReentrancyGuardTransient} variant in v6.0.
 *
 * @custom:stateless
 */
abstract contract ReentrancyGuard {
    using StorageSlot for bytes32;

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ReentrancyGuard")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant REENTRANCY_GUARD_STORAGE =
        0x9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00;

    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    /**
     * @dev A `view` only version of {nonReentrant}. Use to block view functions
     * from being called, preventing reading from inconsistent contract state.
     *
     * CAUTION: This is a "view" modifier and does not change the reentrancy
     * status. Use it only on view functions. For payable or non-payable functions,
     * use the standard {nonReentrant} modifier instead.
     */
    modifier nonReentrantView() {
        _nonReentrantBeforeView();
        _;
    }

    function _nonReentrantBeforeView() private view {
        if (_reentrancyGuardEntered()) {
            revert ReentrancyGuardReentrantCall();
        }
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        _nonReentrantBeforeView();

        // Any calls to nonReentrant after this point will fail
        _reentrancyGuardStorageSlot().getUint256Slot().value = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _reentrancyGuardStorageSlot().getUint256Slot().value = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _reentrancyGuardStorageSlot().getUint256Slot().value == ENTERED;
    }

    function _reentrancyGuardStorageSlot() internal pure virtual returns (bytes32) {
        return REENTRANCY_GUARD_STORAGE;
    }
}

// src/BenefitsPool.sol

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
     */
    function registerWorker() external whenNotPaused {
        require(!workers[msg.sender].isRegistered, "Already registered");

        workers[msg.sender] = Worker({
            isRegistered: true,
            isVerified: false,
            totalContributions: 0,
            lastContributionTime: 0,
            joinedAt: block.timestamp,
            lastWithdrawalTime: 0,
            withdrawalCount: 0
        });

        totalWorkers++;
        emit WorkerRegistered(msg.sender, block.timestamp);
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
    function contribute(uint256 _amount) external onlyRegistered onlyVerified whenNotPaused nonReentrant {
        require(_amount >= minimumContribution, "Below minimum contribution");

        // Transfer cUSD from worker to contract
        require(cUSD.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        workers[msg.sender].totalContributions += _amount;
        workers[msg.sender].lastContributionTime = block.timestamp;
        totalPoolBalance += _amount;

        emit ContributionMade(msg.sender, _amount, block.timestamp);
    }

    /**
     * @dev Request an emergency withdrawal
     * @param _amount Amount requested
     * @param _reason Reason for the emergency
     */
    function requestWithdrawal(uint256 _amount, string calldata _reason)
        external
        onlyRegistered
        onlyVerified
        whenNotPaused
        returns (uint256)
    {
        require(_amount > 0, "Amount must be > 0");
        require(bytes(_reason).length > 0, "Reason required");

        Worker storage worker = workers[msg.sender];

        // Check cooldown period
        if (worker.lastWithdrawalTime > 0) {
            require(
                block.timestamp >= worker.lastWithdrawalTime + withdrawalCooldown,
                "Cooldown period active"
            );
        }

        // Check withdrawal limit based on contributions
        uint256 maxWithdrawal = (worker.totalContributions * maxWithdrawalPercentage) / 100;
        require(_amount <= maxWithdrawal, "Exceeds withdrawal limit");
        require(_amount <= totalPoolBalance, "Insufficient pool balance");

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
            uint256 withdrawalCount
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
            worker.withdrawalCount
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IEngagementRewards
 * @notice Interface for GoodDollar Engagement Rewards contract
 * @dev Allows apps to reward users for engagement and inviting others
 */
interface IEngagementRewards {
    /**
     * @notice Basic claim function for app rewards
     * @param user Address of the user claiming the reward
     * @param inviter Address of the user who invited this user (address(0) if none)
     * @param validUntilBlock Block number until which the signature is valid
     * @param signature User's signature (required for first-time registration)
     * @return success Whether the claim was successful
     */
    function appClaim(
        address user,
        address inviter,
        uint256 validUntilBlock,
        bytes memory signature
    ) external returns (bool success);

    /**
     * @notice Advanced claim function with custom reward percentages
     * @param user Address of the user claiming the reward
     * @param inviter Address of the inviter
     * @param validUntilBlock Block number until which the signature is valid
     * @param signature User's signature
     * @param userAndInviterPercentage Percentage split between user and inviter (0-100)
     * @param userPercentage Percentage of reward going to user (0-100)
     * @return success Whether the claim was successful
     */
    function appClaim(
        address user,
        address inviter,
        uint256 validUntilBlock,
        bytes memory signature,
        uint8 userAndInviterPercentage,
        uint8 userPercentage
    ) external returns (bool success);

    /**
     * @notice For non-contract apps that need to provide their signature
     * @param app Address of the app contract
     * @param inviter Address of the inviter
     * @param validUntilBlock Block number until signature validity
     * @param userSignature Signature from the user
     * @param appSignature Signature from the app
     * @return success Whether the claim was successful
     */
    function nonContractAppClaim(
        address app,
        address inviter,
        uint256 validUntilBlock,
        bytes memory userSignature,
        bytes memory appSignature
    ) external returns (bool success);
}

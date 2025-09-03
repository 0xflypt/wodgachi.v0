// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IFitnessOracle
 * @dev Interface for fitness data verification oracle
 */
interface IFitnessOracle {
    function verifyWorkout(
        address user,
        string memory workoutId,
        uint256 duration,
        uint256 difficulty
    ) external view returns (bool);
    
    function getWorkoutVerificationStatus(
        address user,
        string memory workoutId
    ) external view returns (bool verified, uint256 heartRate, uint256 calories);
}
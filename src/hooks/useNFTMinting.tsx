import { useState, useCallback } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ProgressNFT, User } from '../types';

export const useNFTMinting = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintingError, setMintingError] = useState<string | null>(null);
  const [userNFTs, setUserNFTs] = useState<ProgressNFT[]>([]);
  const { isConnected, address } = useWeb3();

  const canMintNFT = useCallback((user: User) => {
    const workoutsMilestone = Math.floor(user.totalWorkouts / 30) * 30;
    const lastMintedMilestone = userNFTs.length > 0 
      ? Math.max(...userNFTs.map(nft => nft.workoutsMilestone))
      : 0;
    
    return user.totalWorkouts >= 30 && workoutsMilestone > lastMintedMilestone;
  }, [userNFTs]);

  const mintProgressNFT = useCallback(async (user: User) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!canMintNFT(user)) {
      throw new Error('Not eligible for NFT minting yet');
    }

    setIsMinting(true);
    setMintingError(null);

    try {
      // Simulate blockchain interaction
      // In a real implementation, you would:
      // 1. Connect to your NFT smart contract on XDC
      // 2. Prepare metadata
      // 3. Call mint function
      // 4. Wait for transaction confirmation

      const workoutsMilestone = Math.floor(user.totalWorkouts / 30) * 30;
      
      // Mock transaction hash and token ID
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const mockTokenId = Date.now();

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newNFT: ProgressNFT = {
        id: `nft-${mockTokenId}`,
        tokenId: mockTokenId,
        workoutsMilestone,
        mintedAt: new Date().toISOString(),
        transactionHash: mockTxHash,
        metadata: {
          totalWorkouts: user.totalWorkouts,
          level: user.level,
          streak: user.streak,
          tokensEarned: user.tokens,
          creatureName: user.creature.name,
          creatureLevel: user.creature.level,
          achievements: user.achievements.filter(a => a.unlocked).map(a => a.name)
        },
        isRedeemed: false
      };

      setUserNFTs(prev => [...prev, newNFT]);
      
      return newNFT;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mint NFT';
      setMintingError(errorMessage);
      throw error;
    } finally {
      setIsMinting(false);
    }
  }, [isConnected, address, canMintNFT, userNFTs]);

  const redeemNFT = useCallback((nftId: string, rewardId: string) => {
    setUserNFTs(prev => 
      prev.map(nft => 
        nft.id === nftId 
          ? { ...nft, isRedeemed: true, redeemedFor: rewardId }
          : nft
      )
    );
  }, []);

  const canRedeemWithNFT = useCallback((rewardId: string, requiredMilestone: number) => {
    const eligibleNFTs = userNFTs.filter(
      nft => !nft.isRedeemed && nft.workoutsMilestone >= requiredMilestone
    );
    return eligibleNFTs.length > 0;
  }, [userNFTs]);

  const getEligibleNFTForReward = useCallback((rewardId: string, requiredMilestone: number) => {
    return userNFTs.find(
      nft => !nft.isRedeemed && nft.workoutsMilestone >= requiredMilestone
    );
  }, [userNFTs]);

  const getNextMilestone = useCallback((totalWorkouts: number) => {
    return Math.ceil(totalWorkouts / 30) * 30;
  }, []);

  const getWorkoutsUntilNextNFT = useCallback((totalWorkouts: number) => {
    const nextMilestone = getNextMilestone(totalWorkouts);
    return nextMilestone - totalWorkouts;
  }, [getNextMilestone]);

  return {
    isMinting,
    mintingError,
    userNFTs,
    canMintNFT,
    mintProgressNFT,
    redeemNFT,
    canRedeemWithNFT,
    getEligibleNFTForReward,
    getNextMilestone,
    getWorkoutsUntilNextNFT
  };
};
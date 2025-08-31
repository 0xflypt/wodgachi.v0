import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface Web3ContextType {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  userProgress: {
    workoutsCompleted: number;
    tokensEarned: number;
    streakDays: number;
    lastSyncedBlock: number;
  };
  syncProgress: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wallet = useWallet();
  const [userProgress, setUserProgress] = useState({
    workoutsCompleted: 0,
    tokensEarned: 0,
    streakDays: 0,
    lastSyncedBlock: 0
  });

  const syncProgress = async () => {
    if (!wallet.isConnected || !wallet.address) return;

    try {
      // Simulate blockchain interaction
      // In a real implementation, you would:
      // 1. Connect to your smart contract
      // 2. Read user's on-chain progress
      // 3. Update local state with blockchain data
      
      console.log('Syncing progress for address:', wallet.address);
      
      // Mock data - replace with actual blockchain calls
      const mockProgress = {
        workoutsCompleted: Math.floor(Math.random() * 50) + 100,
        tokensEarned: Math.floor(Math.random() * 1000) + 2000,
        streakDays: Math.floor(Math.random() * 20) + 5,
        lastSyncedBlock: Date.now()
      };
      
      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Error syncing progress:', error);
    }
  };

  useEffect(() => {
    if (wallet.isConnected) {
      syncProgress();
    } else {
      setUserProgress({
        workoutsCompleted: 0,
        tokensEarned: 0,
        streakDays: 0,
        lastSyncedBlock: 0
      });
    }
  }, [wallet.isConnected]);

  return (
    <Web3Context.Provider
      value={{
        ...wallet,
        userProgress,
        syncProgress
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
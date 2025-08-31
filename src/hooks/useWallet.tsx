import { useState, useCallback } from 'react';

interface WalletProvider {
  name: string;
  key: string;
  icon: string;
  detectMethod: () => boolean;
  connectMethod: () => Promise<string[]>;
  getProvider: () => any;
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
  showWalletSelector: boolean;
  availableWallets: WalletProvider[];
}

export const useWallet = () => {
  const walletProviders: WalletProvider[] = [
    {
      name: 'MetaMask',
      key: 'metamask',
      icon: '🦊',
      detectMethod: () => {
        // Check main ethereum object
        if (window.ethereum?.isMetaMask && !window.ethereum.isPhantom) {
          return true;
        }
        // Check providers array
        if (window.ethereum?.providers) {
          return window.ethereum.providers.some((p: any) => p.isMetaMask && !p.isPhantom);
        }
        return false;
      },
      getProvider: () => {
        if (window.ethereum?.isMetaMask && !window.ethereum.isPhantom) {
          return window.ethereum;
        }
        if (window.ethereum?.providers) {
          return window.ethereum.providers.find((p: any) => p.isMetaMask && !p.isPhantom);
        }
        return window.ethereum;
      },
      connectMethod: () => {
        let provider = window.ethereum;
        if (window.ethereum?.providers) {
          provider = window.ethereum.providers.find((p: any) => p.isMetaMask && !p.isPhantom);
        }
        if (provider && provider.isMetaMask && !provider.isPhantom) {
          return provider.request({ method: 'eth_requestAccounts' });
        }
        throw new Error('MetaMask not available');
      }
    },
    {
      name: 'XDCPay',
      key: 'xdcpay',
      icon: '💎',
      detectMethod: () => {
        // Check for XDCPay specifically
        return typeof window.xdc !== 'undefined' || 
               (typeof window.ethereum !== 'undefined' && window.ethereum.isXDCPay === true) ||
               (window.ethereum?.providers && window.ethereum.providers.some((p: any) => p.isXDCPay));
      },
      getProvider: () => {
        if (window.xdc) return window.xdc;
        if (window.ethereum?.isXDCPay) return window.ethereum;
        return window.xdc;
      },
      connectMethod: () => {
        const provider = window.xdc || (window.ethereum?.isXDCPay ? window.ethereum : null);
        if (provider) {
          return provider.request({ method: 'eth_requestAccounts' });
        }
        throw new Error('XDCPay not available');
      }
    },
    {
      name: 'BlocksScan Wallet',
      key: 'blocksscan',
      icon: '🔷',
      detectMethod: () => {
        // BlocksScan detection - more permissive to show as option
        return typeof window.ethereum !== 'undefined' ||
               (window.ethereum?.providers && window.ethereum.providers.length > 0);
      },
      getProvider: () => {
        if (window.ethereum?.isBlocksScan) {
          return window.ethereum;
        }
        if (window.ethereum?.providers) {
          return window.ethereum.providers.find((p: any) => p.isBlocksScan);
        }
        return window.ethereum;
      },
      connectMethod: () => {
        let provider = window.ethereum;
        if (window.ethereum?.providers) {
          provider = window.ethereum.providers.find((p: any) => p.isBlocksScan);
        }
        if (provider && provider.isBlocksScan) {
          return provider.request({ method: 'eth_requestAccounts' });
        }
        throw new Error('BlocksScan Wallet not available');
      }
    }
  ];

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
    showWalletSelector: false,
    availableWallets: [],
  });

  const detectAvailableWallets = useCallback(() => {
    const detected: WalletProvider[] = [];
    
    // Check for multiple providers in window.ethereum.providers array
    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      window.ethereum.providers.forEach((provider: any) => {
        walletProviders.forEach(walletDef => {
          if (walletDef.detectMethod()) {
            const existing = detected.find(d => d.key === walletDef.key);
            if (!existing) {
              detected.push(walletDef);
            }
          }
        });
      });
    }
    
    // Also check individual wallet detection methods
    walletProviders.forEach(provider => {
      if (provider.detectMethod()) {
        const existing = detected.find(d => d.key === provider.key);
        if (!existing) {
          detected.push(provider);
        }
      }
    });
    
    return detected;
  }, []);

  const connectSpecificWallet = useCallback(async (provider: WalletProvider) => {
    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
      showWalletSelector: false,
    }));

    try {
      // Ensure we're using the correct provider instance
      const walletProvider = provider.getProvider();
      if (!walletProvider) {
        throw new Error(`${provider.name} is not available`);
      }

      const accounts = await provider.connectMethod();

      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
          showWalletSelector: false,
          availableWallets: [],
        });
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || `Failed to connect ${provider.name}`,
        showWalletSelector: true,
        availableWallets: detectAvailableWallets(),
      }));
    }
  }, [detectAvailableWallets]);

  const connectWallet = useCallback(async () => {
    // Always show all 3 wallet options regardless of detection
    const walletsToShow = walletProviders;
    
    setWalletState(prev => ({
      ...prev,
      showWalletSelector: true,
      availableWallets: walletsToShow,
    }));
  }
  )

  const hideWalletSelector = useCallback(() => {
    setWalletState(prev => ({
      ...prev,
      showWalletSelector: false,
      availableWallets: [],
    }));
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
      showWalletSelector: false,
      availableWallets: [],
    });
  }, []);

  return {
    ...walletState,
    connectWallet,
    connectSpecificWallet,
    hideWalletSelector,
    disconnectWallet,
  };
};
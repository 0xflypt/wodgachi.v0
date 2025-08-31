import React, { useState, useEffect } from 'react';
import { Wallet, Zap, Shield, AlertCircle, CheckCircle, Sparkles, X } from 'lucide-react';
import { useWallet } from '../hooks/useWallet.tsx';

interface WalletConnectionProps {
  isDarkMode: boolean;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ isDarkMode }) => {
  const { 
    isConnected, 
    address, 
    isConnecting, 
    error, 
    showWalletSelector,
    availableWallets,
    connectWallet, 
    connectSpecificWallet,
    hideWalletSelector,
    disconnectWallet 
  } = useWallet();
  const [showAnimation, setShowAnimation] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setShowAnimation(true);
      setPulseEffect(true);
      setTimeout(() => {
        setShowAnimation(false);
        setPulseEffect(false);
      }, 2000);
    }
  }, [isConnected]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getConnectionStatus = () => {
    if (isConnecting) {
      return {
        icon: <Zap className="h-5 w-5 animate-spin" />,
        text: 'Connecting...',
        color: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
      };
    }
    
    if (isConnected) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: 'Connected',
        color: isDarkMode ? 'text-green-400' : 'text-green-600'
      };
    }
    
    return {
      icon: <Wallet className="h-5 w-5" />,
      text: 'Connect Wallet',
      color: isDarkMode ? 'text-red-400' : 'text-gray-600'
    };
  };

  const status = getConnectionStatus();

  return (
    <div className="relative">
      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className={`relative w-96 max-w-[90vw] rounded-2xl shadow-2xl border-4 p-6 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-red-900 via-gray-800 to-gray-900 border-red-600'
              : 'bg-gradient-to-br from-gray-100 via-yellow-100 to-gray-200 border-yellow-400'
          }`}>
            {/* Close Button */}
            <button
              onClick={hideWalletSelector}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                isDarkMode 
                  ? 'bg-red-800 hover:bg-red-900 text-yellow-200'
                  : 'bg-gray-600 hover:bg-gray-700 text-yellow-100'
              }`}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-yellow-200' : 'text-gray-800'
              }`}>
                Choose Your Wallet
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-red-300' : 'text-gray-600'
              }`}>
                Select a wallet to connect and secure your progress
              </p>
            </div>

            <div className="space-y-3">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.key}
                  onClick={() => connectSpecificWallet(wallet)}
                  disabled={isConnecting}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-red-800/50 to-gray-800/50 border-red-700 hover:border-red-600 text-yellow-200'
                      : 'bg-gradient-to-r from-gray-100/50 to-yellow-100/50 border-gray-300 hover:border-gray-400 text-gray-800'
                  }`}
                >
                  <div className="text-2xl">{wallet.icon}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold">{wallet.name}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-red-300' : 'text-gray-600'
                    }`}>
                      {wallet.key === 'xdcpay' ? 'XDC Network Compatible' : 'Ethereum Compatible'}
                    </div>
                  </div>
                  <Sparkles className={`h-4 w-4 ${
                    isDarkMode ? 'text-red-400' : 'text-gray-500'
                  }`} />
                </button>
              ))}
            </div>

            {availableWallets.length === 0 && (
              <div className={`text-center p-4 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700 text-gray-400'
                  : 'bg-gray-100/50 border-gray-300 text-gray-600'
              }`}>
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No compatible wallets detected</p>
                <p className="text-xs mt-1">Please install MetaMask, XDCPay, or another Web3 wallet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Connection Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`relative p-8 rounded-2xl border-4 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-red-900 via-gray-800 to-gray-900 border-red-600'
              : 'bg-gradient-to-br from-gray-100 via-yellow-100 to-gray-200 border-yellow-400'
          }`}>
            {/* Floating sparkles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-ping"
                  style={{
                    left: `${10 + (i * 8)}%`,
                    top: `${15 + (i * 6)}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s'
                  }}
                >
                  <Sparkles className={`h-4 w-4 ${
                    isDarkMode ? 'text-red-400' : 'text-yellow-500'
                  }`} />
                </div>
              ))}
            </div>
            
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4 animate-bounce">🔗</div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-yellow-200' : 'text-gray-800'
              }`}>
                Wallet Connected! ✨
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-red-300' : 'text-gray-600'
              }`}>
                Your fitness journey is now secured on-chain!
              </p>
              <div className={`mt-4 px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-black/40 border-red-700/50 text-green-400'
                  : 'bg-white/60 border-gray-300/50 text-green-600'
              }`}>
                {address && formatAddress(address)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Wallet Button */}
      <div className="relative">
        {/* Pulse effect when connected */}
        {pulseEffect && (
          <div className={`absolute inset-0 rounded-full animate-ping ${
            isDarkMode 
              ? 'bg-red-600/30'
              : 'bg-yellow-400/30'
          }`}></div>
        )}
        
        <button
          onClick={isConnected ? disconnectWallet : connectWallet}
          disabled={isConnecting}
          className={`relative flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full font-medium transition-all duration-300 border-2 shadow-lg hover:shadow-xl active:scale-95 ${
            isConnected
              ? isDarkMode
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 border-green-400'
                : 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 border-green-300'
              : isConnecting
              ? isDarkMode
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-400 cursor-wait'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300 cursor-wait'
              : isDarkMode
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 border-gray-400'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-300 hover:to-gray-400 border-gray-300'
          }`}
        >
          {/* Connection indicator dot */}
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isConnected 
              ? 'bg-green-400 animate-pulse' 
              : isConnecting 
              ? 'bg-yellow-400 animate-spin' 
              : isDarkMode 
              ? 'bg-red-400' 
              : 'bg-gray-400'
          }`}></div>
          
          <span className="text-white font-bold text-xs sm:text-sm">
            {isConnected ? (
              <span className="hidden sm:inline">
                {formatAddress(address!).slice(0, 8)}
              </span>
            ) : (
              'Connect'
            )}
          </span>
          
          {/* Mobile connected indicator */}
          {isConnected && (
            <span className="sm:hidden text-xs">
              ⛓️
            </span>
          )}
        </button>

        {/* Connection status indicator */}
        {isConnected && (
          <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border ${
            isDarkMode 
              ? 'bg-green-400 border-red-900'
              : 'bg-green-500 border-gray-100'
          } animate-pulse`}></div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-lg border shadow-lg z-30 ${
          isDarkMode 
            ? 'bg-red-900/90 border-red-700 text-red-200'
            : 'bg-red-100/90 border-red-300 text-red-800'
        }`}>
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs">{error}</span>
          </div>
        </div>
      )}

      {/* Web3 Features Indicator */}
      {isConnected && (
        <div className={`absolute top-full left-0 right-0 mt-1 p-1 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-900/90 border-gray-700 text-gray-300'
            : 'bg-white/90 border-gray-300 text-gray-600'
        } shadow-lg`}>
          <div className="flex items-center justify-center space-x-1">
            <Shield className="h-2 w-2" />
            <span className="text-xs font-medium">Progress secured on-chain</span>
            <Sparkles className="h-2 w-2 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
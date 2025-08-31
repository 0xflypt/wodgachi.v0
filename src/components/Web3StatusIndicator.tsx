import React from 'react';
import { Shield, Zap, AlertTriangle, Sparkles } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

interface Web3StatusIndicatorProps {
  isDarkMode: boolean;
}

const Web3StatusIndicator: React.FC<Web3StatusIndicatorProps> = ({ isDarkMode }) => {
  const { isConnected, userProgress } = useWeb3();

  if (!isConnected) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-600 text-gray-400'
          : 'bg-gray-200/50 border-gray-400 text-gray-600'
      }`}>
        <AlertTriangle className="h-3 w-3" />
        <span className="text-xs font-medium">Offline Mode</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 animate-pulse ${
      isDarkMode 
        ? 'bg-gradient-to-r from-green-800/50 to-green-900/50 border-green-600 text-green-200'
        : 'bg-gradient-to-r from-green-200/50 to-green-300/50 border-green-400 text-green-800'
    }`}>
      <Shield className="h-3 w-3" />
      <span className="text-xs font-medium">On-Chain</span>
      <Sparkles className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
    </div>
  );
};

export default Web3StatusIndicator;
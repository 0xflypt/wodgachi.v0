import React, { useState } from 'react';
import { Upload, Download, Zap, Shield, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

interface Web3ProgressSyncProps {
  isDarkMode: boolean;
  userTokens: number;
  userWorkouts: number;
  userStreak: number;
}

const Web3ProgressSync: React.FC<Web3ProgressSyncProps> = ({ 
  isDarkMode, 
  userTokens, 
  userWorkouts, 
  userStreak 
}) => {
  const { isConnected, userProgress, syncProgress } = useWeb3();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncProgress();
    setLastSyncTime(new Date());
    setTimeout(() => setIsSyncing(false), 1500);
  };

  if (!isConnected) {
    return (
      <div className={`rounded-xl p-4 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
          : 'bg-gradient-to-br from-gray-100/50 to-gray-200/50 border-gray-300'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          <AlertCircle className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`} />
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Connect wallet to sync progress on-chain
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 border-2 relative overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700'
        : 'bg-gradient-to-br from-green-100/30 to-green-200/30 border-green-400'
    }`}>
      {/* Animated background pattern */}
      <div className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}>
        <div className="grid grid-cols-6 grid-rows-4 h-full w-full">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className={`border animate-pulse ${
                isDarkMode ? 'border-green-400/20' : 'border-green-500/15'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-bold ${
              isDarkMode ? 'text-green-200' : 'text-green-800'
            }`}>
              Blockchain Progress
            </h3>
            <Sparkles className="h-4 w-4 text-green-400 animate-pulse" />
          </div>
          
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg font-medium text-xs transition-all duration-200 active:scale-95 ${
              isSyncing
                ? isDarkMode
                  ? 'bg-yellow-700 text-yellow-200 cursor-wait'
                  : 'bg-yellow-600 text-yellow-100 cursor-wait'
                : isDarkMode
                  ? 'bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-green-100'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-green-100'
            }`}
          >
            {isSyncing ? (
              <>
                <Zap className="h-3 w-3 animate-spin" />
                <span>Syncing...</span>
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
                <span>Sync</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Comparison */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className={`text-center p-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-black/30 border-green-700/50'
              : 'bg-white/50 border-green-300/50'
          }`}>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-green-200' : 'text-green-800'
            }`}>
              {userProgress.tokensEarned || userTokens}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              CRUSH Tokens
            </div>
          </div>
          
          <div className={`text-center p-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-black/30 border-green-700/50'
              : 'bg-white/50 border-green-300/50'
          }`}>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-green-200' : 'text-green-800'
            }`}>
              {userProgress.workoutsCompleted || userWorkouts}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              Workouts
            </div>
          </div>
          
          <div className={`text-center p-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-black/30 border-green-700/50'
              : 'bg-white/50 border-green-300/50'
          }`}>
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-green-200' : 'text-green-800'
            }`}>
              {userProgress.streakDays || userStreak}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-green-300' : 'text-green-600'
            }`}>
              Day Streak
            </div>
          </div>
        </div>

        {/* Last Sync Info */}
        {lastSyncTime && (
          <div className={`text-center text-xs ${
            isDarkMode ? 'text-green-400' : 'text-green-600'
          }`}>
            <CheckCircle className="h-3 w-3 inline mr-1" />
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Web3ProgressSync;
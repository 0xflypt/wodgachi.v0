import React from 'react';
import { User, Trophy, Settings, Home, Sun, Moon } from 'lucide-react';
import WalletConnection from './WalletConnection';

interface HeaderProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, currentView, onViewChange, isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-red-900 via-red-800 via-red-900 to-gray-900 shadow-2xl border-b-4 border-red-700">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl sm:text-3xl">🐹</div>
            <div>
              <h1 className={`text-lg sm:text-2xl font-medium transition-all duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-gray-800 hover:text-gray-900'
              }`}>WODgachi</h1>
              <p className={`text-xs transition-colors duration-300 ${
                isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-gray-600 hover:text-gray-700'
              }`}>with {user.creature.name}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center space-x-2 lg:space-x-4">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg font-medium transition-all active:scale-95 ${
                isDarkMode
                  ? 'text-red-300 hover:text-yellow-200 hover:bg-red-800'
                  : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-200'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => onViewChange('dashboard')}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                currentView === 'dashboard'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200 hover:text-yellow-100 shadow-lg'
                    : 'bg-yellow-400 text-gray-800 hover:text-gray-900 shadow-lg'
                  : isDarkMode
                    ? 'text-red-300 hover:text-yellow-200 hover:bg-red-800'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-200'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm lg:text-base">Dashboard</span>
            </button>
            
            <button
              onClick={() => onViewChange('leaderboard')}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                currentView === 'leaderboard'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200 hover:text-yellow-100 shadow-lg'
                    : 'bg-yellow-400 text-gray-800 hover:text-gray-900 shadow-lg'
                  : isDarkMode
                    ? 'text-red-300 hover:text-yellow-200 hover:bg-red-800'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-200'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="text-sm lg:text-base">Leaderboard</span>
            </button>
            
            <button
              onClick={() => onViewChange('profile')}
              className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg font-medium transition-all active:scale-95 ${
                currentView === 'profile'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200 hover:text-yellow-100 shadow-lg'
                    : 'bg-yellow-400 text-gray-800 hover:text-gray-900 shadow-lg'
                  : isDarkMode
                    ? 'text-red-300 hover:text-yellow-200 hover:bg-red-800'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-200'
              }`}
            >
              <span className="text-sm">❤️‍🩹</span>
              <span className="text-sm lg:text-base">Rewards</span>
            </button>
          </nav>

          {/* Mobile Navigation */}
          <nav className="flex sm:hidden items-center space-x-1">
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-all active:scale-95 ${
                isDarkMode
                  ? 'text-red-300 hover:text-yellow-200'
                  : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onViewChange('dashboard')}
              className={`p-2 rounded-lg transition-all active:scale-95 ${
                currentView === 'dashboard'
                  ? isDarkMode ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200' : 'bg-yellow-400 text-gray-800'
                  : isDarkMode ? 'text-red-300 hover:text-yellow-200' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              <Home className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange('leaderboard')}
              className={`p-2 rounded-lg transition-all active:scale-95 ${
                currentView === 'leaderboard'
                  ? isDarkMode ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200' : 'bg-yellow-400 text-gray-800'
                  : isDarkMode ? 'text-red-300 hover:text-yellow-200' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              <Trophy className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewChange('profile')}
              className={`p-2 rounded-lg transition-all active:scale-95 ${
                currentView === 'profile'
                  ? isDarkMode ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-yellow-200' : 'bg-yellow-400 text-gray-800'
                  : isDarkMode ? 'text-red-300 hover:text-yellow-200' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              <span className="text-sm">❤️‍🩹</span>
            </button>
          </nav>
          {/* User Info and Heart Happiness Pill */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Web3 Wallet Connection */}
            <WalletConnection isDarkMode={isDarkMode} />
            
            {/* Heart Happiness Pill - keeping it exactly as requested */}
            <div className={`px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg border-2 transition-all duration-300 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400 hover:from-gray-400 hover:to-gray-500'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 border-gray-300 hover:from-gray-300 hover:to-gray-400'
            }`}>
              <span className="text-white text-sm">💖</span>
              <span className="text-white font-bold text-xs sm:text-sm">{user.creature.happiness}%</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-2">
              <User className={`h-4 sm:h-5 w-4 sm:w-5 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <div className="text-right">
                <div className={`hover:brightness-110 transition-all duration-300 font-medium text-sm ${
                  isDarkMode ? 'text-yellow-200' : 'text-yellow-200'
                }`}>{user.name}</div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Level {user.level}</div>
              </div>
            </div>
            
            <div className={`px-2 sm:px-3 py-1 rounded-full border-2 transition-all duration-300 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-red-400'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 border-yellow-300'
            }`}>
              <span className={`font-bold text-xs sm:text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-gray-800 hover:text-gray-900'
              }`}>{user.tokens} CRUSH</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
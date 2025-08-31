import React from 'react';
import { TrendingUp, Target, Calendar, Zap, Award, Flame } from 'lucide-react';
import { User } from '../types';

interface ProgressTrackerProps {
  user: User;
  isDarkMode: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ user, isDarkMode }) => {
  const progressPercentage = user.goal.current && user.goal.target 
    ? Math.max(0, Math.min(100, ((user.goal.target - user.goal.current) / (user.goal.target - (user.goal.current + 10))) * 100))
    : 0;

  const levelProgress = ((user.tokens % 500) / 500) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Goal Progress */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700'
          : 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-500'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
          }`}>Goal Progress</h3>
          <Target className={`h-5 w-5 ${
            isDarkMode ? 'text-red-400' : 'text-yellow-100'
          }`} />
        </div>
        
        <div className="mb-4">
          <div className={`flex justify-between text-sm mb-2 ${
            isDarkMode ? 'text-red-300' : 'text-yellow-100'
          }`}>
            <span>Current: {user.goal.current}kg</span>
            <span>Target: {user.goal.target}kg</span>
          </div>
          <div className={`w-full rounded-full h-3 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
          }`}>
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-red-600 to-red-800'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className={`text-center mt-2 text-sm font-medium ${
            isDarkMode ? 'text-red-300' : 'text-yellow-100'
          }`}>
            {Math.round(progressPercentage)}% Complete
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-red-400' : 'text-yellow-100'
            }`}>{user.timeline}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>Weeks Timeline</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-red-400' : 'text-yellow-100'
            }`}>
              {user.goal.current && user.goal.target ? Math.abs(user.goal.current - user.goal.target) : 0}kg
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>To Go</div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700'
          : 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-500'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
          }`}>Level Progress</h3>
          <Award className={`h-5 w-5 ${
            isDarkMode ? 'text-red-400' : 'text-yellow-100'
          }`} />
        </div>
        
        <div className="text-center mb-4">
          <div className={`text-3xl font-bold ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
          }`}>Level {user.level}</div>
          <div className={`text-sm ${
            isDarkMode ? 'text-red-300' : 'text-yellow-100'
          }`}>FitQuest Champion</div>
        </div>

        <div className="mb-4">
          <div className={`flex justify-between text-sm mb-2 ${
            isDarkMode ? 'text-red-300' : 'text-yellow-100'
          }`}>
            <span>{user.tokens % 500} CRUSH</span>
            <span>{500} CRUSH</span>
          </div>
          <div className={`w-full rounded-full h-3 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
          }`}>
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-red-600 to-red-800'
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
              }`}
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
          <div className={`text-center mt-2 text-sm font-medium ${
            isDarkMode ? 'text-red-300' : 'text-yellow-100'
          }`}>
            {500 - (user.tokens % 500)} CRUSH to next level
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={`rounded-xl shadow-lg p-6 md:col-span-2 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700'
          : 'bg-gradient-to-r from-gray-600 to-gray-800 border-gray-500'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
          }`}>Activity Stats</h3>
          <TrendingUp className={`h-5 w-5 ${
            isDarkMode ? 'text-red-400' : 'text-yellow-100'
          }`} />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 border-2 ${
              isDarkMode 
                ? 'bg-red-900 border-red-700'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <Zap className={`h-6 w-6 ${
                isDarkMode ? 'text-red-300' : 'text-yellow-100'
              }`} />
            </div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
            }`}>{user.totalWorkouts}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>Total Workouts</div>
          </div>
          
          <div className="text-center">
            <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 border-2 ${
              isDarkMode 
                ? 'bg-red-900 border-red-700'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <Flame className={`h-6 w-6 ${
                isDarkMode ? 'text-red-300' : 'text-yellow-100'
              }`} />
            </div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
            }`}>{user.streak}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>Day Streak</div>
          </div>
          
          <div className="text-center">
            <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 border-2 ${
              isDarkMode 
                ? 'bg-red-900 border-red-700'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <Award className={`h-6 w-6 ${
                isDarkMode ? 'text-red-300' : 'text-yellow-100'
              }`} />
            </div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
            }`}>{user.tokens}</div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>CRUSH Tokens</div>
          </div>
          
          <div className="text-center">
            <div className={`p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 border-2 ${
              isDarkMode 
                ? 'bg-red-900 border-red-700'
                : 'bg-gray-700 border-gray-600'
            }`}>
              <Calendar className={`h-6 w-6 ${
                isDarkMode ? 'text-red-300' : 'text-yellow-100'
              }`} />
            </div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-yellow-200' : 'text-yellow-100'
            }`}>
              {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-yellow-100'
            }`}>Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
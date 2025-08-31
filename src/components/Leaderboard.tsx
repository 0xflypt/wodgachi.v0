import React from 'react';
import { Trophy, Medal, Award, Flame, TrendingUp, Sparkles, Crown } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  data: LeaderboardEntry[];
  currentUserId: string;
  isDarkMode: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ data, currentUserId, isDarkMode }) => {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400" />;
      case 2: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <span className={`text-lg font-bold ${
        isDarkMode ? 'text-gray-600' : 'text-gray-700'
      }`}>#{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    if (isDarkMode) {
      switch (index) {
        case 0: return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
        case 1: return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
        case 2: return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
        default: return 'bg-gray-50 border-gray-200';
      }
    } else {
      switch (index) {
        case 0: return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
        case 1: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
        case 2: return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300';
        default: return 'bg-gray-900 border-gray-700';
      }
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
      <div className={`rounded-xl shadow-lg p-6 mb-6 border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700'
          : 'bg-gradient-to-br from-gray-100 to-yellow-100 border-gray-300'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Crown className={`h-8 w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <Crown className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-gray-600'}`} />
            <div>
              <h2 className={`text-2xl font-bold ${
                isDarkMode ? 'text-yellow-200' : 'text-gray-800'
              }`}>WOD Winners 🏆</h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Top trainers and their companions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Weekly Quest</span>
              <p className="text-sm text-purple-600">Top trainers and their companions</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 ${
            isDarkMode ? 'text-red-400' : 'text-gray-700'
          }`}>
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Weekly Quest</span>
          </div>
        </div>

        <div className="space-y-4">
          {data.map((entry, index) => (
            <div
              key={entry.userId}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                getRankBg(index)
              } ${entry.userId === currentUserId ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="h-12 w-12 rounded-full border-2 border-purple-400"
                  />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                      }`}>{entry.name}</h3>
                      {entry.userId === currentUserId && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-red-800 text-red-200'
                            : 'bg-gray-600 text-gray-100'
                        }`}>
                          You
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center space-x-4 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span>Level {entry.level}</span>
                      <div className="flex items-center space-x-1">
                        <Flame className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <Flame className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                        <span>{entry.streak} day streak</span>
                      </div>
                      <span>{entry.totalWorkouts} workouts</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-200">
                    {entry.points.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>CRUSH Points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`rounded-xl shadow-lg p-6 relative overflow-hidden border-2 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-red-900 via-gray-800 to-gray-900 text-white border-red-700'
          : 'bg-gradient-to-r from-gray-100 via-yellow-100 to-gray-200 text-gray-800 border-gray-300'
      }`}>
        <div className="absolute inset-0 opacity-20">
          <Sparkles className="absolute top-4 right-4 h-8 w-8 animate-pulse" />
          <Sparkles className="absolute bottom-4 left-4 h-6 w-6 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <h3 className={`text-xl font-bold mb-3 ${
          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
        }`}>🎁 Weekly WOD Rewards</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">1,000 CRUSH</div>
            <div className="text-sm opacity-90">🥇 Champion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">500 CRUSH</div>
            <div className="text-sm opacity-90">🥈 Hero</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">250 CRUSH</div>
            <div className="text-sm opacity-90">🥉 Warrior</div>
          </div>
        </div>
        <div className={`mt-4 text-sm opacity-90 ${
          isDarkMode ? 'text-white' : 'text-gray-700'
        }`}>
          Quest resets every Sunday - help Hammy climb the ranks! ✨
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
import React, { useState, useEffect } from 'react';
import { Heart, Zap, Star, Crown, Sparkles, Gift, Settings, Palette } from 'lucide-react';
import { CreatureCompanion as CreatureType } from '../types';
import { useWeb3 } from '../context/Web3Context';
import Web3StatusIndicator from './Web3StatusIndicator';
import hammyImage from '../assets/hammy.png';

interface CreatureCompanionProps {
  creature: CreatureType;
  userLevel: number;
  isDarkMode: boolean;
  onFeedCreature: () => void;
  onPlayWithCreature: () => void;
  recentWorkout?: boolean;
}

const CreatureCompanion: React.FC<CreatureCompanionProps> = ({ 
  creature, 
  userLevel, 
  isDarkMode,
  onFeedCreature, 
  onPlayWithCreature,
  recentWorkout = false 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const { isConnected } = useWeb3();

  useEffect(() => {
    if (recentWorkout) {
      setIsAnimating(true);
      setShowHearts(true);
      setTimeout(() => {
        setIsAnimating(false);
        setShowHearts(false);
      }, 3000);
    }
  }, [recentWorkout]);

  // Animate wheel rotation based on creature's wheel speed
  useEffect(() => {
    const interval = setInterval(() => {
      setWheelRotation(prev => (prev + creature.wheelSpeed / 10) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [creature.wheelSpeed]);

  const getCreatureEmoji = () => {
    // For hamster type, we'll use the custom image
    if (creature.type === 'hamster') {
      return null; // We'll render the image separately
    }
    
    // Keep emojis for other creature types
    const creatures = {
      bunny: creature.level < 5 ? '🐰' : creature.level < 10 ? '🐰💫' : '🐰👑💫',
      cat: creature.level < 5 ? '🐱' : creature.level < 10 ? '🐱✨' : '🐱👑✨',
      dog: creature.level < 5 ? '🐶' : creature.level < 10 ? '🐶💫' : '🐶👑💫',
      fox: creature.level < 5 ? '🦊' : creature.level < 10 ? '🦊✨' : '🦊👑✨',
      panda: creature.level < 5 ? '🐼' : creature.level < 10 ? '🐼💫' : '🐼👑💫',
      koala: creature.level < 5 ? '🐨' : creature.level < 10 ? '🐨✨' : '🐨👑✨',
      penguin: creature.level < 5 ? '🐧' : creature.level < 10 ? '🐧💫' : '🐧👑💫'
    };
    return creatures[creature.type];
  };

  const getMoodMessage = () => {
    const messages = {
      happy: `${creature.name} is vibing! Ready to get swole? 😊`,
      excited: `${creature.name} is HYPED for some cardio! 🎉`,
      sleepy: `${creature.name} needs a power nap... gentle workout? 😴`,
      energetic: `${creature.name} is bouncing off the walls! LET'S GO! ⚡`,
      proud: `${creature.name} is flexing those gains! 🏆`,
      running: `${creature.name} is crushing it on the wheel! 🏃‍♂️`
    };
    return messages[creature.mood];
  };

  const getBackgroundStyle = () => {
    const backgrounds = {
      default: 'from-gray-800 via-purple-800 to-gray-900',
      matrix: 'from-purple-900 via-gray-800 to-black',
      stars: 'from-purple-900 via-gray-900 to-black',
      'cyber-city': 'from-purple-800 via-gray-700 to-purple-900',
      rainbow: 'from-purple-600 via-gray-600 via-purple-700 via-gray-700 to-purple-800'
    };
    return backgrounds[creature.customization.background];
  };

  const getWheelStyle = () => {
    const wheels = {
      basic: isDarkMode 
        ? 'border-gray-600 bg-gray-700/50' 
        : 'border-gray-400 bg-gray-300/50',
      neon: isDarkMode 
        ? 'border-gray-400 bg-gradient-to-r from-gray-600/50 to-gray-800/50 shadow-lg shadow-gray-500/30'
        : 'border-yellow-400 bg-gradient-to-r from-yellow-300/50 to-yellow-500/50 shadow-lg shadow-yellow-400/30',
      rainbow: isDarkMode 
        ? 'border-transparent bg-gradient-to-r from-gray-600/50 via-gray-600/50 via-gray-700/50 via-gray-700/50 to-gray-800/50'
        : 'border-transparent bg-gradient-to-r from-yellow-300/50 via-gray-300/50 via-yellow-400/50 via-gray-400/50 to-yellow-500/50',
      cyber: isDarkMode 
        ? 'border-gray-400 bg-gradient-to-r from-gray-700/50 to-gray-700/50 shadow-lg shadow-gray-500/30'
        : 'border-yellow-400 bg-gradient-to-r from-yellow-400/50 to-gray-400/50 shadow-lg shadow-yellow-400/30',
      holographic: isDarkMode 
        ? 'border-transparent bg-gradient-to-r from-gray-600/50 via-gray-600/50 via-gray-700/50 to-gray-700/50 animate-pulse'
        : 'border-transparent bg-gradient-to-r from-yellow-300/50 via-gray-300/50 via-yellow-400/50 to-gray-400/50 animate-pulse'
    };
    return wheels[creature.customization.wheelType];
  };

  return (
    <div className={`rounded-xl p-4 shadow-xl relative overflow-hidden h-full flex flex-col ${
      isDarkMode 
        ? 'bg-gradient-to-br from-red-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-yellow-50 to-gray-100'
    }`}>
      {/* Y2K Grid Pattern Overlay */}
      <div className={`absolute inset-0 ${isDarkMode ? 'opacity-10' : 'opacity-5'}`}>
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {[...Array(64)].map((_, i) => (
            <div key={i} className={`border ${
              isDarkMode ? 'border-red-400/30' : 'border-yellow-400/20'
            }`}></div>
          ))}
        </div>
      </div>

      {/* Floating hearts animation */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-2xl"
              style={{
                left: `${15 + i * 10}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              💜
            </div>
          ))}
        </div>
      )}

      {/* Y2K Sparkles */}
      <div className={`absolute inset-0 z-10 ${isDarkMode ? 'opacity-30' : 'opacity-20'}`}>
        <div className="absolute top-4 right-4 text-2xl animate-spin">🔮</div>
        <div className="absolute bottom-6 left-6 text-xl animate-bounce" style={{ animationDelay: '1s' }}>❤️</div>
        <div className="absolute top-1/2 left-1/4 text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>🔥</div>
        <div className="absolute top-1/4 right-1/3 text-xl animate-spin" style={{ animationDelay: '2s' }}>🌟</div>
      </div>

      <div className="relative z-20">
        {/* Web3 Status Indicator */}
        <div className="mb-3">
          <Web3StatusIndicator isDarkMode={isDarkMode} />
        </div>
        
        {/* Hamster Wheel Section */}
        <div className="text-center mb-4 flex-1 flex flex-col justify-center p-4">
          <div className="relative inline-block">
            {/* Wheel */}
            <div className="w-32 h-32 mx-auto relative">
              {/* Matte background overlay for better character visibility */}
              <div className={`absolute inset-0 rounded-full shadow-inner ${
                isDarkMode ? 'bg-yellow-100/80' : 'bg-yellow-50/90'
              }`}></div>
              <div className={`absolute inset-0 rounded-full ${
                isDarkMode ? 'bg-yellow-200/30' : 'bg-gray-200/40'
              }`}></div>
              <div 
                className={`w-full h-full rounded-full border-6 ${getWheelStyle()} relative`}
                style={{ transform: `rotate(${wheelRotation}deg)` }}
              >
                {/* Wheel spokes - muted for better character visibility */}
                <div className={`absolute inset-3 border rounded-full ${
                  isDarkMode ? 'border-gray-400/30' : 'border-gray-500/40'
                }`}></div>
                <div className={`absolute top-1/2 left-1/2 w-0.5 h-full transform -translate-x-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'bg-gray-400/30' : 'bg-gray-500/40'
                }`}></div>
                <div className={`absolute top-1/2 left-1/2 w-full h-0.5 transform -translate-x-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'bg-gray-400/30' : 'bg-gray-500/40'
                }`}></div>
                <div className={`absolute top-1/2 left-1/2 w-full h-0.5 transform -translate-x-1/2 -translate-y-1/2 ${
                  isDarkMode ? 'bg-gray-300/50' : 'bg-gray-400/50'
                }`}></div>
              </div>
            
              {/* Creature on wheel - Properly centered */}
              <div
                className={`absolute top-1/2 left-1/2 text-4xl z-20 ${
                  isAnimating ? 'hammy-excited' : 
                  creature.mood === 'running' ? 'hammy-bounce' : 
                  creature.mood === 'excited' ? 'hammy-excited' : 
                  recentWorkout ? 'hammy-excited' : ''
                }`}
                style={{
                  transform: `translate(-50%, -50%) ${isAnimating || recentWorkout ? 'scale(1.1)' : 'scale(1)'}`,
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                🐹
                {creature.level >= 10 && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg">
                    👑
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={`backdrop-blur-sm rounded-lg p-3 border mt-4 ${
            isDarkMode 
              ? `bg-black/40 border-red-700/30 ${isConnected ? 'ring-1 ring-green-500/30' : ''}`
              : `bg-white/70 border-gray-300/50 ${isConnected ? 'ring-1 ring-green-500/30' : ''}`
          }`}>
            <h3 className={`text-lg font-bold mb-1 transition-all duration-300 cursor-pointer ${
              isDarkMode 
                ? `text-yellow-200 hover:text-yellow-100 ${isConnected ? 'drop-shadow-lg' : ''}` 
                : `text-gray-800 hover:text-gray-900 ${isConnected ? 'drop-shadow-lg' : ''}`
            }`}>
              {creature.name} 
              <span className="text-sm ml-2">Lv.{creature.level}</span>
              {isConnected && <span className="text-xs ml-1">⛓️</span>}
            </h3>
            <p className={`text-xs mb-2 ${
              isDarkMode ? 'text-red-200' : 'text-gray-700'
            }`}>{getMoodMessage()}</p>
            <div className={`text-xs ${
              isDarkMode ? 'text-red-300' : 'text-gray-600'
            }`}>
              Wheel Speed: {creature.wheelSpeed}% 🏃‍♂️ {isConnected && '• Blockchain Secured ⛓️'}
            </div>
          </div>
        </div>

        {/* Y2K Stats Display */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className={`backdrop-blur-sm rounded-lg p-2 border ${
            isDarkMode 
              ? 'bg-black/40 border-red-700/50'
              : 'bg-white/60 border-gray-300/50'
          }`}>
            <div className="flex items-center justify-center mb-1">
              <Heart className={`h-3 w-3 mr-1 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
              <span className={`text-xs font-bold hover:brightness-110 transition-all duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-gray-800 hover:text-gray-900'
              }`}>HAPPY</span>
            </div>
            <div className={`w-full rounded-full h-1.5 border ${
              isDarkMode 
                ? 'bg-black/50 border-red-700/30'
                : 'bg-gray-200/80 border-gray-300/50'
            }`}>
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-red-600 to-red-800'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}
                style={{ width: `${creature.happiness}%` }}
              ></div>
            </div>
            <span className={`text-xs font-mono text-center block ${
              isDarkMode ? 'text-red-300' : 'text-gray-600'
            }`}>{creature.happiness}%</span>
          </div>

          <div className={`backdrop-blur-sm rounded-lg p-2 border ${
            isDarkMode 
              ? 'bg-black/40 border-red-700/50'
              : 'bg-white/60 border-gray-300/50'
          }`}>
            <div className="flex items-center justify-center mb-1">
              <Zap className={`h-3 w-3 mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs font-bold hover:brightness-110 transition-all duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-gray-800 hover:text-gray-900'
              }`}>ENERGY</span>
            </div>
            <div className={`w-full rounded-full h-1.5 border ${
              isDarkMode 
                ? 'bg-black/50 border-red-700/30'
                : 'bg-gray-200/80 border-gray-300/50'
            }`}>
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-red-500 to-red-700'
                    : 'bg-gradient-to-r from-gray-500 to-gray-700'
                }`}
                style={{ width: `${creature.energy}%` }}
              ></div>
            </div>
            <span className={`text-xs font-mono text-center block ${
              isDarkMode ? 'text-red-300' : 'text-gray-600'
            }`}>{creature.energy}%</span>
          </div>

          <div className={`backdrop-blur-sm rounded-lg p-2 border ${
            isDarkMode 
              ? 'bg-black/40 border-red-700/50'
              : 'bg-white/60 border-gray-300/50'
          }`}>
            <div className="flex items-center justify-center mb-1">
              <Star className={`h-3 w-3 mr-1 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
              <span className={`text-xs font-bold hover:brightness-110 transition-all duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-gray-800 hover:text-gray-900'
              }`}>EVO</span>
            </div>
            <div className={`w-full rounded-full h-1.5 border ${
              isDarkMode 
                ? 'bg-black/50 border-red-700/30'
                : 'bg-gray-200/80 border-gray-300/50'
            }`}>
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-red-600 to-red-800'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}
                style={{ width: `${creature.evolution}%` }}
              ></div>
            </div>
            <span className={`text-xs font-mono text-center block ${
              isDarkMode ? 'text-red-300' : 'text-gray-600'
            }`}>{creature.evolution}%</span>
          </div>
        </div>

        {/* Y2K Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onFeedCreature}
            className={`py-1.5 px-2 rounded-lg font-bold text-xs transition-all duration-200 shadow-lg hover:shadow-xl border flex items-center justify-center space-x-1 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-800 to-gray-800 hover:from-red-900 hover:to-gray-900 text-yellow-200 hover:text-yellow-100 border-red-700'
                : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-yellow-100 hover:text-yellow-50 border-gray-500'
            }`}
          >
            <Gift className="h-3 w-3" />
            <span>FEED</span>
          </button>
          
          <button
            onClick={onPlayWithCreature}
            className={`py-1.5 px-2 rounded-lg font-bold text-xs transition-all duration-200 shadow-lg hover:shadow-xl border flex items-center justify-center space-x-1 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-800 to-gray-800 hover:from-red-900 hover:to-gray-900 text-yellow-200 hover:text-yellow-100 border-red-700'
                : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-yellow-100 hover:text-yellow-50 border-gray-500'
            }`}
          >
            <Heart className="h-3 w-3" />
            <span>PLAY</span>
          </button>
          
          <button
            className={`py-1.5 px-2 rounded-lg font-bold text-xs transition-all duration-200 shadow-lg hover:shadow-xl border flex items-center justify-center space-x-1 active:scale-95 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-700 to-gray-700 hover:from-red-800 hover:to-gray-800 text-yellow-200 hover:text-yellow-100 border-red-600'
                : 'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-yellow-100 hover:text-yellow-50 border-gray-400'
            }`}
          >
            <Palette className="h-3 w-3" />
            <span>STYLE</span>
          </button>
        </div>

        {/* Evolution Alert */}
        {creature.evolution > 80 && (
          <div className={`mt-3 p-2 rounded-lg border backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gradient-to-r from-red-800/90 to-gray-800/90 border-red-700'
              : 'bg-gradient-to-r from-gray-600/90 to-gray-800/90 border-gray-500'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="text-lg animate-bounce" style={{ animationDuration: '0.8s' }}>🔮</div>
              <span className={`text-xs font-bold drop-shadow hover:brightness-110 transition-all duration-300 ${
                isDarkMode ? 'text-yellow-200 hover:text-yellow-100' : 'text-yellow-100 hover:text-yellow-50'
              }`}>
                {creature.name} is ready to LEVEL UP! Keep grinding! ✨
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatureCompanion;
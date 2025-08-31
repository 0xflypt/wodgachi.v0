import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Zap, Target, Clock, Heart } from 'lucide-react';
import { Exercise } from '../types';

interface WorkoutDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise;
  isDarkMode: boolean;
}

const WorkoutDemoModal: React.FC<WorkoutDemoModalProps> = ({ 
  isOpen, 
  onClose, 
  exercise, 
  isDarkMode 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      title: "Starting Position",
      description: "Get into the proper starting stance",
      visual: "🧍‍♂️",
      tip: "Keep your core engaged and maintain good posture"
    },
    {
      title: "Movement Phase 1",
      description: "Begin the exercise motion",
      visual: "💪",
      tip: "Focus on controlled movement and proper form"
    },
    {
      title: "Peak Position",
      description: "Reach the full range of motion",
      visual: "🔥",
      tip: "Feel the muscle engagement at this point"
    },
    {
      title: "Return Phase",
      description: "Return to starting position",
      visual: "⚡",
      tip: "Control the negative portion of the movement"
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(prevStep => (prevStep + 1) % demoSteps.length);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, demoSteps.length]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const getExerciseVisual = () => {
    const visuals: { [key: string]: string[] } = {
      'push-ups': ['🧍‍♂️', '🤸‍♂️', '💪', '🔥'],
      'squats': ['🧍‍♂️', '🏋️‍♂️', '💪', '⚡'],
      'burpees': ['🧍‍♂️', '🤸‍♂️', '🏃‍♂️', '🔥'],
      'plank': ['🧍‍♂️', '🤸‍♂️', '💪', '🔥'],
      'jumping-jacks': ['🧍‍♂️', '🤸‍♂️', '⚡', '🔥'],
      'mountain-climbers': ['🤸‍♂️', '🏃‍♂️', '💪', '🔥'],
      'lunges': ['🧍‍♂️', '🏋️‍♂️', '💪', '⚡'],
      'crunches': ['🛌', '🤸‍♂️', '💪', '🔥'],
      'default': ['🧍‍♂️', '💪', '🔥', '⚡']
    };

    const exerciseKey = exercise.name.toLowerCase().replace(/\s+/g, '-');
    const exerciseVisuals = visuals[exerciseKey] || visuals.default;
    return exerciseVisuals[currentStep] || '💪';
  };

  const getMuscleGroups = () => {
    const muscles: { [key: string]: string[] } = {
      'push-ups': ['Chest', 'Shoulders', 'Triceps', 'Core'],
      'squats': ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      'burpees': ['Full Body', 'Cardio', 'Core', 'Legs'],
      'plank': ['Core', 'Shoulders', 'Back'],
      'jumping-jacks': ['Cardio', 'Legs', 'Shoulders'],
      'mountain-climbers': ['Core', 'Cardio', 'Shoulders'],
      'lunges': ['Quadriceps', 'Glutes', 'Hamstrings'],
      'crunches': ['Abs', 'Core'],
      'default': ['Full Body']
    };

    const exerciseKey = exercise.name.toLowerCase().replace(/\s+/g, '-');
    return muscles[exerciseKey] || muscles.default;
  };

  const getWorkoutMedia = () => {
    // Exercise media database - you can expand this with your own videos/GIFs
    const mediaDatabase: { [key: string]: { type: 'video' | 'gif' | 'youtube', url: string } } = {
      'push-ups': {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Replace with actual push-up video
      },
      'squats': {
        type: 'gif',
        url: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif' // Replace with actual squat GIF
      },
      'burpees': {
        type: 'youtube',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Replace with actual burpee video
      },
      'plank': {
        type: 'gif',
        url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif' // Replace with actual plank GIF
      },
      'jumping-jacks': {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' // Replace with actual jumping jacks video
      },
      'mountain-climbers': {
        type: 'gif',
        url: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif' // Replace with actual mountain climbers GIF
      },
      'lunges': {
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' // Replace with actual lunges video
      },
      'crunches': {
        type: 'gif',
        url: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif' // Replace with actual crunches GIF
      }
    };

    const exerciseKey = exercise.name.toLowerCase().replace(/\s+/g, '-');
    return mediaDatabase[exerciseKey] || null;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`relative w-[95vw] h-[90vh] max-w-6xl rounded-2xl shadow-2xl border-4 overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900 via-gray-800 to-gray-900 border-red-700'
          : 'bg-gradient-to-br from-gray-100 via-yellow-100 to-gray-200 border-yellow-400'
      }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Y2K Grid Pattern Overlay */}
        <div className={`absolute inset-0 ${isDarkMode ? 'opacity-5' : 'opacity-3'}`}>
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className={`border ${
                isDarkMode ? 'border-red-400/20' : 'border-yellow-400/15'
              }`}></div>
            ))}
          </div>
        </div>

        {/* Floating Y2K Elements */}
        <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-20' : 'opacity-15'}`}>
          <div className="absolute top-8 right-8 text-4xl animate-spin" style={{ animationDuration: '8s' }}>🔮</div>
          <div className="absolute bottom-12 left-12 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💜</div>
          <div className="absolute top-1/4 left-1/4 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>⚡</div>
          <div className="absolute top-1/3 right-1/4 text-3xl animate-spin" style={{ animationDelay: '2s', animationDuration: '6s' }}>🌟</div>
          <div className="absolute bottom-1/3 right-1/3 text-2xl animate-bounce" style={{ animationDelay: '1.5s' }}>✨</div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-3 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg ${
            isDarkMode 
              ? 'bg-red-800 hover:bg-red-900 text-yellow-200 hover:text-yellow-100 border-2 border-red-700'
              : 'bg-gray-600 hover:bg-gray-700 text-yellow-100 hover:text-yellow-50 border-2 border-gray-400'
          }`}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative z-10 h-full flex flex-col p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className={`text-3xl md:text-4xl font-jetset-bold mb-2 ${
              isDarkMode ? 'text-3d-y2k' : 'text-3d-y2k-light'
            }`}>
              {exercise.name} Demo ✨
            </h1>
            <p className={`text-lg ${
              isDarkMode ? 'text-red-300' : 'text-gray-700'
            }`}>
              Master the perfect form with your digital trainer! 🤖
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Demo Visualization */}
            <div className={`rounded-xl p-6 border-2 relative overflow-hidden ${
              isDarkMode 
                ? 'bg-gradient-to-br from-red-900/90 to-gray-900/90 border-red-700'
                : 'bg-gradient-to-br from-gray-50/90 to-yellow-50/90 border-gray-400'
            }`}>
              <div className="text-center mb-4">
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                }`}>
                  {demoSteps[currentStep].title}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-red-300' : 'text-gray-600'
                }`}>
                  {demoSteps[currentStep].description}
                </p>
              </div>

              {/* 3D Character Display */}
              <div className="flex justify-center items-center h-64 mb-4 relative">
                {getWorkoutMedia() ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    {getWorkoutMedia()?.type === 'video' ? (
                      <video
                        src={getWorkoutMedia()?.url}
                        autoPlay={isPlaying}
                        loop
                        muted={isMuted}
                        className="w-full h-full object-cover rounded-lg"
                        controls={false}
                      />
                    ) : getWorkoutMedia()?.type === 'gif' ? (
                      <img
                        src={getWorkoutMedia()?.url}
                        alt={`${exercise.name} demonstration`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <iframe
                        src={getWorkoutMedia()?.url}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allowFullScreen
                        title={`${exercise.name} demonstration`}
                      />
                    )}
                    
                    {/* Overlay controls for video */}
                    {getWorkoutMedia()?.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={handlePlay}
                          className={`p-4 rounded-full ${
                            isDarkMode 
                              ? 'bg-red-800/80 hover:bg-red-900/80 text-yellow-200'
                              : 'bg-gray-600/80 hover:bg-gray-700/80 text-yellow-100'
                          }`}
                        >
                          {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`w-48 h-48 rounded-full flex items-center justify-center text-8xl transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-800/30 to-gray-800/30 border-4 border-red-700/50'
                      : 'bg-gradient-to-br from-gray-300/30 to-gray-500/30 border-4 border-gray-400/50'
                  } ${isPlaying ? 'animate-pulse' : ''}`}>
                    {getExerciseVisual()}
                  </div>
                )}
                
                {/* Progress Ring */}
                {!getWorkoutMedia() && (
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-52 h-52 rounded-full border-4 border-transparent relative">
                    <div 
                      className={`absolute inset-0 rounded-full border-4 border-transparent transition-all duration-100 ${
                        isDarkMode ? 'border-t-red-600' : 'border-t-gray-600'
                      }`}
                      style={{ 
                        transform: `rotate(${(progress / 100) * 360}deg)`,
                        borderTopColor: isDarkMode ? '#b91c1c' : '#4b5563'
                      }}
                    ></div>
                  </div>
                  </div>
                )}
              </div>

              {/* Pro Tip */}
              <div className={`p-3 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-950/40 border-red-700/50'
                  : 'bg-white/60 border-gray-300/50'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <Target className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-bold ${
                    isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                  }`}>PRO TIP</span>
                </div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-red-300' : 'text-gray-600'
                }`}>
                  {demoSteps[currentStep].tip}
                </p>
              </div>
            </div>

            {/* Exercise Details & Controls */}
            <div className="space-y-4">
              {/* Exercise Stats */}
              <div className={`rounded-xl p-4 border-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/90 to-gray-900/90 border-red-700'
                  : 'bg-gradient-to-br from-gray-50/90 to-yellow-50/90 border-gray-400'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${
                  isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                }`}>Exercise Details 📊</h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {exercise.sets && (
                    <div className={`p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-black/40 border-red-700/50'
                        : 'bg-white/60 border-gray-300/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Zap className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-bold ${
                          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                        }`}>{exercise.sets} Sets</span>
                      </div>
                    </div>
                  )}
                  
                  {exercise.reps && (
                    <div className={`p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-black/40 border-red-700/50'
                        : 'bg-white/60 border-gray-300/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Target className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-bold ${
                          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                        }`}>{exercise.reps} Reps</span>
                      </div>
                    </div>
                  )}
                  
                  {exercise.duration && (
                    <div className={`p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-black/40 border-red-700/50'
                        : 'bg-white/60 border-gray-300/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Clock className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-bold ${
                          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                        }`}>{exercise.duration}s</span>
                      </div>
                    </div>
                  )}
                  
                  {exercise.rest && (
                    <div className={`p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-black/40 border-red-700/50'
                        : 'bg-white/60 border-gray-300/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <Heart className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-bold ${
                          isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                        }`}>{exercise.rest}s Rest</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-black/40 border-red-700/50'
                    : 'bg-white/60 border-gray-300/50'
                }`}>
                  <h4 className={`text-sm font-bold mb-2 ${
                    isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                  }`}>Instructions:</h4>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-red-300' : 'text-gray-600'
                  }`}>
                    {exercise.instructions}
                  </p>
                </div>
              </div>

              {/* Target Muscles */}
              <div className={`rounded-xl p-4 border-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/90 to-gray-900/90 border-red-700'
                  : 'bg-gradient-to-br from-gray-50/90 to-yellow-50/90 border-gray-400'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${
                  isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                }`}>Target Muscles 🎯</h3>
                
                <div className="flex flex-wrap gap-2">
                  {getMuscleGroups().map((muscle, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        isDarkMode 
                          ? 'bg-red-800/30 border-red-700/50 text-red-200'
                          : 'bg-gray-600/30 border-gray-400/50 text-gray-700'
                      }`}
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Demo Controls */}
              <div className={`rounded-xl p-4 border-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-red-900/90 to-gray-900/90 border-red-700'
                  : 'bg-gradient-to-br from-gray-50/90 to-yellow-50/90 border-gray-400'
              }`}>
                <h3 className={`text-lg font-bold mb-3 ${
                  isDarkMode ? 'text-yellow-200' : 'text-gray-800'
                }`}>Demo Controls 🎮</h3>
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={handlePlay}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-red-800 to-gray-800 hover:from-red-900 hover:to-gray-900 text-yellow-200 hover:text-yellow-100'
                        : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-yellow-100 hover:text-yellow-50'
                    }`}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-red-700 to-gray-700 hover:from-red-800 hover:to-gray-800 text-yellow-200 hover:text-yellow-100'
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-yellow-100 hover:text-yellow-50'
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-red-600 to-gray-600 hover:from-red-700 hover:to-gray-700 text-yellow-200 hover:text-yellow-100'
                        : 'bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-yellow-100 hover:text-yellow-50'
                    }`}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Footer */}
          <div className={`mt-6 p-4 rounded-xl border-2 text-center ${
            isDarkMode 
              ? 'bg-gradient-to-r from-red-900/90 to-gray-900/90 border-red-700'
              : 'bg-gradient-to-r from-gray-200/90 to-yellow-200/90 border-gray-400'
          }`}>
            <h3 className={`text-xl font-bold mb-2 ${
              isDarkMode ? 'text-yellow-200' : 'text-gray-800'
            }`}>
              You've Got This, Champion! 🏆
            </h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-gray-600'
            }`}>
              Perfect form leads to perfect gains. Your creature companion believes in you! 💜✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDemoModal;
import React, { useState } from 'react';
import { Clock, Zap, Award, Play, Check, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';
import { Workout } from '../types';
import WorkoutDemoModal from './WorkoutDemoModal';

interface WorkoutCardProps {
  workout: Workout;
  onComplete: (workoutId: string, points: number) => void;
  isCompleted?: boolean;
  isDarkMode?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onComplete, isCompleted = false, isDarkMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
    setTimeout(() => {
      onComplete(workout.id, workout.points);
      setIsStarted(false);
    }, 2000); // Simulate workout completion
  };

  const handleExerciseClick = (exercise: any) => {
    setSelectedExercise(exercise);
    setIsDemoModalOpen(true);
  };

  const handleCloseDemoModal = () => {
    setIsDemoModalOpen(false);
    setSelectedExercise(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 relative ${
      isDarkMode 
        ? 'bg-gradient-to-br from-red-900 to-gray-900 border-red-700 hover:border-red-600'
        : 'bg-gradient-to-br from-gray-100 to-yellow-100 border-gray-300 hover:border-gray-400'
    }`}>
      {/* Decorative sparkles */}
      <div className={`absolute top-2 right-2 opacity-30`}>
        <Sparkles className={`h-4 w-4 ${isDarkMode ? 'text-red-400' : 'text-gray-500'}`} />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold mb-2 ${
              isDarkMode ? 'text-yellow-200' : 'text-gray-800'
            }`}>{workout.title} ✨</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-purple-300' : 'text-gray-600'
            }`}>{workout.description}</p>
          </div>
          {isCompleted && (
            <div className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-800 to-gray-800'
                : 'bg-gradient-to-r from-gray-600 to-gray-800'
            }`}>
              <Check className={`h-5 w-5 animate-pulse ${
                isDarkMode ? 'text-red-300' : 'text-yellow-100'
              }`} />
            </div>
          )}
        </div>

        <div className={`flex items-center space-x-4 mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{workout.duration} min</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
            {workout.difficulty}
          </span>
          <div className={`flex items-center space-x-1 ${
            isDarkMode ? 'text-red-400' : 'text-gray-500'
          }`}>
            <Heart className="h-4 w-4" />
            <span className="text-sm font-medium">{workout.points} CRUSH</span>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
              isDarkMode 
                ? 'text-gray-300 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span>View Exercises</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className={`mb-4 p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-900 to-red-900 border-red-700'
              : 'bg-gradient-to-r from-gray-50 to-yellow-50 border-gray-300'
          }`}>
            <div className="space-y-3">
              {workout.exercises.map((exercise) => (
                <div 
                  key={exercise.id} 
                  className={`border-l-4 pl-3 cursor-pointer transition-all duration-200 hover:scale-105 p-2 rounded ${
                    isDarkMode 
                      ? 'border-red-600 hover:bg-red-900/30'
                      : 'border-gray-400 hover:bg-gray-100/50'
                  }`}
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <h4 className={`font-medium transition-colors duration-200 ${
                    isDarkMode 
                      ? 'text-yellow-200 hover:text-yellow-100'
                      : 'text-gray-800 hover:text-gray-900'
                  }`}>{exercise.name} ✨</h4>
                  <p className={`text-sm mb-1 ${
                    isDarkMode ? 'text-red-200' : 'text-gray-600'
                  }`}>{exercise.instructions}</p>
                  <div className={`flex items-center space-x-4 text-xs ${
                    isDarkMode ? 'text-red-400' : 'text-gray-500'
                  }`}>
                    {exercise.sets && <span>{exercise.sets} sets</span>}
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                    {exercise.duration && <span>{exercise.duration}s duration</span>}
                    {exercise.rest && <span>{exercise.rest}s rest</span>}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Click to see 3D demo! 🎮
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={isCompleted || isStarted}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isCompleted
              ? isDarkMode
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-red-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-600 cursor-not-allowed'
              : isStarted
              ? isDarkMode
                ? 'bg-gradient-to-r from-red-800 to-gray-800 text-red-200 cursor-wait'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-yellow-100 cursor-wait'
              : isDarkMode
                ? 'bg-gradient-to-r from-red-800 to-gray-800 hover:from-red-900 hover:to-gray-900 text-yellow-200 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-yellow-100 shadow-lg hover:shadow-xl'
          }`}
        >
          {isCompleted ? (
            <>
              <Check className="h-5 w-5" />
              <span>Adventure Complete! 🎉</span>
            </>
          ) : isStarted ? (
            <>
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span>Training with companion...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Start Adventure</span>
            </>
          )}
        </button>
      </div>

      {/* Workout Demo Modal */}
      {selectedExercise && (
        <WorkoutDemoModal
          isOpen={isDemoModalOpen}
          onClose={handleCloseDemoModal}
          exercise={selectedExercise}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default WorkoutCard;
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CreatureCompanion from './components/CreatureCompanion';
import WorkoutCard from './components/WorkoutCard';
import ProgressTracker from './components/ProgressTracker';
import Leaderboard from './components/Leaderboard';
import RewardsPanel from './components/RewardsPanel';
import Web3ProgressSync from './components/Web3ProgressSync';
import { currentUser, leaderboardData } from './data/users';
import { workouts } from './data/workouts';
import { User } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User>(currentUser);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const [pacmanHammy, setPacmanHammy] = useState({ x: 0, y: 0, direction: 0 });

  // Pacman Hammy animation
  useEffect(() => {
    const animatePacmanHammy = () => {
      setPacmanHammy(prev => {
        const speed = 2;
        const containerWidth = window.innerWidth - 100;
        const containerHeight = window.innerHeight - 200;
        
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = prev.direction;
        
        // Move based on current direction
        switch (prev.direction) {
          case 0: // right
            newX += speed;
            if (newX > containerWidth) {
              newDirection = Math.random() > 0.5 ? 1 : 3; // down or up
              newX = containerWidth;
            }
            break;
          case 1: // down
            newY += speed;
            if (newY > containerHeight) {
              newDirection = Math.random() > 0.5 ? 0 : 2; // right or left
              newY = containerHeight;
            }
            break;
          case 2: // left
            newX -= speed;
            if (newX < 0) {
              newDirection = Math.random() > 0.5 ? 1 : 3; // down or up
              newX = 0;
            }
            break;
          case 3: // up
            newY -= speed;
            if (newY < 0) {
              newDirection = Math.random() > 0.5 ? 0 : 2; // right or left
              newY = 0;
            }
            break;
        }
        
        // Random direction change occasionally
        if (Math.random() < 0.02) {
          newDirection = Math.floor(Math.random() * 4);
        }
        
        return { x: newX, y: newY, direction: newDirection };
      });
    };

    const interval = setInterval(animatePacmanHammy, 50);
    return () => clearInterval(interval);
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleWorkoutComplete = (workoutId: string, points: number) => {
    setUser(prev => ({
      ...prev,
      tokens: prev.tokens + points,
      totalWorkouts: prev.totalWorkouts + 1,
      creature: {
        ...prev.creature,
        happiness: Math.min(100, prev.creature.happiness + 5),
        energy: Math.min(100, prev.creature.energy + 10)
      }
    }));
    setCompletedWorkouts(prev => [...prev, workoutId]);
  };

  const handleFeedCreature = () => {
    setUser(prev => ({
      ...prev,
      creature: {
        ...prev.creature,
        happiness: Math.min(100, prev.creature.happiness + 10),
        energy: Math.min(100, prev.creature.energy + 5)
      }
    }));
  };

  const handlePlayWithCreature = () => {
    setUser(prev => ({
      ...prev,
      creature: {
        ...prev.creature,
        happiness: Math.min(100, prev.creature.happiness + 15),
        mood: 'excited' as const
      }
    }));
  };

  const handleClaimReward = (rewardId: string, cost: number) => {
    if (user.tokens >= cost) {
      setUser(prev => ({
        ...prev,
        tokens: prev.tokens - cost
      }));
    }
  };

  const handleRedeemNFT = (nftId: string, rewardId: string) => {
    // NFT redemption doesn't cost CRUSH tokens, just marks the NFT as used
    // In a real implementation, this would interact with the smart contract
    // to verify NFT ownership and mark it as redeemed
    console.log(`Successfully redeemed NFT ${nftId} for reward ${rewardId} - no CRUSH cost!`);
    
    // Show success feedback to user
    setUser(prev => ({
      ...prev,
      creature: {
        ...prev.creature,
        happiness: Math.min(100, prev.creature.happiness + 20),
        mood: 'excited' as const
      }
    }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <CreatureCompanion
                  creature={user.creature}
                  userLevel={user.level}
                  isDarkMode={isDarkMode}
                  onFeedCreature={handleFeedCreature}
                  onPlayWithCreature={handlePlayWithCreature}
                  recentWorkout={completedWorkouts.length > 0}
                />
              </div>
              <div className="lg:col-span-2 space-y-8">
                <ProgressTracker user={user} isDarkMode={isDarkMode} />
                <Web3ProgressSync 
                  isDarkMode={isDarkMode}
                  userTokens={user.tokens}
                  userWorkouts={user.totalWorkouts}
                  userStreak={user.streak}
                />
              </div>
            </div>
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${
                isDarkMode ? 'text-yellow-200' : 'text-gray-800'
              }`}>Available Workouts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workouts.map(workout => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onComplete={handleWorkoutComplete}
                    isCompleted={completedWorkouts.includes(workout.id)}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 'leaderboard':
        return (
          <Leaderboard
            data={leaderboardData}
            currentUserId={user.id}
            isDarkMode={isDarkMode}
          />
        );
      case 'profile':
        return (
          <RewardsPanel
            user={user}
            onClaimReward={handleClaimReward}
            onRedeemNFT={handleRedeemNFT}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-red-950 to-gray-800' 
        : 'bg-gradient-to-br from-gray-100 via-yellow-100 to-gray-200'
    } relative overflow-hidden`}>
      {/* Pacman-style Hammy Animation */}
      <div 
        className="fixed z-10 pointer-events-none transition-all duration-100 ease-linear"
        style={{
          left: `${pacmanHammy.x}px`,
          top: `${pacmanHammy.y + 100}px`,
          transform: `rotate(${pacmanHammy.direction * 90}deg)`,
        }}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center animate-pulse ${
          isDarkMode 
            ? 'bg-red-600/20 border-2 border-red-400/50' 
            : 'bg-yellow-400/20 border-2 border-yellow-600/50'
        }`}>
          <span className="text-lg animate-bounce" style={{ animationDuration: '0.5s' }}>
            🐹
          </span>
        </div>
        {/* Trail effect */}
        <div className={`absolute -z-10 w-6 h-6 rounded-full animate-ping ${
          isDarkMode ? 'bg-red-400/10' : 'bg-yellow-400/10'
        }`} style={{ left: '4px', top: '4px' }}></div>
      </div>

      <Header 
        user={user}
        currentView={currentView}
        onViewChange={handleViewChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
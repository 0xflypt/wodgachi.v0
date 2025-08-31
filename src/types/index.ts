export interface User {
  id: string;
  name: string;
  level: number;
  tokens: number;
  streak: number;
  totalWorkouts: number;
  joinDate: string;
  goal: {
    type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'general_fitness';
    target: number;
    current: number;
  };
  preferences: {
    duration: number;
    intensity: 'beginner' | 'intermediate' | 'advanced';
    equipment: string[];
  };
  creature: CreatureCompanion;
}

export interface CreatureCompanion {
  id: string;
  name: string;
  type: 'hamster' | 'bunny' | 'cat' | 'dog' | 'fox' | 'panda' | 'koala' | 'penguin';
  level: number;
  happiness: number;
  energy: number;
  evolution: number;
  mood: 'happy' | 'excited' | 'tired' | 'hungry' | 'running';
  wheelSpeed: number;
  customization: {
    wheelType: 'basic' | 'neon' | 'rainbow' | 'cyber' | 'holographic';
    background: 'default' | 'matrix' | 'stars' | 'cyber-city' | 'rainbow';
    accessories: string[];
    colorScheme: string;
  };
  unlockedCreatures: string[];
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  targetGoals: string[];
  points: number;
  exercises: Exercise[];
}

export interface Exercise {
  id?: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  rest?: number;
  instructions?: string;
  targetMuscles?: string[];
  mediaUrl?: string;
  mediaType?: 'video' | 'gif' | 'youtube';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  level: number;
  tokens: number;
  streak: number;
  totalWorkouts: number;
  avatar: string;
  points: number;
  creature: {
    name: string;
    type: string;
    level: number;
  };
}

export interface ProgressNFT {
  id: string;
  tokenId: number;
  workoutsMilestone: number;
  mintedAt: string;
  transactionHash: string;
  metadata: {
    totalWorkouts: number;
    level: number;
    streak: number;
    tokensEarned: number;
    creatureName: string;
    creatureLevel: number;
    achievements: string[];
  };
  isRedeemed: boolean;
  redeemedFor?: string;
}
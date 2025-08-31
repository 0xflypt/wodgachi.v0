export const currentUser = {
  id: "1",
  name: "anon",
  level: 12,
  tokens: 2847,
  totalWorkouts: 156,
  streak: 7,
  joinDate: "2024-01-15",
  goal: {
    type: 'general_fitness' as const,
    target: 200,
    current: 156
  },
  preferences: {
    duration: 30,
    intensity: 'intermediate' as const,
    equipment: ['bodyweight', 'dumbbells']
  },
  creature: {
    id: "1",
    name: "Hammy",
    type: 'hamster' as const,
    level: 12,
    happiness: 85,
    energy: 90,
    evolution: 2,
    mood: 'happy' as const,
    wheelSpeed: 75,
    customization: {
      wheelType: 'neon' as const,
      background: 'cyber-city' as const,
      accessories: ['crown', 'sparkles'],
      colorScheme: 'purple'
    },
    unlockedCreatures: ['hamster', 'bunny']
  },
  timeline: 12,
  achievements: [
    { id: 1, name: "First Steps", description: "Complete your first workout", unlocked: true },
    { id: 2, name: "Week Warrior", description: "Maintain a 7-day streak", unlocked: true },
    { id: 3, name: "Century Club", description: "Complete 100 workouts", unlocked: true },
    { id: 4, name: "Token Master", description: "Earn 1000 tokens", unlocked: true }
  ]
};

export const leaderboardData = [
  { 
    userId: "1", 
    name: "anon", 
    level: 12, 
    tokens: 2847, 
    totalWorkouts: 156, 
    streak: 7, 
    avatar: "🐹", 
    points: 2847, 
    creature: { name: "Hammy", type: "hamster", level: 12 } 
  },
  { 
    userId: "2", 
    name: "FitHamster92", 
    level: 15, 
    tokens: 3421, 
    totalWorkouts: 203, 
    streak: 12, 
    avatar: "🐰", 
    points: 3421, 
    creature: { name: "Bunny", type: "bunny", level: 15 } 
  },
  { 
    userId: "3", 
    name: "GymRat2000", 
    level: 11, 
    tokens: 2156, 
    totalWorkouts: 134, 
    streak: 5, 
    avatar: "🐱", 
    points: 2156, 
    creature: { name: "Kitty", type: "cat", level: 11 } 
  },
  { 
    userId: "4", 
    name: "CardioKing", 
    level: 13, 
    tokens: 2789, 
    totalWorkouts: 167, 
    streak: 9, 
    avatar: "🐶", 
    points: 2789, 
    creature: { name: "Doggo", type: "dog", level: 13 } 
  },
  { 
    userId: "5", 
    name: "FlexMaster", 
    level: 10, 
    tokens: 1987, 
    totalWorkouts: 121, 
    streak: 3, 
    avatar: "🦊", 
    points: 1987, 
    creature: { name: "Foxy", type: "fox", level: 10 } 
  },
  { 
    userId: "6", 
    name: "IronPanda", 
    level: 14, 
    tokens: 3102, 
    totalWorkouts: 189, 
    streak: 15, 
    avatar: "🐼", 
    points: 3102, 
    creature: { name: "Panda", type: "panda", level: 14 } 
  },
  { 
    userId: "7", 
    name: "SweatBeast", 
    level: 9, 
    tokens: 1654, 
    totalWorkouts: 98, 
    streak: 2, 
    avatar: "🐨", 
    points: 1654, 
    creature: { name: "Koala", type: "koala", level: 9 } 
  },
  { 
    userId: "8", 
    name: "PowerLifter", 
    level: 16, 
    tokens: 3876, 
    totalWorkouts: 234, 
    streak: 20, 
    avatar: "🐧", 
    points: 3876, 
    creature: { name: "Penguin", type: "penguin", level: 16 } 
  }
];
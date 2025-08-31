import { Workout } from '../types';

export const workouts: Workout[] = [
  {
    id: 'hiit-cardio-blast',
    title: 'HIIT Cardio Blast',
    description: 'High-intensity interval training to boost metabolism and burn fat',
    duration: 20,
    difficulty: 'intermediate',
    targetGoals: ['weight_loss', 'endurance', 'general_fitness'],
    points: 150,
    equipment: ['none'],
    exercises: [
      {
        id: 'jumping-jacks',
        name: 'Jumping Jacks',
        duration: 45,
        rest: 15,
        instructions: 'Jump with feet apart while raising arms overhead, then return to starting position',
        targetMuscles: ['legs', 'cardio'],
        mediaUrl: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
        mediaType: 'gif'
      },
      {
        id: 'burpees',
        name: 'Burpees',
        sets: 3,
        reps: 8,
        rest: 30,
        instructions: 'Drop to plank, do push-up, jump feet to hands, jump up with arms overhead',
        targetMuscles: ['full body', 'cardio'],
        mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        mediaType: 'video'
      },
      {
        id: 'high-knees',
        name: 'High Knees',
        duration: 30,
        rest: 15,
        instructions: 'Run in place bringing knees up to hip level',
        targetMuscles: ['legs', 'cardio'],
        mediaUrl: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
        mediaType: 'gif'
      },
      {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        duration: 45,
        rest: 15,
        instructions: 'In plank position, alternate bringing knees to chest rapidly',
        targetMuscles: ['core', 'cardio'],
        mediaUrl: 'https://media.giphy.com/media/3o7TKqnN349PBUtGFO/giphy.gif',
        mediaType: 'gif'
      }
    ]
  },
  {
    id: 'strength-upper-body',
    title: 'Upper Body Power',
    description: 'Build strength and muscle in your chest, shoulders, and arms',
    duration: 35,
    difficulty: 'intermediate',
    targetGoals: ['muscle_gain', 'strength'],
    points: 200,
    equipment: ['dumbbells'],
    exercises: [
      {
        id: 'push-ups',
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: 'Lower chest to ground, push back up maintaining straight body line',
        targetMuscles: ['chest', 'shoulders', 'triceps']
      },
      {
        id: 'dumbbell-rows',
        name: 'Dumbbell Rows',
        sets: 3,
        reps: 10,
        rest: 60,
        instructions: 'Bent over, pull dumbbells to lower ribs, squeeze shoulder blades',
        targetMuscles: ['back', 'biceps']
      },
      {
        id: 'shoulder-press',
        name: 'Shoulder Press',
        sets: 3,
        reps: 8,
        rest: 60,
        instructions: 'Press dumbbells overhead from shoulder height',
        targetMuscles: ['shoulders', 'triceps']
      }
    ]
  },
  {
    id: 'core-crusher',
    title: 'Core Crusher',
    description: 'Strengthen your core with targeted abdominal exercises',
    duration: 15,
    difficulty: 'beginner',
    targetGoals: ['general_fitness', 'strength'],
    points: 100,
    equipment: ['none'],
    exercises: [
      {
        id: 'plank',
        name: 'Plank Hold',
        duration: 30,
        rest: 15,
        instructions: 'Hold plank position with straight body line from head to heels',
        targetMuscles: ['core']
      },
      {
        id: 'crunches',
        name: 'Crunches',
        sets: 2,
        reps: 15,
        rest: 30,
        instructions: 'Lift shoulders off ground while keeping lower back pressed down',
        targetMuscles: ['abs']
      },
      {
        id: 'russian-twists',
        name: 'Russian Twists',
        sets: 2,
        reps: 20,
        rest: 30,
        instructions: 'Seated, lean back slightly and rotate torso side to side',
        targetMuscles: ['obliques']
      }
    ]
  },
  {
    id: 'leg-day-beast',
    title: 'Leg Day Beast',
    description: 'Power up your lower body with this challenging leg workout',
    duration: 40,
    difficulty: 'advanced',
    targetGoals: ['muscle_gain', 'strength'],
    points: 250,
    equipment: ['dumbbells'],
    exercises: [
      {
        id: 'squats',
        name: 'Goblet Squats',
        sets: 4,
        reps: 15,
        rest: 90,
        instructions: 'Hold dumbbell at chest, squat down keeping chest up',
        targetMuscles: ['quads', 'glutes']
      },
      {
        id: 'lunges',
        name: 'Walking Lunges',
        sets: 3,
        reps: 12,
        rest: 60,
        instructions: 'Step forward into lunge, alternate legs',
        targetMuscles: ['quads', 'glutes', 'hamstrings']
      },
      {
        id: 'calf-raises',
        name: 'Calf Raises',
        sets: 3,
        reps: 20,
        rest: 45,
        instructions: 'Rise up on toes, lower slowly',
        targetMuscles: ['calves']
      }
    ]
  }
];
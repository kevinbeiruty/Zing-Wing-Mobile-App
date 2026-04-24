export const categories = ['Fitness', 'Learning', 'Productivity', 'Wellness', 'Chores'];

export const difficulties = ['Easy', 'Medium', 'Hard'];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const currentUser = {
  id: 'u0',
  name: 'You',
  email: 'hunter@zingwing.app',
  country: 'Lebanon',
  totalXP: 140,
};

export const starterMissions = [
  {
    id: '1',
    title: 'Walk for 20 minutes',
    description: 'Move your body and beat laziness before it settles in.',
    category: 'Fitness',
    difficulty: 'Easy',
    xp: 25,
    completed: false,
    routineDays: ['Mon', 'Wed', 'Fri'],
    reminderTime: '18:00',
  },
  {
    id: '2',
    title: 'Read 5 pages',
    description: 'Open a book and collect a small win for your mind.',
    category: 'Learning',
    difficulty: 'Easy',
    xp: 25,
    completed: true,
    routineDays: ['Tue', 'Thu'],
    reminderTime: '20:00',
  },
  {
    id: '3',
    title: 'Clean study desk',
    description: 'Clear your mission control zone for deeper focus.',
    category: 'Chores',
    difficulty: 'Medium',
    xp: 50,
    completed: false,
    routineDays: ['Sat'],
    reminderTime: '10:00',
  },
  {
    id: '4',
    title: '45 minute focus block',
    description: 'No scrolling. No excuses. One deep sprint.',
    category: 'Productivity',
    difficulty: 'Hard',
    xp: 80,
    completed: false,
    routineDays: ['Mon', 'Tue', 'Wed', 'Thu'],
    reminderTime: '16:30',
  },
];

export const starterPosts = [
  {
    id: 'p1',
    userName: 'Ali',
    country: 'Lebanon',
    level: 10,
    rank: 'Big Man',
    imageUri: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=900',
    caption: 'Day 10. No excuses.',
    visibility: 'public',
  },
  {
    id: 'p2',
    userName: 'Maya',
    country: 'Lebanon',
    level: 45,
    rank: 'Elite',
    imageUri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900',
    caption: 'Finished the learning sprint before midnight.',
    visibility: 'public',
  },
  {
    id: 'p3',
    userName: 'You',
    country: 'Lebanon',
    level: 2,
    rank: 'Crook',
    imageUri: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900',
    caption: 'Private progress check.',
    visibility: 'private',
  },
];

export const leaderboardUsers = [
  { id: 'u1', name: 'Maya', country: 'Lebanon', level: 45, xp: 4500, rank: 'Elite' },
  { id: 'u2', name: 'Omar', country: 'Jordan', level: 32, xp: 3200, rank: 'Big Man' },
  { id: 'u3', name: 'Nour', country: 'Lebanon', level: 21, xp: 2150, rank: 'Big Man' },
  { id: 'u4', name: 'Lina', country: 'Egypt', level: 15, xp: 1500, rank: 'Big Man' },
  { id: 'u5', name: 'Karim', country: 'Lebanon', level: 12, xp: 1210, rank: 'Big Man' },
  { id: 'u6', name: 'Sara', country: 'UAE', level: 8, xp: 820, rank: 'Crook' },
  { id: 'u7', name: 'You', country: 'Lebanon', level: 2, xp: 140, rank: 'Crook' },
];

export const generatedMissions = [
  {
    title: '10 Minute Focus Sprint',
    category: 'Productivity',
    difficulty: 'Easy',
    xp: 25,
    reason: 'Good for starting when motivation is low.',
  },
  {
    title: 'Read 5 Pages',
    category: 'Learning',
    difficulty: 'Easy',
    xp: 25,
    reason: 'Builds consistency without pressure.',
  },
];

export function getXPByDifficulty(difficulty) {
  if (difficulty === 'Easy') return 25;
  if (difficulty === 'Medium') return 50;
  if (difficulty === 'Hard') return 80;
  return 30;
}

export function getLevel(totalXP) {
  return Math.floor(totalXP / 100) + 1;
}

export function getRank(level) {
  if (level >= 100) return 'BOSS';
  if (level >= 50) return 'Elite';
  if (level >= 10) return 'Big Man';
  return 'Crook';
}

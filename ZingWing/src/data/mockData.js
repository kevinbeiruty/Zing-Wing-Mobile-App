export const categories = ['Fitness', 'Learning', 'Productivity', 'Wellness', 'Chores'];

export const difficulties = ['Easy', 'Medium', 'Hard'];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

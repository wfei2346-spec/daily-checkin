import { formatDate, getToday } from './date';

/**
 * 计算当前连续天数和最长连续天数
 * @param dates 已打卡日期数组（YYYY-MM-DD），去重并排序
 */
export function calculateStreaks(dates: string[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (dates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const sorted = [...new Set(dates)].sort().reverse();

  // 当前连续：从今天往回数
  let currentStreak = 0;
  const today = getToday();
  let checkDate = new Date(today + 'T00:00:00');
  let dateStr = formatDate(checkDate);

  // 如果今天还没打卡，从昨天开始算
  if (!sorted.includes(dateStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    dateStr = formatDate(checkDate);
    if (sorted.includes(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 最长连续：扫描所有日期
  let longestStreak = 0;
  let currentRun = 0;
  const allDates = [...new Set(dates)].sort();

  for (let i = 0; i < allDates.length; i++) {
    if (i === 0) {
      currentRun = 1;
    } else {
      const prev = new Date(allDates[i - 1] + 'T00:00:00');
      const curr = new Date(allDates[i] + 'T00:00:00');
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      if (diffDays === 1) {
        currentRun++;
      } else {
        currentRun = 1;
      }
    }
    if (currentRun > longestStreak) longestStreak = currentRun;
  }

  return { currentStreak, longestStreak };
}

/**
 * 计算指定任务的连续打卡天数（从今天往回数）
 */
export function calculateTaskStreak(taskCheckinDates: string[]): number {
  if (taskCheckinDates.length === 0) return 0;
  const sorted = [...new Set(taskCheckinDates)].sort().reverse();

  let streak = 0;
  const today = getToday();
  let checkDate = new Date(today + 'T00:00:00');
  let dateStr = formatDate(checkDate);

  if (!sorted.includes(dateStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    dateStr = formatDate(checkDate);
    if (sorted.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/** 心情选项 */
export type Mood = 'happy' | 'neutral' | 'tired' | 'energetic';

/** 每日打卡记录 */
export interface DailyRecord {
  id?: number;
  date: string;        // 'YYYY-MM-DD'，每天唯一
  content: string;      // 学习内容（必填）
  harvest: string;      // 收获感悟（选填）
  mood: Mood;           // 心情
  duration: number;     // 学习时长（分钟）
  createdAt: string;    // ISO 时间戳
  updatedAt: string;
}

/** 热力图数据 */
export interface HeatmapEntry {
  date: string;
  count: number;
}

/** 统计数据 */
export interface StatsSummary {
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
  totalDuration: number;  // 总学习时长（分钟）
  avgDuration: number;    // 平均每日学习时长
  bestDay: string | null;
  bestDayDuration: number;
}

/** 心情分布 */
export interface MoodStats {
  mood: Mood;
  count: number;
}

/** 应用设置 */
export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;   // 'HH:mm'
  reminderMessage: string;
}

/** 心情选项配置 */
export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: '开心' },
  { value: 'neutral', emoji: '😐', label: '一般' },
  { value: 'tired', emoji: '😫', label: '疲惫' },
  { value: 'energetic', emoji: '💪', label: '充实' },
];

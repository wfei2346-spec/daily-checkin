import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';
import type { HeatmapEntry, StatsSummary, MoodStats } from '../types';
import { getToday, getMonthsAgo } from '../utils/date';
import { calculateStreaks } from '../utils/streak';

export function useStats(months: number = 6) {
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [summary, setSummary] = useState<StatsSummary>({
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalDuration: 0,
    avgDuration: 0,
    bestDay: null,
    bestDayDuration: 0,
  });
  const [moodStats, setMoodStats] = useState<MoodStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const from = getMonthsAgo(months);
    const to = getToday();

    const records = await db.dailyRecords
      .where('date')
      .between(from, to, true, true)
      .toArray();

    // 热力图数据
    const heatmapData: HeatmapEntry[] = records.map(r => ({
      date: r.date,
      count: r.duration, // 用学习时长作为热力值
    }));
    setHeatmap(heatmapData);

    // 连续天数
    const dates = [...new Set(records.map(r => r.date))];
    const { currentStreak, longestStreak } = calculateStreaks(dates);

    // 时长统计
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = records.length > 0 ? Math.round(totalDuration / dates.length) : 0;

    // 最佳天数
    const dayMap = new Map<string, number>();
    for (const r of records) {
      dayMap.set(r.date, (dayMap.get(r.date) || 0) + r.duration);
    }
    let bestDay: string | null = null;
    let bestDayDuration = 0;
    for (const [date, dur] of dayMap) {
      if (dur > bestDayDuration) { bestDayDuration = dur; bestDay = date; }
    }

    setSummary({
      totalDays: dates.length,
      currentStreak,
      longestStreak,
      totalDuration,
      avgDuration,
      bestDay,
      bestDayDuration,
    });

    // 心情分布
    const moodMap = new Map<string, number>();
    for (const r of records) {
      moodMap.set(r.mood, (moodMap.get(r.mood) || 0) + 1);
    }
    const moodData: MoodStats[] = ['happy', 'neutral', 'tired', 'energetic'].map(m => ({
      mood: m as MoodStats['mood'],
      count: moodMap.get(m) || 0,
    }));
    setMoodStats(moodData);

    setLoading(false);
  }, [months]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { heatmap, summary, moodStats, loading, refresh: fetchStats };
}

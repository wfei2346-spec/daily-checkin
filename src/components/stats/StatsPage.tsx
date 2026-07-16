import { useState } from 'react';
import { useStats } from '../../hooks/useStats';
import { CalendarHeatmap } from './CalendarHeatmap';
import { formatDateCN } from '../../utils/date';
import { MOOD_OPTIONS } from '../../types';

export function StatsPage() {
  const [months, setMonths] = useState(6);
  const { heatmap, summary, moodStats, loading } = useStats(months);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const formatDuration = (min: number) => {
    if (min >= 60) return `${Math.floor(min / 60)}h ${min % 60}m`;
    return `${min} 分钟`;
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="当前连续" value={`${summary.currentStreak} 天`} icon="🔥" />
        <StatCard label="最长连续" value={`${summary.longestStreak} 天`} icon="🏆" />
        <StatCard label="累计打卡" value={`${summary.totalDays} 天`} icon="📌" />
        <StatCard
          label="总学习时长"
          value={formatDuration(summary.totalDuration)}
          icon="⏱️"
        />
      </div>

      {/* 心情分布 */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">心情分布</h3>
        <div className="flex items-end gap-3 h-24">
          {moodStats.map(m => {
            const maxCount = Math.max(...moodStats.map(x => x.count), 1);
            const height = (m.count / maxCount) * 100;
            const option = MOOD_OPTIONS.find(o => o.value === m.mood);
            return (
              <div key={m.mood} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-medium text-gray-700">{m.count}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${Math.max(height, 4)}%`,
                    backgroundColor: m.mood === 'happy' ? '#22c55e' : m.mood === 'energetic' ? '#6366f1' : m.mood === 'neutral' ? '#f59e0b' : '#ef4444',
                    opacity: 0.75,
                  }}
                />
                <span className="text-xl">{option?.emoji}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Heatmap */}
      <section className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">学习热力图</h3>
          <select
            value={months}
            onChange={e => setMonths(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50"
          >
            <option value={3}>近 3 个月</option>
            <option value={6}>近 6 个月</option>
            <option value={12}>近 1 年</option>
          </select>
        </div>
        <CalendarHeatmap data={heatmap} months={months} />
      </section>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        <span className="text-lg">{icon}</span>
      </div>
    </div>
  );
}

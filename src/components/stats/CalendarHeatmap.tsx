import { useMemo } from 'react';
import type { HeatmapEntry } from '../../types';
import { formatDate, getToday, getMonthsAgo, getMonday } from '../../utils/date';

interface HeatmapProps {
  data: HeatmapEntry[];
  months: number;
}

export function CalendarHeatmap({ data, months }: HeatmapProps) {
  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of data) map.set(d.date, d.count);
    return map;
  }, [data]);

  const { weeks } = useMemo(() => {
    const from = getMonthsAgo(months);
    const to = getToday();
    const fromDate = getMonday(new Date(from + 'T00:00:00'));
    const toDate = new Date(to + 'T00:00:00');

    const weeksArr: string[][] = [];
    let current = new Date(fromDate);

    while (current <= toDate) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = formatDate(current);
        if (dateStr >= from && dateStr <= to) {
          week.push(dateStr);
        } else {
          week.push('');
        }
        current.setDate(current.getDate() + 1);
      }
      weeksArr.push(week);
    }
    return { weeks: weeksArr };
  }, [months]);

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-gray-100';
    if (minutes <= 15) return 'bg-indigo-200';
    if (minutes <= 30) return 'bg-indigo-300';
    if (minutes <= 60) return 'bg-indigo-400';
    return 'bg-indigo-500';
  };

  return (
    <div className="overflow-x-auto -mx-1">
      <div className="inline-block min-w-full">
        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1 pt-1">
            {['一', '', '三', '', '五', '', '日'].map((d, i) => (
              <div key={i} className="w-5 h-3 flex items-center justify-center text-[9px] text-gray-300">
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((date, di) => {
                  const count = date ? (countMap.get(date) || 0) : -1;
                  return (
                    <div
                      key={di}
                      className={`w-3 h-3 rounded-[2px] ${count >= 0 ? getColor(count) : 'bg-transparent'}`}
                      title={date ? `${date} · ${count} 分钟` : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-2 justify-end text-[10px] text-gray-400">
          <span>短</span>
          <div className="w-3 h-3 rounded-[2px] bg-gray-100" />
          <div className="w-3 h-3 rounded-[2px] bg-indigo-200" />
          <div className="w-3 h-3 rounded-[2px] bg-indigo-300" />
          <div className="w-3 h-3 rounded-[2px] bg-indigo-400" />
          <div className="w-3 h-3 rounded-[2px] bg-indigo-500" />
          <span>长</span>
        </div>
      </div>
    </div>
  );
}

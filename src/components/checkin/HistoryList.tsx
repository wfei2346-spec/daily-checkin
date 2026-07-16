import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import type { DailyRecord, Mood } from '../../types';
import { MOOD_OPTIONS } from '../../types';
import { formatDateCN, getToday, formatDate } from '../../utils/date';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface HistoryListProps {
  records: DailyRecord[];
  onEdit: (record: DailyRecord) => void;
  onDelete: (id: number) => void;
}

/** 按日期分组 */
function groupByDate(records: DailyRecord[]) {
  const today = getToday();
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  const groups: { label: string; records: DailyRecord[] }[] = [];
  const seen = new Set<string>();

  for (const r of records) {
    if (seen.has(r.date)) continue;
    seen.add(r.date);

    let label: string;
    if (r.date === today) {
      label = '今天';
    } else if (r.date === yesterday) {
      label = '昨天';
    } else {
      label = formatDateCN(r.date);
    }
    groups.push({ label, records: [r] });
  }

  return groups;
}

function getMoodEmoji(mood: Mood) {
  return MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '😐';
}

export function HistoryList({ records, onEdit, onDelete }: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">还没有打卡记录</p>
        <p className="text-xs text-gray-300 mt-1">开始你的第一次打卡吧~</p>
      </div>
    );
  }

  const groups = groupByDate(records);

  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.label}>
          <h4 className="text-xs font-medium text-gray-400 mb-2 px-1">{group.label}</h4>
          <div className="space-y-2">
            {group.records.map(record => {
              const isExpanded = expandedId === record.id;
              const moodEmoji = getMoodEmoji(record.mood);

              return (
                <motion.div
                  key={record.id}
                  layout
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* 摘要行 */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id!)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg flex-shrink-0">{moodEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {record.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {record.duration} 分钟 · {new Date(record.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-gray-300 flex-shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  {/* 展开详情 */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-gray-50">
                          {/* 收获 */}
                          {record.harvest && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-400 mb-1">💡 收获感悟</p>
                              <p className="text-sm text-gray-700 bg-amber-50 rounded-lg p-2.5">
                                {record.harvest}
                              </p>
                            </div>
                          )}

                          {/* 操作按钮 */}
                          <div className="flex gap-2 mt-3 pt-2 border-t border-gray-50">
                            <button
                              onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Pencil size={12} /> 编辑
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteId(record.id!); }}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={12} /> 删除
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }}
        title="删除记录"
        message="确定要删除这条打卡记录吗？此操作不可撤销。"
        confirmText="删除"
        variant="danger"
      />
    </div>
  );
}

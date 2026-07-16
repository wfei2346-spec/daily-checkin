import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDailyRecord } from '../../hooks/useDailyRecord';
import { CheckInFormModal } from './CheckInFormModal';
import { HistoryList } from './HistoryList';
import { useToast } from '../common/Toast';
import { getToday, formatDateCN } from '../../utils/date';
import type { DailyRecord, Mood } from '../../types';
import { MOOD_OPTIONS } from '../../types';

export function CheckInPage() {
  const { todayRecord, history, loading, checkin, updateToday, deleteRecord, isCheckedIn } = useDailyRecord();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<DailyRecord | null>(null);
  const [pulse, setPulse] = useState(false);

  // 定期脉冲动画（未打卡时吸引注意）
  useEffect(() => {
    if (isCheckedIn) return;
    const interval = setInterval(() => {
      setPulse(v => !v);
    }, 2000);
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const handleSubmit = async (data: { content: string; harvest: string; mood: Mood; duration: number }) => {
    if (editData) {
      await updateToday(data);
      toast('打卡记录已更新');
      setEditData(null);
    } else {
      const ok = await checkin(data);
      if (!ok) {
        toast('今天已经打卡过了', 'error');
      } else {
        toast('🎉 打卡成功！');
      }
    }
    setFormOpen(false);
  };

  const handleEdit = (record: DailyRecord) => {
    setEditData(record);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteRecord(id);
    toast('记录已删除');
  };

  const moodOption = MOOD_OPTIONS.find(m => m.value === todayRecord?.mood);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== 状态标签 ===== */}
      <div className="flex items-center justify-center">
        {isCheckedIn ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
          >
            <span className="text-lg">✅</span>
            今日已打卡
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
          >
            <span className="text-lg">⏳</span>
            今日未打卡
          </motion.div>
        )}
      </div>

      {/* ===== 大圆形打卡按钮 ===== */}
      <div className="flex justify-center">
        <motion.button
          whileTap={isCheckedIn ? {} : { scale: 0.9 }}
          onClick={() => {
            if (isCheckedIn) {
              setEditData(todayRecord);
            } else {
              setEditData(null);
            }
            setFormOpen(true);
          }}
          animate={
            !isCheckedIn
              ? {
                  scale: pulse ? 1.04 : 1,
                  boxShadow: pulse
                    ? '0 0 0 12px rgba(99, 102, 241, 0.15), 0 0 0 24px rgba(99, 102, 241, 0.08)'
                    : '0 0 0 6px rgba(99, 102, 241, 0.1), 0 0 0 12px rgba(99, 102, 241, 0.05)',
                }
              : {}
          }
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={`w-36 h-36 rounded-full flex flex-col items-center justify-center gap-1 font-bold transition-colors duration-500 ${
            isCheckedIn
              ? 'bg-gray-200 text-gray-400 cursor-pointer'
              : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white cursor-pointer'
          }`}
        >
          <span className="text-3xl">{isCheckedIn ? '✅' : '📝'}</span>
          <span className="text-sm">{isCheckedIn ? '已打卡' : '打卡'}</span>
        </motion.button>
      </div>

      {/* ===== 今日摘要 ===== */}
      {isCheckedIn && todayRecord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{moodOption?.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">今天学了 {todayRecord.duration} 分钟</p>
              <p className="text-xs text-gray-400">
                {new Date(todayRecord.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} 打卡
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{todayRecord.content}</p>
          {todayRecord.harvest && (
            <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">💡 {todayRecord.harvest}</p>
          )}
        </motion.div>
      )}

      {/* ===== 分隔线 ===== */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">历史记录</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ===== 历史记录列表 ===== */}
      <HistoryList
        records={history}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ===== 打卡表单弹窗 ===== */}
      <CheckInFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditData(null); }}
        onSubmit={handleSubmit}
        initialData={editData ? {
          content: editData.content,
          harvest: editData.harvest,
          mood: editData.mood,
          duration: editData.duration,
        } : null}
      />
    </div>
  );
}

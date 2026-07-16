import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Mood } from '../../types';
import { MOOD_OPTIONS } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface CheckInFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; harvest: string; mood: Mood; duration: number }) => void;
  initialData?: { content: string; harvest: string; mood: Mood; duration: number } | null;
}

export function CheckInFormModal({ open, onClose, onSubmit, initialData }: CheckInFormModalProps) {
  const [content, setContent] = useState('');
  const [harvest, setHarvest] = useState('');
  const [mood, setMood] = useState<Mood>('happy');
  const [duration, setDuration] = useState(60);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setHarvest(initialData.harvest);
      setMood(initialData.mood);
      setDuration(initialData.duration);
    } else {
      setContent('');
      setHarvest('');
      setMood('happy');
      setDuration(60);
    }
    setErrors({});
  }, [initialData, open]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!content.trim()) errs.content = '请填写今日学习内容';
    if (!duration || duration < 1) errs.duration = '请填写学习时长';
    if (duration > 1440) errs.duration = '学习时长不能超过 1440 分钟';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      content: content.trim(),
      harvest: harvest.trim(),
      mood,
      duration: Number(duration),
    });
  };

  const isEditing = !!initialData;

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? '编辑打卡记录' : '📝 今日打卡'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 学习内容 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            今日学习内容 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="今天学了什么？学到了哪些知识点？"
            rows={3}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all resize-none ${
              errors.content ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content}</p>}
        </div>

        {/* 收获 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            今日收获
          </label>
          <textarea
            value={harvest}
            onChange={e => setHarvest(e.target.value)}
            placeholder="今天有什么收获或感悟？（选填）"
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all resize-none"
          />
        </div>

        {/* 心情 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            今日心情
          </label>
          <div className="grid grid-cols-4 gap-2">
            {MOOD_OPTIONS.map(option => (
              <motion.button
                key={option.value}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setMood(option.value)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all ${
                  mood === option.value
                    ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className={`text-xs font-medium ${
                  mood === option.value ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 学习时长 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            学习时长（分钟） <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              min={1}
              max={1440}
              placeholder="例如：60"
              className={`w-28 px-3 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-center ${
                errors.duration ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <span className="text-sm text-gray-500">分钟</span>
            {/* 快捷选择 */}
            <div className="flex gap-1 ml-2">
              {[15, 30, 60, 90, 120].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setDuration(n)}
                  className={`px-2 py-1 text-xs rounded-lg border transition-colors ${
                    duration === n
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          {errors.duration && <p className="text-xs text-red-400 mt-1">{errors.duration}</p>}
        </div>

        {/* 时间显示 */}
        <p className="text-xs text-gray-400 text-center">
          打卡时间：{new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </p>

        <div className="flex gap-3 pt-1">
          <Button type="submit" className="flex-1" size="lg">
            {isEditing ? '💾 保存修改' : '✅ 确认打卡'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} size="lg">
            取消
          </Button>
        </div>
      </form>
    </Modal>
  );
}

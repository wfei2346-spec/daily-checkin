import { useState, useEffect, useCallback } from 'react';
import { db, initDB } from '../db';
import { getToday } from '../utils/date';
import type { DailyRecord, Mood } from '../types';

export function useDailyRecord() {
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    await initDB();
    const today = getToday();
    const todayRec = await db.dailyRecords.where('date').equals(today).first();
    setTodayRecord(todayRec || null);

    const allRecords = await db.dailyRecords.orderBy('date').reverse().toArray();
    setHistory(allRecords);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /** 打卡（每天只能一次） */
  const checkin = async (data: {
    content: string;
    harvest: string;
    mood: Mood;
    duration: number;
  }): Promise<boolean> => {
    const today = getToday();
    const existing = await db.dailyRecords.where('date').equals(today).first();
    if (existing) return false; // 今天已打卡

    const now = new Date().toISOString();
    await db.dailyRecords.add({
      date: today,
      content: data.content,
      harvest: data.harvest,
      mood: data.mood,
      duration: data.duration,
      createdAt: now,
      updatedAt: now,
    });
    await fetchData();
    return true;
  };

  /** 更新今日记录（如果今天还没打卡则不能更新） */
  const updateToday = async (data: {
    content: string;
    harvest: string;
    mood: Mood;
    duration: number;
  }) => {
    const today = getToday();
    const existing = await db.dailyRecords.where('date').equals(today).first();
    if (!existing) return;
    await db.dailyRecords.update(existing.id!, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    await fetchData();
  };

  /** 删除记录 */
  const deleteRecord = async (id: number) => {
    await db.dailyRecords.delete(id);
    await fetchData();
  };

  return {
    todayRecord,
    history,
    loading,
    checkin,
    updateToday,
    deleteRecord,
    refresh: fetchData,
    isCheckedIn: todayRecord !== null,
  };
}

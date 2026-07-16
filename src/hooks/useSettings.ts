import { useState, useEffect, useCallback } from 'react';
import { db, initDB } from '../db';
import type { AppSettings } from '../types';

const defaults: AppSettings = {
  reminderEnabled: true,
  reminderTime: '20:00',
  reminderMessage: '别忘了今天的打卡哦！',
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaults);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    await initDB();
    const rows = await db.settings.toArray();
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    setSettings({
      reminderEnabled: map.reminderEnabled !== 'false',
      reminderTime: map.reminderTime || '20:00',
      reminderMessage: map.reminderMessage || defaults.reminderMessage,
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSetting = async (key: string, value: string) => {
    await db.settings.put({ key, value });
    await fetchSettings();
  };

  return { settings, loading, updateSetting, refresh: fetchSettings };
}

import Dexie, { type Table } from 'dexie';
import type { DailyRecord } from '../types';

export class DailyCheckinDB extends Dexie {
  dailyRecords!: Table<DailyRecord, number>;
  settings!: Table<{ key: string; value: string }, string>;

  constructor() {
    super('DailyCheckinDB');
    this.version(3).stores({
      dailyRecords: '++id, &date',
      settings: 'key',
    });
  }
}

export const db = new DailyCheckinDB();

const SEED_SETTINGS: { key: string; value: string }[] = [
  { key: 'reminderEnabled', value: 'true' },
  { key: 'reminderTime', value: '20:00' },
  { key: 'reminderMessage', value: '别忘了今天的打卡哦！' },
];

export async function initDB() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.bulkPut(SEED_SETTINGS);
  }
}

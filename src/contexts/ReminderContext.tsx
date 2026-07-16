import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { useSettings } from '../hooks/useSettings';
import { showNotification, msUntilTime, requestNotificationPermission } from '../utils/notifications';

const ReminderContext = createContext<null>(null);

export function ReminderProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 请求通知权限
    requestNotificationPermission();

    if (!settings.reminderEnabled) return;

    const schedule = () => {
      const ms = msUntilTime(settings.reminderTime);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        showNotification('📋 每日打卡', settings.reminderMessage);
        // 下一次提醒（明天同一时间）
        schedule();
      }, ms);
    };

    schedule();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [settings.reminderEnabled, settings.reminderTime, settings.reminderMessage]);

  return (
    <ReminderContext.Provider value={null}>
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminder() {
  return useContext(ReminderContext);
}

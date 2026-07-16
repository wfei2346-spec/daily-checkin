/**
 * 请求浏览器通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * 检查当前是否有通知权限
 */
export function hasNotificationPermission(): boolean {
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * 发送浏览器通知
 */
export function showNotification(title: string, body: string) {
  if (hasNotificationPermission()) {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'daily-checkin-reminder',
      requireInteraction: true,
    });
  }
}

/**
 * 计算到下一个提醒时间还有多少毫秒
 * @param timeStr 'HH:mm'
 */
export function msUntilTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    // 今天的时间已过，等待明天
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 获取今天的日期字符串
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * 获取 N 天前的日期字符串
 */
export function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

/**
 * 获取 N 个月前的日期字符串
 */
export function getMonthsAgo(n: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return formatDate(d);
}

/**
 * 获取日期所在周的周一日期
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * 获取中文星期名
 */
export function getWeekdayName(date: Date): string {
  return ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
}

/**
 * 格式化日期为中文显示
 */
export function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}月${d.getDate()}日 周${getWeekdayName(d)}`;
}

/**
 * 格式化时间 HH:mm 为可读文本
 */
export function formatTimeCN(time: string): string {
  const [h, m] = time.split(':');
  return `${parseInt(h)}:${m}`;
}

/**
 * 日時フォーマットユーティリティ
 */

/**
 * ISO8601形式のタイムスタンプを日時文字列にフォーマット
 */
export function formatDateTime(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

/**
 * ISO8601形式のタイムスタンプを日付文字列にフォーマット
 */
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

/**
 * ISO8601形式のタイムスタンプを時刻文字列にフォーマット
 */
export function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * 今日の0時0分0秒のISO8601形式のタイムスタンプを取得
 */
export function getTodayStart(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
}

/**
 * 今日の23時59分59秒のISO8601形式のタイムスタンプを取得
 */
export function getTodayEnd(): string {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today.toISOString();
}

/**
 * 指定されたタイムスタンプが今日かどうかを判定
 */
export function isToday(timestamp: string): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 現在のISO8601形式のタイムスタンプを取得
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

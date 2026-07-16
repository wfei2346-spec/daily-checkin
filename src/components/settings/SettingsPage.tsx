import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { Toggle } from '../common/Toggle';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { showNotification, requestNotificationPermission, hasNotificationPermission } from '../../utils/notifications';

export function SettingsPage() {
  const { settings, updateSetting } = useSettings();
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setHasPermission(hasNotificationPermission());
  }, []);

  const handleTestNotification = async () => {
    if (!hasPermission) {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
      if (!granted) {
        toast('通知权限被拒绝，请在浏览器设置中允许通知', 'error');
        return;
      }
    }
    showNotification('📋 每日打卡', '这是测试提醒！打卡时间到~');
    toast('测试提醒已发送');
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">提醒设置</h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        <div className="px-4">
          <Toggle
            label="启用每日提醒"
            description={`每天 ${settings.reminderTime} 提醒你打卡`}
            checked={settings.reminderEnabled}
            onChange={v => updateSetting('reminderEnabled', String(v))}
          />
        </div>

        {settings.reminderEnabled && (
          <>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提醒时间
              </label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={e => updateSetting('reminderTime', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
              />
            </div>

            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提醒消息
              </label>
              <input
                type="text"
                value={settings.reminderMessage}
                onChange={e => updateSetting('reminderMessage', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm text-gray-500 mb-3">
          提醒功能需要浏览器通知权限。页面关闭时不会提醒，但重新打开后会自动补发。
        </p>
        <Button variant="secondary" onClick={handleTestNotification} className="w-full">
          🔔 测试提醒
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-300">每日打卡 PWA v1.0</p>
        <p className="text-xs text-gray-300">数据存储在浏览器本地</p>
      </div>
    </div>
  );
}

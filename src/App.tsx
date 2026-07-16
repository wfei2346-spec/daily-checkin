import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReminderProvider } from './contexts/ReminderContext';
import { ToastProvider } from './components/common/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { CheckInPage } from './components/checkin/CheckInPage';
import { StatsPage } from './components/stats/StatsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { initDB } from './db';

export default function App() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <ToastProvider>
      <ReminderProvider>
        <HashRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<CheckInPage />} />
              <Route path="stats" element={<StatsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </ReminderProvider>
    </ToastProvider>
  );
}

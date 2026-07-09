import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { AllServosPage } from '@/pages/AllServosPage';
import { HeadPage } from '@/pages/HeadPage';
import { NeckPage } from '@/pages/NeckPage';
import { CameraPage } from '@/pages/CameraPage';
import { AiChatPage } from '@/pages/AiChatPage';
import { PresetsPage } from '@/pages/PresetsPage';
import { OfflinePage } from '@/pages/OfflinePage';
import { TestingPage } from '@/pages/TestingPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { CalibrationPage } from '@/pages/CalibrationPage';
import { BodyPage } from '@/pages/BodyPage';
import { MrlHubPage } from '@/pages/MrlHubPage';
import { MrlLivePage } from '@/pages/MrlLivePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/control" element={<AllServosPage />} />
          {/* Legacy paths → unified Control tabs (no duplicate UIs) */}
          <Route path="/head" element={<HeadPage />} />
          <Route path="/neck" element={<NeckPage />} />
          <Route path="/body" element={<BodyPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/ai" element={<AiChatPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/calibration" element={<CalibrationPage />} />
          <Route path="/robot" element={<MrlLivePage />} />
          <Route path="/features" element={<MrlHubPage />} />
          <Route path="/mrl" element={<Navigate to="/features" replace />} />
          <Route path="/mrl-live" element={<Navigate to="/robot" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
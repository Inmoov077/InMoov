import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/control" element={<AllServosPage />} />
          <Route path="/head" element={<HeadPage />} />
          <Route path="/neck" element={<NeckPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/ai" element={<AiChatPage />} />
          <Route path="/presets" element={<PresetsPage />} />
          <Route path="/offline" element={<OfflinePage />} />
          <Route path="/testing" element={<TestingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
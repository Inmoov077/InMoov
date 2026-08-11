import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';

/** Heavy pages load only when opened — keeps Home/dashboard fast. */
const AllServosPage = lazy(() =>
  import('@/pages/AllServosPage').then((m) => ({ default: m.AllServosPage })),
);
const HeadPage = lazy(() => import('@/pages/HeadPage').then((m) => ({ default: m.HeadPage })));
const NeckPage = lazy(() => import('@/pages/NeckPage').then((m) => ({ default: m.NeckPage })));
const CameraPage = lazy(() =>
  import('@/pages/CameraPage').then((m) => ({ default: m.CameraPage })),
);
const AiChatPage = lazy(() =>
  import('@/pages/AiChatPage').then((m) => ({ default: m.AiChatPage })),
);
const PresetsPage = lazy(() =>
  import('@/pages/PresetsPage').then((m) => ({ default: m.PresetsPage })),
);
const OfflinePage = lazy(() =>
  import('@/pages/OfflinePage').then((m) => ({ default: m.OfflinePage })),
);
const TestingPage = lazy(() =>
  import('@/pages/TestingPage').then((m) => ({ default: m.TestingPage })),
);
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
);
const CalibrationPage = lazy(() =>
  import('@/pages/CalibrationPage').then((m) => ({ default: m.CalibrationPage })),
);
const BodyPage = lazy(() => import('@/pages/BodyPage').then((m) => ({ default: m.BodyPage })));
const MrlHubPage = lazy(() =>
  import('@/pages/MrlHubPage').then((m) => ({ default: m.MrlHubPage })),
);
const MrlLivePage = lazy(() =>
  import('@/pages/MrlLivePage').then((m) => ({ default: m.MrlLivePage })),
);

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p>Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/control"
            element={
              <Suspense fallback={<PageFallback />}>
                <AllServosPage />
              </Suspense>
            }
          />
          <Route
            path="/head"
            element={
              <Suspense fallback={<PageFallback />}>
                <HeadPage />
              </Suspense>
            }
          />
          <Route
            path="/neck"
            element={
              <Suspense fallback={<PageFallback />}>
                <NeckPage />
              </Suspense>
            }
          />
          <Route
            path="/body"
            element={
              <Suspense fallback={<PageFallback />}>
                <BodyPage />
              </Suspense>
            }
          />
          <Route
            path="/camera"
            element={
              <Suspense fallback={<PageFallback />}>
                <CameraPage />
              </Suspense>
            }
          />
          <Route
            path="/ai"
            element={
              <Suspense fallback={<PageFallback />}>
                <AiChatPage />
              </Suspense>
            }
          />
          <Route
            path="/moves"
            element={
              <Suspense fallback={<PageFallback />}>
                <PresetsPage />
              </Suspense>
            }
          />
          {/* Old bookmark → new Moves URL */}
          <Route path="/presets" element={<Navigate to="/moves" replace />} />
          <Route
            path="/offline"
            element={
              <Suspense fallback={<PageFallback />}>
                <OfflinePage />
              </Suspense>
            }
          />
          <Route
            path="/testing"
            element={
              <Suspense fallback={<PageFallback />}>
                <TestingPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<PageFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
          <Route
            path="/calibration"
            element={
              <Suspense fallback={<PageFallback />}>
                <CalibrationPage />
              </Suspense>
            }
          />
          <Route
            path="/robot"
            element={
              <Suspense fallback={<PageFallback />}>
                <MrlLivePage />
              </Suspense>
            }
          />
          <Route
            path="/features"
            element={
              <Suspense fallback={<PageFallback />}>
                <MrlHubPage />
              </Suspense>
            }
          />
          <Route path="/mrl" element={<Navigate to="/control?mode=core&view=map" replace />} />
          <Route path="/mrl-live" element={<Navigate to="/control?mode=core&view=map" replace />} />
          <Route path="/studio" element={<Navigate to="/control" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

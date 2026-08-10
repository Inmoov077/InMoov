import { Navigate, useSearchParams } from 'react-router-dom';

/** Legacy /robot → unified Studio panel query. */
export function MrlLivePage() {
  const [params] = useSearchParams();
  const tab = params.get('tab') ?? params.get('panel');
  const next = new URLSearchParams();
  if (
    tab === 'gestures' ||
    tab === 'servos' ||
    tab === 'opencv' ||
    tab === 'runtime' ||
    tab === 'python' ||
    tab === 'usb' ||
    tab === 'pose'
  ) {
    next.set('panel', tab);
  }
  if (tab === 'inmoov' || !tab) {
    // default InMoov2 home
  }
  next.set('view', tab === 'pose' ? '3d' : 'map');
  const qs = next.toString();
  return <Navigate to={qs ? `/control?${qs}` : '/control'} replace />;
}

import { Navigate } from 'react-router-dom';

/** Neck controls live in Studio → Pose → Neck. */
export function NeckPage() {
  return <Navigate to="/control?pose=neck" replace />;
}

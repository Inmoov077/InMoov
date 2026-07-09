import { Navigate } from 'react-router-dom';

/** Neck controls live in the unified Control studio. */
export function NeckPage() {
  return <Navigate to="/control?tab=neck" replace />;
}

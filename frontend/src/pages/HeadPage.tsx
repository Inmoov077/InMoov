import { Navigate } from 'react-router-dom';

/** Head controls live in Studio → Pose → Head. */
export function HeadPage() {
  return <Navigate to="/control" replace />;
}

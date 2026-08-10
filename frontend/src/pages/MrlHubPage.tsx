import { Navigate } from 'react-router-dom';

/** Features map removed — use Studio workflow (Pose → Gestures → Core → USB). */
export function MrlHubPage() {
  return <Navigate to="/control" replace />;
}

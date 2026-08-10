import { Navigate } from 'react-router-dom';

/** Body controls live in Studio → Pose → Body. */
export function BodyPage() {
  return <Navigate to="/control?pose=body" replace />;
}

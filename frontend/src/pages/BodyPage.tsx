import { Navigate } from 'react-router-dom';

/** Body controls live in the unified Control studio. */
export function BodyPage() {
  return <Navigate to="/control?tab=body" replace />;
}

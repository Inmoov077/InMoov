import { Navigate } from 'react-router-dom';

/** Head controls live in the unified Control studio. */
export function HeadPage() {
  return <Navigate to="/control?tab=head" replace />;
}

/**
 * SignUp — redirects to /login since OTP handles both sign-in and sign-up.
 */
import { Navigate } from "react-router";

// OTP handles both sign-in and sign-up — redirect to login
export default function SignUp() {
  return <Navigate to="/login" replace />;
}

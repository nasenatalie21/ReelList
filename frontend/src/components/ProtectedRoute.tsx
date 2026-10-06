import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children?: ReactElement }) {
  const { user } = useAuth();
  return user && children ? children : <Navigate to="/login" replace />;
}

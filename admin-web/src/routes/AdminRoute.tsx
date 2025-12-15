import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function AdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const token = localStorage.getItem("adminAccessToken");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

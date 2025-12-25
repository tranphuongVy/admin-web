import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { storage } from "../utils/storage";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const token = storage.getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export default function Protected({ roles }: { roles?: Array<"user"|"agent"|"admin"> }) {
  const token = useSelector((s: RootState) => s.auth.token);
  // You can also decode the token to check role; for now just gate on token
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

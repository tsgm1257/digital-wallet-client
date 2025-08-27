import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { jwtDecode } from "jwt-decode";

type Payload = {
  userId: string;
  role: "user" | "agent" | "admin";
  iat?: number;
  exp?: number;
};

export function useAuth() {
  const token = useSelector((s: RootState) => s.auth.token);
  let role: Payload["role"] | null = null;
  let userId: string | null = null;

  if (token) {
    try {
      const p = jwtDecode<Payload>(token);
      role = p.role;
      userId = p.userId;
    } catch {
      // invalid token
    }
  }
  return { token, role, userId, isLoggedIn: !!token };
}

import { useState } from "react";
import { useLoginMutation } from "../redux/api/authApi";
import { useDispatch } from "react-redux";
import { setToken } from "../app/store";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

type Payload = { userId: string; role: "user" | "agent" | "admin" };

export default function Login() {
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      dispatch(setToken(res.token));
      const { role } = jwtDecode<Payload>(res.token);
      toast.success("Logged in");

      const target =
        role === "admin"
          ? "/dashboard/admin"
          : role === "agent"
          ? "/dashboard/agent"
          : "/dashboard/user";
      navigate(target);
    } catch (e: any) {
      toast.error(e?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container mx-auto px-3 py-12 max-w-md">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Username"
          value={username}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          className="input input-bordered w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
        <button
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account?{" "}
        <Link className="link" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

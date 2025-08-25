import { useState } from "react";
import { useRegisterMutation } from "../redux/api/authApi";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", role: "user", email: "", phone: "" });
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        role: form.role as "user"|"agent"|"admin",
        email: form.email || undefined,
        phone: form.phone || undefined,
      }).unwrap();
      toast.success("Registration successful. Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mx-auto px-3 py-12 max-w-lg">
      <h2 className="text-2xl font-semibold mb-6">Create account</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="username" value={form.username} onChange={onChange}
               className="input input-bordered w-full" placeholder="Username" required />
        <input name="email" value={form.email} onChange={onChange}
               className="input input-bordered w-full" placeholder="Email (optional)" />
        <input name="phone" value={form.phone} onChange={onChange}
               className="input input-bordered w-full" placeholder="Phone (optional)" />
        <input type="password" name="password" value={form.password} onChange={onChange}
               className="input input-bordered w-full" placeholder="Password" required />

        <div className="flex items-center gap-3">
          <label className="font-medium">Role</label>
          <select name="role" value={form.role} onChange={onChange} className="select select-bordered">
            <option value="user">User</option>
            <option value="agent">Agent</option>
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>

        <button className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`} disabled={isLoading}>
          {isLoading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <Link className="link" to="/login">Log in</Link>
      </p>
    </div>
  );
}

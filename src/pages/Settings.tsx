import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { RestartTourButton } from "../tour/WalletTour";
import {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyPasswordMutation,
} from "../redux/api/profileApi";

// Simple validators
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
const isPhone = (s: string) => /^[0-9+\-()\s]{6,}$/.test(s);

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-3">
      <span>Theme</span>
      <button
        id="theme-toggle" // tour anchor
        className="btn btn-outline btn-sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
    </div>
  );
}

export default function Settings() {
  // Fetch current user
  const { data: me, isLoading: meLoading } = useGetMyProfileQuery();

  // Editable profile state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (me) {
      setUsername(me.username || "");
      setEmail(me.email || "");
      setPhone(me.phone || "");
    }
  }, [me]);

  // Mutations
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateMyProfileMutation();
  const [updatePassword, { isLoading: savingPw }] =
    useUpdateMyPasswordMutation();

  // Password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const canSaveProfile = useMemo(() => {
    if (!username.trim()) return false;
    if (email && !isEmail(email)) return false;
    if (phone && !isPhone(phone)) return false;
    return true;
  }, [username, email, phone]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSaveProfile) return toast.error("Please fix the form");
    try {
      await updateProfile({
        username: username.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      }).unwrap();
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword)
      return toast.error("Fill both password fields");
    if (newPassword.length < 6)
      return toast.error("New password must be at least 6 characters");
    if (newPassword !== confirm) return toast.error("Passwords do not match");
    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Password changed");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="container mx-auto px-3 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Preferences */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Preferences</h2>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <span>Guided Tour</span>
            <RestartTourButton />
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Account</h2>

          {meLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-40" />
            </div>
          ) : (
            <form
              className="grid gap-3 md:grid-cols-2"
              onSubmit={submitProfile}
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  className="input input-bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  className="input input-bordered"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  className="input input-bordered"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              <div className="form-control md:items-end">
                <label className="label">
                  <span className="label-text opacity-0">Save</span>
                </label>
                <button
                  className={`btn btn-primary ${
                    savingProfile ? "loading" : ""
                  }`}
                  disabled={!canSaveProfile || savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Change Password</h2>
          <form className="grid gap-3 md:grid-cols-2" onSubmit={submitPassword}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Old Password</span>
              </label>
              <input
                className="input input-bordered"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current password"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                className="input input-bordered"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                className="input input-bordered"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>

            <div className="form-control md:items-end md:col-span-2">
              <button
                className={`btn btn-outline ${savingPw ? "loading" : ""}`}
                disabled={savingPw}
              >
                {savingPw ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Role / meta (read-only) */}
      {me && (
        <div className="text-sm opacity-70">
          <span>
            Role: <b className="capitalize">{me.role}</b>
          </span>
          {typeof me.isApproved === "boolean" && (
            <span className="ml-4">
              Agent approved: <b>{me.isApproved ? "Yes" : "No"}</b>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

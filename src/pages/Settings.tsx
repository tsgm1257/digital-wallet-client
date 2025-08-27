import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RestartTourButton } from "../tour/WalletTour";
import {
  useLazyLookupUserQuery,
  useUpdateMyProfileMutation,
  useUpdateMyPasswordMutation,
} from "../redux/api/profileApi";

// ---------------- Validators ----------------
const isEmail = (s: string) => !!s && /\S+@\S+\.\S+/.test(s);
const isPhone = (s: string) => !!s && /^[0-9+\-()\s]{6,}$/.test(s);

// ---------------- Theme Toggle ----------------
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
      <span className="text-sm md:text-base">Theme</span>
      <button
        id="theme-toggle"
        className="btn btn-outline btn-sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
    </div>
  );
}

// ---------------- Helpers (seed username for lookup) ----------------
function decodeJwt(token?: string): Record<string, unknown> | null {
  try {
    if (!token) return null;
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const parsed = JSON.parse(json);
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function guessUsername(): string {
  // localStorage then JWT payload fallbacks
  try {
    const lsUser = localStorage.getItem("user");
    if (lsUser) {
      const parsed = JSON.parse(lsUser);
      if (parsed?.username) return String(parsed.username);
    }
    const lsUsername = localStorage.getItem("username");
    if (lsUsername) return String(lsUsername);
  } catch (err) {
    // ignore localStorage/JSON errors but surface in development
    if (
      (globalThis as unknown as {
        process?: { env?: { NODE_ENV?: string } };
      }).process?.env?.NODE_ENV !== "production"
    ) {
      
      console.warn("guessUsername (localStorage) error:", err);
    }
  }

  try {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      "";
    const payload = decodeJwt(token);
    if (!payload) return "";
    const p = payload as Record<string, unknown>;

    if (typeof p.username === "string") {
      return p.username;
    }
    if (p.user && typeof p.user === "object") {
      const u = p.user as Record<string, unknown>;
      if (typeof u.username === "string") return u.username;
    }
  } catch (err) {
    // ignore token/parse errors but surface in development
    if (
      (globalThis as unknown as {
        process?: { env?: { NODE_ENV?: string } };
      }).process?.env?.NODE_ENV !== "production"
    ) {
      
      console.warn("guessUsername (token) error:", err);
    }
  }

  return "";
}

// ===================== SETTINGS =====================
export default function Settings() {
  // Prefill via /users/lookup
  type User = {
    username?: string;
    email?: string;
    phone?: string;
    role?: string;
    isApproved?: boolean;
    [k: string]: unknown;
  };
  type AuthSlice = { user?: User } | User;
  type RootState = { auth?: AuthSlice };

  const reduxAuthUser = useSelector((s: RootState) => {
    const auth = s?.auth;
    if (!auth) return undefined;
    // If the auth slice has a `user` property, return that; otherwise auth itself is the user object
    if (typeof auth === "object" && "user" in auth) {
      return (auth as { user?: User }).user;
    }
    return auth as User;
  });

  const initialUsername: string =
    (reduxAuthUser && reduxAuthUser.username) || guessUsername();

  const [triggerLookup, { data: me, isFetching: meLoading, isError: meErr }] =
    useLazyLookupUserQuery();

  // Editable profile state
  const [username, setUsername] = useState<string>(initialUsername || "");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // Load profile once we have a seed
  useEffect(() => {
    const seed = username || initialUsername || guessUsername();
    if (seed) triggerLookup({ username: seed });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hydrate the form from lookup
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

    type ProfileUpdate = {
      username: string;
      email?: string;
      phone?: string;
    };
    const payload: ProfileUpdate = { username: username.trim() };
    if (email.trim()) payload.email = email.trim();
    if (phone.trim()) payload.phone = phone.trim();

    try {
      const res = await updateProfile(payload).unwrap();
      // Response may be either { user: User } or User directly — extract safely without `any`
      const updated: User = (() => {
        if (!res || typeof res !== "object") return {};
        const r = res as Record<string, unknown>;
        if ("user" in r) {
          const u = r.user as unknown;
          if (u && typeof u === "object") return u as User;
          return {};
        }
        return r as User;
      })();

      setUsername(updated.username ?? username);
      setEmail(updated.email ?? email);
      setPhone(updated.phone ?? phone);
      // refresh via lookup to reflect backend normalization (e.g., phone digits)
      const seed = updated.username || username;
      if (seed) triggerLookup({ username: seed });
      toast.success("Profile updated");
    } catch (err: unknown) {
      const getMessage = (): string => {
        if (!err) return "Update failed";
        if (typeof err === "string") return err;
        if (typeof err === "object" && err !== null) {
          const maybe = err as { data?: unknown; message?: unknown };
          if (maybe.data && typeof maybe.data === "object" && maybe.data !== null) {
            const maybeMsg = (maybe.data as { message?: unknown }).message;
            if (typeof maybeMsg === "string") return maybeMsg;
          }
          if (typeof maybe.message === "string") return maybe.message;
        }
        return "Update failed";
      };
      toast.error(getMessage());
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
    } catch (err: unknown) {
      const msg = (() => {
        if (!err) return "Password change failed";
        if (typeof err === "string") return err;
        if (typeof err === "object" && err !== null) {
          const e = err as Record<string, unknown>;
          if (e.data && typeof e.data === "object" && e.data !== null) {
            const d = e.data as Record<string, unknown>;
            if (typeof d.message === "string") return d.message;
          }
          if (typeof e.message === "string") return e.message;
        }
        return "Password change failed";
      })();
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Settings
      </h1>

      {/* Preferences */}
      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg md:text-xl">Preferences</h2>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base">Guided Tour</span>
              <RestartTourButton />
            </div>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg md:text-xl">Account</h2>

          {meLoading ? (
            <div className="grid md:grid-cols-12 gap-x-6 gap-y-4">
              <div className="md:col-span-6 space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-10 w-full" />
              </div>
              <div className="md:col-span-6 space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-10 w-full" />
              </div>
              <div className="md:col-span-8 space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-10 w-full" />
              </div>
              <div className="md:col-span-4 flex items-end justify-end">
                <div className="skeleton h-10 w-40" />
              </div>
            </div>
          ) : meErr ? (
            <div className="alert alert-error">
              <span>
                Could not load your profile. You can still update it below.
              </span>
            </div>
          ) : (
            <form
              className="grid md:grid-cols-12 gap-x-6 gap-y-4"
              onSubmit={submitProfile}
            >
              {/* Username */}
              <div className="form-control md:col-span-6">
                <label className="label pb-1">
                  <span className="label-text">Username</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-control md:col-span-6">
                <label className="label pb-1">
                  <span className="label-text">Email</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <label className="label pt-1">
                  <span className="label-text-alt">
                    Optional — e.g. you@domain.com
                  </span>
                </label>
              </div>

              {/* Phone */}
              <div className="form-control md:col-span-8">
                <label className="label pb-1">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
                <label className="label pt-1">
                  <span className="label-text-alt">
                    Optional — digits, +, -, ( ), spaces allowed
                  </span>
                </label>
              </div>

              {/* Save button aligned right on desktop, full width on mobile */}
              <div className="md:col-span-4 flex md:justify-end items-end">
                <button
                  className={`btn btn-primary w-full md:w-auto ${
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
      </section>

      {/* Change Password */}
      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body space-y-4">
          <h2 className="card-title text-lg md:text-xl">Change Password</h2>
          <form
            className="grid md:grid-cols-12 gap-x-6 gap-y-4"
            onSubmit={submitPassword}
          >
            <div className="form-control md:col-span-4">
              <label className="label pb-1">
                <span className="label-text">Old Password</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current password"
                required
              />
            </div>

            <div className="form-control md:col-span-4">
              <label className="label pb-1">
                <span className="label-text">New Password</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                required
                minLength={6}
              />
            </div>

            <div className="form-control md:col-span-4">
              <label className="label pb-1">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                className="input input-bordered w-full"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="md:col-span-12 flex md:justify-end">
              <button
                className={`btn btn-outline w-full md:w-auto ${
                  savingPw ? "loading" : ""
                }`}
                disabled={savingPw}
              >
                {savingPw ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Role / meta (read-only) */}
      {me && (
        <div className="text-sm opacity-70">
          <span>
            Role: <b className="capitalize">{me.role}</b>
          </span>
          {typeof me.isApproved === "boolean" && (
            <span className="ml-4">
              Approved: <b>{me.isApproved ? "Yes" : "No"}</b>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router"; // per your preference
import { useDispatch } from "react-redux";
import { logout } from "../app/store";
import { useAuth } from "../hooks/useAuth";

/** Desktop theme icon toggle (DaisyUI swap) */
const ThemeToggleDesktop = () => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        className="theme-controller"
        value="dark"
        checked={isDark}
        onChange={(e) => setIsDark(e.target.checked)}
        aria-label="Toggle theme"
      />
      {/* sun */}
      <svg
        className="swap-off h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64 17l-.71.71a1 1 0 101.41 1.41l.71-.71A1 1 0 105.64 17zM4 12a1 1 0 100 2 1 1 0 000-2zm7-8a1 1 0 011-1 1 1 0 011 1v1a1 1 0 11-2 0V4zm7.36 3.64a1 1 0 10-1.41-1.41l-.71.71a1 1 0 101.41 1.41l.71-.71zM12 6a6 6 0 100 12 6 6 0 000-12zm7 5a1 1 0 100 2 1 1 0 000-2zm-1.64 7l.71.71a1 1 0 001.41-1.41l-.71-.71a1 1 0 10-1.41 1.41zM12 20a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1zM3.64 6.64l.71-.71A1 1 0 003 4.52a1 1 0 00-.71.29l-.71.71A1 1 0 103.64 6.64z" />
      </svg>
      {/* moon */}
      <svg
        className="swap-on h-6 w-6 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </label>
  );
};

/** Mobile theme toggle button with text */
const ThemeToggleMobileButton = () => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDark]);

  return (
    <button
      className="btn btn-outline btn-sm mx-auto"
      onClick={() => setIsDark((v) => !v)}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
};

const DesktopLinks = () => (
  <ul className="menu menu-horizontal gap-6">
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/features">Features</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
    <li>
      <Link to="/faq">FAQ</Link>
    </li>
    <li>
      <Link to="/contact">Contact</Link>
    </li>
  </ul>
);

const AvatarWithTooltip = ({
  name,
  photoURL,
}: {
  name?: string;
  photoURL?: string | null;
}) => {
  const initials = useMemo(() => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [name]);

  return (
    <div className="tooltip tooltip-bottom" data-tip={name || "User"}>
      <div className="avatar placeholder">
        <div className="bg-primary text-primary-content w-9 rounded-full">
          {photoURL ? (
            <img src={photoURL} alt={name || "User"} />
          ) : (
            <span className="text-sm">{initials}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        const u = JSON.parse(raw);
        setDisplayName(u?.name || u?.username || u?.email || "");
        setPhotoURL(u?.photoURL ?? null);
      } else {
        setDisplayName(role ? role[0].toUpperCase() + role.slice(1) : "User");
      }
    } catch {
      setDisplayName(role ? role[0].toUpperCase() + role.slice(1) : "User");
    }
  }, [role]);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  // Optional: outside-click / Esc to close
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b bg-base-100/80 backdrop-blur">
      {/* Container = consistent horizontal padding */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-column flex on desktop; brand + hamburger on mobile */}
        <div className="flex items-center gap-4 py-3">
          {/* LEFT (brand) */}
          <div className="md:basis-1/3">
            <Link
              to="/"
              className="font-bold text-lg btn btn-ghost px-0 normal-case"
            >
              DigitalWallet
            </Link>
          </div>

          {/* CENTER (links) — truly centered on lg+ */}
          <div className="hidden lg:flex lg:basis-1/3 justify-center">
            <DesktopLinks />
          </div>

          {/* RIGHT (actions) — pushed to far right on lg+ */}
          <div className="hidden lg:flex lg:basis-1/3 lg:justify-end lg:items-center lg:gap-3">
            <ThemeToggleDesktop />
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <AvatarWithTooltip name={displayName} photoURL={photoURL} />
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE hamburger (far right) + compact menu OUTSIDE navbar flow */}
          <div className="ml-auto lg:hidden relative">
            <button
              className="btn btn-ghost btn-square"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {open && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-xl border border-base-200
                           shadow-xl bg-base-100 p-4 flex flex-col items-center text-center gap-3 z-[60]"
              >
                {/* Links */}
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  Features
                </Link>
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  About
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="hover:underline"
                >
                  Contact
                </Link>

                <div className="divider my-2 w-full" />

                {/* Auth actions */}
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="btn btn-ghost w-full"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="btn btn-primary w-full"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="opacity-70">
                      Hello, {displayName || "User"}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost w-full"
                    >
                      Logout
                    </button>
                  </>
                )}

                {/* Theme toggle AFTER auth buttons, as text button */}
                <ThemeToggleMobileButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { FiSun, FiMoon, FiUser, FiSettings } from "react-icons/fi";
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
      <FiSun className="swap-off h-6 w-6" />
      <FiMoon className="swap-on h-6 w-6" />
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
      aria-label="Toggle theme"
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

/** Avatar that aligns the React Icon perfectly inside a circle */
const AlignedAvatar = ({
  name,
  photoURL,
  size = 36, // px
}: {
  name?: string;
  photoURL?: string | null;
  size?: number;
}) => {
  const px = `${size}px`;
  return (
    <div className="tooltip tooltip-bottom" data-tip={name || "User"}>
      <div className="avatar" style={{ width: px, height: px }}>
        <div
          className="rounded-full ring ring-base-300 ring-offset-2 overflow-hidden bg-base-200"
          style={{ width: px, height: px }}
        >
          {photoURL ? (
            <img
              src={photoURL}
              alt={name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full inline-flex items-center justify-center leading-none">
              <FiUser className="w-5 h-5 md:w-6 md:h-6 text-base-content/70" />
            </div>
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

  // close mobile menu on outside click / Esc
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

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "agent"
      ? "/dashboard/agent"
      : "/dashboard/user";

  return (
    <header className="sticky top-0 z-50 border-b bg-base-100/80 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-3">
          {/* LEFT */}
          <div className="md:basis-1/3">
            <Link
              to="/"
              className="font-bold text-lg btn btn-ghost px-0 normal-case"
            >
              DigitalWallet
            </Link>
          </div>

          {/* CENTER */}
          <div className="hidden lg:flex lg:basis-1/1 justify-center">
            <DesktopLinks />
          </div>

          {/* RIGHT (desktop) */}
          <div className="hidden lg:flex lg:basis-1/3 lg:justify-end lg:items-center lg:gap-3">
            <ThemeToggleDesktop />

            {isLoggedIn && (
              <>
                <Link to={dashboardPath} className="btn btn-outline">
                  Dashboard
                </Link>

                {/* Settings as icon-only */}
                <div className="tooltip tooltip-bottom" data-tip="Settings">
                  <Link
                    to="/settings"
                    className="btn btn-ghost btn-square"
                    aria-label="Settings"
                  >
                    <FiSettings className="w-5 h-5" />
                  </Link>
                </div>
              </>
            )}

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
                <AlignedAvatar name={displayName} photoURL={photoURL} />
                <button onClick={handleLogout} className="btn btn-ghost">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE menu */}
          <div className="ml-auto lg:hidden relative">
            <button
              className="btn btn-ghost btn-square"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {/* Hamburger icon */}
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
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link to="/features" onClick={() => setOpen(false)}>
                  Features
                </Link>
                <Link to="/about" onClick={() => setOpen(false)}>
                  About
                </Link>
                <Link to="/faq" onClick={() => setOpen(false)}>
                  FAQ
                </Link>
                <Link to="/contact" onClick={() => setOpen(false)}>
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
                    <Link
                      to={dashboardPath}
                      onClick={() => setOpen(false)}
                      className="btn btn-outline w-full"
                    >
                      Dashboard
                    </Link>
                    {/* Keep text in mobile menu for clarity; say the word if you want icon-only here too */}
                    <Link
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="btn btn-ghost w-full"
                    >
                      Settings
                    </Link>
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

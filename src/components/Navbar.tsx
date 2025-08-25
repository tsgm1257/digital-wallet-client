import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../app/store";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const doLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div
      id="nav-menu"
      className="navbar bg-base-100 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-3">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Digital Wallet
          </Link>
        </div>
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal">
            <li>
              <Link to="/features">Features</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link to="/settings">Settings</Link>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
            {!isLoggedIn && (
              <li>
                <Link to="/register">Register</Link>
              </li>
            )}
            {isLoggedIn && role === "user" && (
              <li>
                <Link to="/dashboard/user">Dashboard</Link>
              </li>
            )}
            {isLoggedIn && role === "agent" && (
              <li>
                <Link to="/dashboard/agent">Agent</Link>
              </li>
            )}
            {isLoggedIn && role === "admin" && (
              <li>
                <Link to="/dashboard/admin">Admin</Link>
              </li>
            )}
            {isLoggedIn && (
              <li>
                <button className="btn btn-ghost" onClick={doLogout}>
                  Logout
                </button>
              </li>
            )}
            <li>
              <button
                id="theme-toggle" // tour step anchor
                className="btn btn-ghost btn-sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "Dark" : "Light"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

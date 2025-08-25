import { Link } from "react-router";


export default function Navbar() {
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
            <li>
              <Link to="/settings">Settings</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

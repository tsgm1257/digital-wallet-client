import { Link } from "react-router";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

export default function Footer() {
  const { isLoggedIn, role } = useAuth();

  return (
    <footer className="bg-base-200 border-t border-base-300 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h2 className="font-bold text-lg">DigitalWallet</h2>
          <p className="mt-2 text-sm opacity-80">
            Send, save, and spend with confidence. Fast, secure, and always in
            your pocket.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className="hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
            {isLoggedIn && (
              <li>
                <Link
                  to={
                    role === "admin"
                      ? "/dashboard/admin"
                      : role === "agent"
                      ? "/dashboard/agent"
                      : "/dashboard/user"
                  }
                  className="hover:underline"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-3">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FiFacebook /> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FiTwitter /> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FiInstagram /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FiLinkedin /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <FiGithub /> GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-base-300 py-4 text-center text-sm opacity-70">
        © {new Date().getFullYear()} DigitalWallet. All rights reserved.
      </div>
    </footer>
  );
}

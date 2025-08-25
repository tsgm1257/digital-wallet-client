import { RestartTourButton } from "../tour/WalletTour";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex items-center gap-3">
      <span>Theme</span>
      <button
        id="theme-toggle"                 // <-- tour step anchor
        className="btn btn-outline btn-sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "Switch to Dark" : "Switch to Light"}
      </button>
    </div>
  );
}

export default function Settings() {
  return (
    <div className="container mx-auto px-3 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="card-title">Preferences</h2>
          <ThemeToggle />
          <div>
            <span className="mr-3">Guided Tour</span>
            <RestartTourButton />
          </div>
        </div>
      </div>

      {/* You can add sections for Profile, Password, Notifications, etc. */}
    </div>
  );
}

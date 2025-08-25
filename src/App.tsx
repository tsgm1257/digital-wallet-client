import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import Protected from "./routes/Protected";
import { Toaster } from "react-hot-toast";
import Settings from "./pages/Settings";

function Placeholder({ title }: { title: string }) {
  return <div className="container mx-auto px-3 py-10">{title}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Placeholder title="Features" />} />
        <Route path="/faq" element={<Placeholder title="FAQ" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<Protected roles={["user"]} />}>
          <Route path="/dashboard/user" element={<DashboardUser />} />
        </Route>

        <Route element={<Protected roles={["agent"]} />}>
          <Route
            path="/dashboard/agent"
            element={<Placeholder title="Agent Dashboard" />}
          />
        </Route>

        <Route element={<Protected roles={["admin"]} />}>
          <Route
            path="/dashboard/admin"
            element={<Placeholder title="Admin Dashboard" />}
          />
        </Route>

        <Route element={<Protected />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Placeholder title="Not Found" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

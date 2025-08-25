import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Features from "./pages/Features";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import DashboardAgent from "./pages/DashboardAgent";
import DashboardAdmin from "./pages/DashboardAdmin";
import Protected from "./routes/Protected";
import { Toaster } from "react-hot-toast";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function Placeholder({ title }: { title: string }) {
  return <div className="container mx-auto px-3 py-10">{title}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected (unchanged) */}
        <Route element={<Protected roles={["user"]} />}>
          <Route path="/dashboard/user" element={<DashboardUser />} />
        </Route>
        <Route element={<Protected roles={["agent"]} />}>
          <Route path="/dashboard/agent" element={<DashboardAgent />} />
        </Route>
        <Route element={<Protected roles={["admin"]} />}>
          <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        </Route>
        <Route element={<Protected />}>
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

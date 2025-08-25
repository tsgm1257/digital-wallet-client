import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardUser from "./pages/DashboardUser";
import Protected from "./routes/Protected";
import Settings from "./pages/Settings";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/features"
          element={<div className="container mx-auto px-3 py-10">Features</div>}
        />
        <Route
          path="/faq"
          element={<div className="container mx-auto px-3 py-10">FAQ</div>}
        />
        <Route path="/login" element={<Login />} />

        {/* Protected area */}
        <Route element={<Protected />}>
          <Route path="/dashboard/user" element={<DashboardUser />} />
          <Route path="/settings" element={<Settings />} /> 
        </Route>

        <Route
          path="*"
          element={
            <div className="container mx-auto px-3 py-10">Not Found</div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

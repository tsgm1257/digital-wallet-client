import { Link, useNavigate, useLocation } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="container mx-auto px-3 py-16 flex items-center justify-center">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-base-200 px-4 py-2 mb-4">
          <span className="text-sm opacity-70">Error</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
        <p className="mt-3 text-lg opacity-80">
          We couldn’t find <span className="font-mono break-all">{pathname}</span>.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <button onClick={() => navigate(-1)} className="btn btn-outline">Go Back</button>
          <Link to="/contact" className="btn btn-ghost">Contact</Link>
        </div>

        <div className="mt-8">
          <p className="opacity-70 text-sm">Try one of these:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link className="badge badge-lg" to="/features">Features</Link>
            <Link className="badge badge-lg" to="/about">About</Link>
            <Link className="badge badge-lg" to="/faq">FAQ</Link>
            <Link className="badge badge-lg" to="/login">Login</Link>
            <Link className="badge badge-lg" to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

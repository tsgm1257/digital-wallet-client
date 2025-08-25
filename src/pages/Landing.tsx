import { Link } from "react-router";

export default function Landing() {
  return (
    <div className="container mx-auto px-3">
      <section className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold">Send. Save. Spend. Securely.</h1>
            <p className="py-6">A fast, secure digital wallet for users, agents, and admins.</p>
            <div className="flex gap-3 justify-center">
              <Link className="btn btn-primary" to="/login">Get Started</Link>
              <Link className="btn btn-outline" to="/features">See Features</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

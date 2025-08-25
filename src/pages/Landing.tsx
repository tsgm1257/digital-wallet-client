import { Link } from "react-router";
import { useEffect, useState } from "react";

type Stat = { label: string; value: string };

export default function Landing() {
  const [stats, setStats] = useState<Stat[] | null>(null);

  // Simulate fetch delay for skeleton demo
  useEffect(() => {
    const t = setTimeout(() => {
      setStats([
        { label: "Active Users", value: "12.4k" },
        { label: "Monthly Volume", value: "$1.9M" },
        { label: "Avg. Txn Time", value: "0.8s" },
      ]);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[80vh]">
      {/* Hero */}
      <section className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 via-base-200 to-base-100">
        <div className="hero-content text-center">
          <div className="max-w-2xl px-3">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Send. Save. Spend. <span className="text-primary">Securely.</span>
            </h1>
            <p className="py-6 text-base md:text-lg opacity-80">
              A fast, secure digital wallet for Users, Agents, and Admins—built
              with React, Redux Toolkit, and RTK Query.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link className="btn btn-primary" to="/register">
                Get Started
              </Link>
              <Link className="btn btn-outline" to="/features">
                See Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats with skeleton */}
      <section className="container mx-auto px-3 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {stats
            ? stats.map((s) => (
                <div
                  key={s.label}
                  className="card bg-base-100 shadow transition-all duration-300 hover:shadow-lg"
                >
                  <div className="card-body items-center">
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="opacity-70">{s.label}</p>
                  </div>
                </div>
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card bg-base-100 shadow">
                  <div className="card-body items-center">
                    <div className="skeleton h-8 w-24 mb-2" />
                    <div className="skeleton h-4 w-32" />
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-3 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Instant Transfers",
              desc: "Peer-to-peer sends complete in seconds with real-time balance updates.",
            },
            {
              title: "Role-Based Dashboards",
              desc: "Custom experiences for Users, Agents, and Admins with secure auth.",
            },
            {
              title: "Charts & Filters",
              desc: "Visualize trends and dig into data with rich filters and pagination.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300"
            >
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p className="opacity-80">{item.desc}</p>
                <div className="card-actions justify-end">
                  <Link className="btn btn-sm btn-ghost" to="/features">
                    Learn more →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";

type Member = { name: string; role: string };

export default function About() {
  const [team, setTeam] = useState<Member[] | null>(null);

  // Simulate load for skeleton UX
  useEffect(() => {
    const t = setTimeout(() => {
      setTeam([
        { name: "Aisha Rahman", role: "Product Lead" },
        { name: "Zidan Hasan", role: "Frontend Engineer" },
        { name: "Mehedi Karim", role: "Backend Engineer" },
      ]);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="container mx-auto px-3 py-10 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold mb-2">About Digital Wallet</h1>
        <p className="opacity-80">
          Our mission is to make everyday transactions simple, fast, and secure. We
          combine a clean UX with robust engineering—JWT auth, role-based access,
          and a scalable API.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {team
          ? team.map((m) => (
              <div key={m.name} className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
                <div className="card-body">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-16">
                      <span>{m.name.split(" ")[0][0]}</span>
                    </div>
                  </div>
                  <h3 className="card-title mt-3">{m.name}</h3>
                  <p className="opacity-70">{m.role}</p>
                </div>
              </div>
            ))
          : Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="skeleton rounded-full h-16 w-16" />
                  <div className="skeleton h-6 w-40 mt-3" />
                  <div className="skeleton h-4 w-28" />
                </div>
              </div>
            ))}
      </section>

      <section className="prose max-w-none">
        <h2>Our Story</h2>
        <p>
          Born from the need for modern, mobile-first payments, our wallet brings
          bKash/Nagad-style flows to the web, focusing on accessible design and
          enterprise-grade features.
        </p>
        <h2>Values</h2>
        <ul>
          <li>Security-first development</li>
          <li>Performance and accessibility</li>
          <li>Clear UX for every role</li>
        </ul>
      </section>
    </div>
  );
}

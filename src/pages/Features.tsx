const FEATURES = [
  {
    title: "Secure Auth",
    desc: "JWT + refresh-safe pattern with role-based redirects and protected routes.",
    icon: "🔐",
  },
  {
    title: "State Management",
    desc: "Redux Toolkit & RTK Query with normalized caches and tags.",
    icon: "🧠",
  },
  {
    title: "Transactions",
    desc: "Send, deposit, withdraw with pagination, filtering & charts.",
    icon: "💸",
  },
  {
    title: "Agent Tools",
    desc: "Cash-in/out flows with user lookup by username/email/phone.",
    icon: "🤝",
  },
  {
    title: "Admin Suite",
    desc: "Users, wallets, transactions, and KPI cards with charting.",
    icon: "🛠️",
  },
  {
    title: "Guided Tour",
    desc: "Onboarding steps via @reactour/tour, run-once with restart.",
    icon: "🗺️",
  },
];

export default function Features() {
  return (
    <div className="container mx-auto px-3 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Features</h1>
        <p className="opacity-80">
          Built for clarity and speed — everything you need to manage digital wallets.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <div className="text-4xl">{f.icon}</div>
              <h3 className="card-title mt-2">{f.title}</h3>
              <p className="opacity-80">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

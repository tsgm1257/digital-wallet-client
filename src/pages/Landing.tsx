import { Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiShield, FiZap, FiUsers, FiBarChart2 } from "react-icons/fi";

type Stat = { label: string; value: string };

export default function Landing() {
  const [stats, setStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setStats([
        { label: "Active Users", value: "12.4k" },
        { label: "Monthly Transactions", value: "$1.9M" },
        { label: "Agents Worldwide", value: "850+" },
        { label: "Avg. Transfer Time", value: "0.8s" },
      ]);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[80vh]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-base-200 to-base-100" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid items-center gap-10 md:gap-14 md:grid-cols-2">
            {/* On small screens: image goes first */}
            <motion.div
              className="order-first md:order-last relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-base-300/60">
                <img
                  src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=1600&q=60"
                  alt="Digital wallet dashboard preview"
                  className="w-full h-[260px] md:h-[420px] object-cover"
                />
              </div>
            </motion.div>

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs md:text-sm">
                <span className="badge badge-primary badge-xs" />
                Trusted by thousands worldwide
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Send, Save & Spend{" "}
                <span className="text-primary">with Confidence</span>
              </h1>

              <p className="mt-4 text-base md:text-lg opacity-80">
                Move money in seconds, pay securely, and keep a crystal-clear
                view of your balance and history—anytime, anywhere.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className="btn btn-primary" to="/register">
                  Create free account
                </Link>
                <Link className="btn btn-outline" to="/features">
                  Explore features
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          className="grid gap-4 md:grid-cols-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {stats
            ? stats.map((s) => (
                <div
                  key={s.label}
                  className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300/60"
                >
                  <div className="card-body items-center">
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="opacity-70">{s.label}</p>
                  </div>
                </div>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="card bg-base-100 shadow border border-base-300/60"
                >
                  <div className="card-body items-center">
                    <div className="skeleton h-8 w-24 mb-2" />
                    <div className="skeleton h-4 w-32" />
                  </div>
                </div>
              ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold">How it works</h2>
          <p className="mt-2 opacity-80">
            Create an account in minutes and start moving money instantly.
          </p>
        </motion.div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Create your account",
              desc: "Sign up in minutes. Strong security keeps your wallet safe.",
              icon: <FiUsers className="text-primary w-6 h-6" />,
            },
            {
              step: "2",
              title: "Add & send money",
              desc: "Top-up from your bank or card, then transfer instantly.",
              icon: <FiZap className="text-primary w-6 h-6" />,
            },
            {
              step: "3",
              title: "Track everything",
              desc: "See your balance, history, and insights in real time.",
              icon: <FiBarChart2 className="text-primary w-6 h-6" />,
            },
          ].map((item, idx) => (
            <motion.div
              key={item.step}
              className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300/60"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary grid place-items-center">
                    {item.icon}
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                </div>
                <p className="mt-2 opacity-80">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Bank-grade Security",
              desc: "Your money and data are protected with encryption and monitoring.",
              icon: <FiShield className="w-6 h-6 text-primary" />,
            },
            {
              title: "Instant Transfers",
              desc: "Send and receive money in seconds, locally or globally.",
              icon: <FiZap className="w-6 h-6 text-primary" />,
            },
            {
              title: "Smart Insights",
              desc: "Track spending, savings, and income with real-time analytics.",
              icon: <FiBarChart2 className="w-6 h-6 text-primary" />,
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 border border-base-300/60"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  {item.icon}
                  <h3 className="card-title">{item.title}</h3>
                </div>
                <p className="opacity-80">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-10 rounded-2xl border border-base-300/60 bg-base-100 p-6 md:p-8 shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold">
            Ready to take control of your money?
          </h3>
          <p className="mt-2 opacity-80">
            Join thousands who use DigitalWallet for fast, secure payments.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link className="btn btn-primary" to="/register">
              Get started free
            </Link>
            <Link className="btn btn-outline" to="/features">
              View all features
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

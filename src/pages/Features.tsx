import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FiZap,
  FiShield,
  FiUsers,
  FiBarChart2,
  FiCreditCard,
  FiBell,
  FiGlobe,
  FiRepeat,
  FiCheckCircle,
} from "react-icons/fi";

export default function Features() {
  return (
    <div className="min-h-[80vh]">
      {/* Intro / mini-hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-base-200 to-base-100" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            className="max-w-3xl text-center mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              Powerful features,{" "}
              <span className="text-primary">designed for speed and trust</span>
            </h1>
            <p className="mt-3 opacity-80">
              From instant transfers to role-based dashboards and smart
              insights—DigitalWallet helps you move money confidently and stay
              in control of every transaction.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link className="btn btn-primary" to="/register">
                Get started free
              </Link>
              <Link className="btn btn-outline" to="/faq">
                Read FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core features grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What you can do
        </motion.h2>

        <motion.div
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {[
            {
              icon: <FiZap className="w-6 h-6 text-primary" />,
              title: "Instant Transfers",
              desc: "Send and receive money in seconds with real-time balance updates.",
            },
            {
              icon: <FiShield className="w-6 h-6 text-primary" />,
              title: "Bank-grade Security",
              desc: "Encryption at rest and in transit, session protection, and monitoring.",
            },
            {
              icon: <FiUsers className="w-6 h-6 text-primary" />,
              title: "Role-based Dashboards",
              desc: "Tailored experiences for Users, Agents, and Admins.",
            },
            {
              icon: <FiBarChart2 className="w-6 h-6 text-primary" />,
              title: "Smart Insights",
              desc: "See income/expense trends, filter by date, and export history.",
            },
            {
              icon: <FiCreditCard className="w-6 h-6 text-primary" />,
              title: "Bill Pay & Top-ups",
              desc: "Pay utilities or top-up accounts directly from your wallet.",
            },
            {
              icon: <FiBell className="w-6 h-6 text-primary" />,
              title: "Real-time Alerts",
              desc: "Get notified for transfers, requests, approvals, and low balance.",
            },
          ].map((f, idx) => (
            <motion.div
              key={f.title}
              className="card bg-base-100 border border-base-300/60 shadow hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                    {f.icon}
                  </div>
                  <h3 className="card-title">{f.title}</h3>
                </div>
                <p className="mt-2 opacity-80">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Role sections */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built for every role
        </motion.h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              label: "User",
              bullets: [
                "Send/receive instantly",
                "View balance & history",
                "Bill pay & top-ups",
              ],
            },
            {
              label: "Agent",
              bullets: [
                "Top-up customers",
                "Approve requests",
                "Manage cash-in/out",
              ],
            },
            {
              label: "Admin",
              bullets: [
                "Monitor transactions",
                "Manage roles & approvals",
                "System-wide analytics",
              ],
            },
          ].map((r, idx) => (
            <motion.div
              key={r.label}
              className="card bg-base-100 border border-base-300/60 shadow hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                    {r.label === "User" && <FiUsers className="text-primary" />}
                    {r.label === "Agent" && (
                      <FiRepeat className="text-primary" />
                    )}
                    {r.label === "Admin" && (
                      <FiBarChart2 className="text-primary" />
                    )}
                  </div>
                  <h3 className="card-title">{r.label} Dashboard</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {r.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 opacity-90">
                      <FiCheckCircle className="text-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Global & Compliance */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Global */}
          <motion.div
            className="card bg-base-100 border border-base-300/60 shadow"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                  <FiGlobe className="text-primary" />
                </div>
                <h3 className="card-title">Global & Multi-currency</h3>
              </div>
              <p className="mt-2 opacity-80">
                Send payments across regions with support for multiple
                currencies and localized experiences where available.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2 opacity-90">
                  <FiCheckCircle className="text-primary" />
                  Transparent conversion rates
                </li>
                <li className="flex items-center gap-2 opacity-90">
                  <FiCheckCircle className="text-primary" />
                  Localized number/date formats
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            className="card bg-base-100 border border-base-300/60 shadow"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-body">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                  <FiShield className="text-primary" />
                </div>
                <h3 className="card-title">Security & Controls</h3>
              </div>
              <p className="mt-2 opacity-80">
                Layered protection with encryption, secure sessions, and robust
                access controls for every role.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center gap-2 opacity-90">
                  <FiCheckCircle className="text-primary" />
                  Role-based access & approvals
                </li>
                <li className="flex items-center gap-2 opacity-90">
                  <FiCheckCircle className="text-primary" />
                  Audit trails & activity logs
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="rounded-2xl border border-base-300/60 bg-base-100 p-6 md:p-8 shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold">
            Everything you need to move money fast
          </h3>
          <p className="mt-2 opacity-80">
            Join thousands who trust DigitalWallet for secure, instant payments.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link className="btn btn-primary" to="/register">
              Create your account
            </Link>
            <Link className="btn btn-outline" to="/about">
              Learn more about us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

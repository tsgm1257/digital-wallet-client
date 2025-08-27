import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FiHeart,
  FiUsers,
  FiShield,
  FiTrendingUp,
  FiGlobe,
  FiClock,
  FiMail,
} from "react-icons/fi";

export default function About() {
  return (
    <div className="min-h-[80vh]">
      {/* Mini-hero / intro */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-base-200 to-base-100" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold">
              About <span className="text-primary">DigitalWallet</span>
            </h1>
            <p className="mt-3 opacity-80">
              We’re building the simplest, fastest way to move money—so you can
              focus on what matters. Instant transfers, secure by default, and
              crystal-clear insights for every role.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link className="btn btn-primary" to="/register">
                Create free account
              </Link>
              <Link className="btn btn-outline" to="/features">
                Explore features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2">
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
                  <FiHeart className="text-primary" />
                </div>
                <h3 className="card-title">Our Mission</h3>
              </div>
              <p className="mt-2 opacity-80">
                Empower everyone—users, agents, and admins—to send, save, and
                spend money with confidence. We make payments instant and
                visibility effortless.
              </p>
            </div>
          </motion.div>

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
                  <FiTrendingUp className="text-primary" />
                </div>
                <h3 className="card-title">Our Vision</h3>
              </div>
              <p className="mt-2 opacity-80">
                A world where moving value is as simple as sending a message—
                globally available, secure by default, and understood at a
                glance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Story
        </motion.h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              year: "2023",
              title: "Foundations",
              desc: "We set out to simplify payments—faster transfers, cleaner dashboards, and clearer insights.",
            },
            {
              year: "2024",
              title: "Dashboards for All",
              desc: "User, Agent, and Admin experiences shipped with secure authentication and approvals.",
            },
            {
              year: "2025",
              title: "Scale & Insights",
              desc: "Real-time analytics, global readiness, and performance tuned for sub-second transfers.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.year}
              className="card bg-base-100 border border-base-300/60 shadow"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide opacity-60">
                    <FiClock className="inline-block mr-1" />
                    {item.year}
                  </span>
                </div>
                <h3 className="mt-1 card-title">{item.title}</h3>
                <p className="mt-2 opacity-80">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          What we value
        </motion.h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FiShield className="text-primary w-6 h-6" />,
              title: "Security First",
              desc: "Encryption, access controls, and continuous monitoring built in from day one.",
            },
            {
              icon: <FiUsers className="text-primary w-6 h-6" />,
              title: "People Over Process",
              desc: "Design for clarity, speed, and inclusion—so everyone can move money with ease.",
            },
            {
              icon: <FiGlobe className="text-primary w-6 h-6" />,
              title: "Global Mindset",
              desc: "Multi-currency and localization friendly to reach users wherever they are.",
            },
          ].map((v, idx) => (
            <motion.div
              key={v.title}
              className="card bg-base-100 border border-base-300/60 shadow hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                    {v.icon}
                  </div>
                  <h3 className="card-title">{v.title}</h3>
                </div>
                <p className="mt-2 opacity-80">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust / Security callout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <motion.div
          className="rounded-2xl border border-base-300/60 bg-base-100 p-6 md:p-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">
                Built for trust and reliability
              </h3>
              <p className="mt-2 opacity-80">
                We combine encryption, role-based access, and audit trails to
                protect every transaction—so you can focus on the outcome, not
                the plumbing.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">99.95%</div>
                <div className="text-xs opacity-70">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">&lt;1s</div>
                <div className="text-xs opacity-70">Avg transfer</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs opacity-70">Monitoring</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact / CTA */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="rounded-2xl border border-base-300/60 bg-base-100 p-6 md:p-8 shadow-lg text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold">We’re here to help</h3>
          <p className="mt-2 opacity-80">
            Questions about features, roles, or onboarding a team? Reach out and
            we’ll get back quickly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <Link className="btn btn-primary" to="/contact">
              <FiMail className="mr-2" />
              Contact us
            </Link>
            <Link className="btn btn-outline" to="/features">
              See what’s possible
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FiHelpCircle,
  FiSearch,
  FiChevronDown,
  FiShield,
  FiZap,
  FiUsers,
  FiGlobe,
  FiPhoneCall,
} from "react-icons/fi";

type QA = { q: string; a: string; tags?: string[] };

// ---- DATA ----
const ALL_QA: Record<string, QA[]> = {
  "Getting started": [
    {
      q: "What is DigitalWallet?",
      a: "DigitalWallet lets you send, receive, and manage money instantly. Track your balance and history in real time with role-based dashboards for Users, Agents, and Admins.",
      tags: ["intro", "about"],
    },
    {
      q: "How do I create an account?",
      a: "Sign up with your email, verify your address, and set a secure password. You can start sending or adding money once your account is verified.",
      tags: ["signup", "verification"],
    },
    {
      q: "Do I need to verify my identity?",
      a: "Basic verification is required to comply with regulations and protect your account. In some regions, additional KYC checks may apply for higher limits.",
      tags: ["kyc", "limits"],
    },
  ],
  Transfers: [
    {
      q: "How fast are transfers?",
      a: "Most peer-to-peer transfers complete in seconds. External bank transfers may vary by region and banking rails.",
      tags: ["speed", "p2p"],
    },
    {
      q: "Are there transfer limits?",
      a: "Yes. Limits depend on your verification tier and region. You can view your current limits in Settings → Account Limits.",
      tags: ["limits"],
    },
    {
      q: "Can I cancel or reverse a transfer?",
      a: "If the recipient hasn’t accepted yet, you can cancel from your history. For completed transfers, open a support ticket from the transaction details.",
      tags: ["cancel", "refunds"],
    },
  ],
  Security: [
    {
      q: "How is my money protected?",
      a: "We use encryption in transit and at rest, secure sessions, device checks, and role-based access controls. Suspicious activity is monitored 24/7.",
      tags: ["encryption", "monitoring"],
    },
    {
      q: "Do you support two-factor authentication (2FA)?",
      a: "Yes. Enable 2FA in Settings to add an extra verification step at sign-in.",
      tags: ["2fa", "mfa"],
    },
    {
      q: "What should I do if I suspect fraud?",
      a: "Freeze your account from Settings → Security, then contact Support immediately. We’ll help investigate and secure your wallet.",
      tags: ["fraud", "support"],
    },
  ],
  "Regions & currency": [
    {
      q: "Which countries and currencies are supported?",
      a: "Coverage is growing. Check the Regions page for current availability, supported currencies, and local limits.",
      tags: ["regions", "currency"],
    },
    {
      q: "How are FX rates handled?",
      a: "We show the estimated rate and fees before you confirm. Rates are sourced from reputable providers and refreshed frequently.",
      tags: ["fx", "fees"],
    },
  ],
  Agents: [
    {
      q: "What do agents do?",
      a: "Agents can assist with cash-in/cash-out, top-ups, and approvals where applicable. Your Agent dashboard centralizes these tasks.",
      tags: ["agent", "cash in", "cash out"],
    },
    {
      q: "How do I become an agent?",
      a: "Apply from the Dashboard → Agent Onboarding. We’ll review your details and notify you once approved.",
      tags: ["onboarding"],
    },
  ],
  "Fees & refunds": [
    {
      q: "What fees should I expect?",
      a: "Peer-to-peer transfers are typically free. External transfers and FX may include small fees shown upfront before you confirm.",
      tags: ["fees"],
    },
    {
      q: "How do refunds and disputes work?",
      a: "Open a dispute from the transaction details. Our team will review and keep you updated via email and the app.",
      tags: ["refunds", "disputes"],
    },
  ],
  Account: [
    {
      q: "I forgot my password—what now?",
      a: "Use the ‘Forgot password’ link on the login page. If you’ve enabled 2FA, you’ll be prompted to verify as part of the reset.",
      tags: ["password", "recovery"],
    },
    {
      q: "How do I close my account?",
      a: "Go to Settings → Account → Close Account. We’ll guide you through balance settlement and data export before closure.",
      tags: ["closure", "data export"],
    },
  ],
};

// ---- UTILITIES ----
const sectionId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function useFlattenedQA(data: typeof ALL_QA) {
  return useMemo(
    () =>
      Object.entries(data).flatMap(([section, items]) =>
        items.map((x) => ({ ...x, section }))
      ),
    []
  );
}

function AccordionItem({
  q,
  a,
  defaultOpen = false,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-base-300/60 bg-base-100 shadow-sm">
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        <FiChevronDown
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-sm opacity-90 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const flattened = useFlattenedQA(ALL_QA);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return flattened;
    return flattened.filter(
      (item) =>
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q)) ||
        item.section.toLowerCase().includes(q)
    );
  }, [flattened, query]);

  // Smooth scroll helper for category tiles
  const goToSection = (label: string) => {
    setQuery(""); // ensure grouped view
    const id = sectionId(label);
    // allow React to render grouped view before scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="min-h-[80vh]">
      {/* Intro / mini-hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-base-200 to-base-100" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            className="max-w-3xl text-center mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs md:text-sm">
              <FiHelpCircle />
              Help Center • FAQs
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold">
              How can we help?
            </h1>
            <p className="mt-2 opacity-80">
              Browse common questions about transfers, limits, security, agents,
              and more. Still stuck? Reach out—our team is quick.
            </p>

            {/* Search — centered & aligned */}
            <div className="mt-6">
              <div className="max-w-xl w-full mx-auto">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <FiSearch />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    className="grow"
                    placeholder="Search: “limits”, “2FA”, “refunds”…"
                  />
                </label>
                <div className="mt-3 text-xs opacity-70 text-center">
                  Tip: try keywords like <code>limits</code>, <code>2FA</code>,{" "}
                  <code>agents</code>, <code>FX</code>.
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 justify-center">
              <Link className="btn btn-primary btn-sm" to="/contact">
                Contact support
              </Link>
              <Link className="btn btn-outline btn-sm" to="/features">
                Explore features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick categories (clickable) */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {[
            {
              icon: <FiZap />,
              label: "Transfers",
              hint: "Speed, limits, cancel",
            },
            {
              icon: <FiShield />,
              label: "Security",
              hint: "2FA, fraud, privacy",
            },
            { icon: <FiUsers />, label: "Agents", hint: "Top-ups, approvals" },
            {
              icon: <FiGlobe />,
              label: "Regions & currency",
              hint: "FX, coverage",
            },
          ].map((c) => (
            <button
              key={c.label}
              onClick={() => goToSection(c.label)}
              className="rounded-xl border border-base-300/60 bg-base-100 px-4 py-3 shadow-sm flex items-center gap-3 text-left hover:shadow transition"
            >
              <span className="text-primary">{c.icon}</span>
              <div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs opacity-70">{c.hint}</div>
              </div>
            </button>
          ))}
        </motion.div>
      </section>

      {/* Results / Accordions */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Grouped by section when not searching */}
        {!query ? (
          <div className="space-y-10">
            {Object.entries(ALL_QA).map(([section, list], i) => (
              <motion.div
                key={section}
                id={sectionId(section)} // anchor for clickable tiles
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {section}
                </h2>
                <div className="grid gap-3">
                  {list.map((item, idx) => (
                    <AccordionItem
                      key={item.q}
                      q={item.q}
                      a={item.a}
                      defaultOpen={idx === 0}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm opacity-70">
              Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}{" "}
              for <span className="font-medium">“{query}”</span>
            </div>
            {filtered.length ? (
              <div className="grid gap-3">
                {filtered.map((item, idx) => (
                  <motion.div
                    key={`${item.section}-${item.q}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(idx * 0.03, 0.2),
                    }}
                  >
                    <AccordionItem q={item.q} a={item.a} />
                    <div className="mt-1 text-xs opacity-60">
                      Category:{" "}
                      <span className="font-medium">{item.section}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-base-300/60 bg-base-100 p-6 text-sm opacity-80">
                No exact matches. Try different keywords or{" "}
                <Link to="/contact" className="link">
                  contact support
                </Link>
                .
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom CTA — only two buttons as requested */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
                Still need help?
              </h3>
              <p className="mt-2 opacity-80">
                Our team responds quickly. Include a transaction ID if relevant
                for faster resolution.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn btn-primary" to="/contact">
                <FiPhoneCall className="mr-2" />
                Contact support
              </Link>
              <Link className="btn btn-outline" to="/features">
                Explore features
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

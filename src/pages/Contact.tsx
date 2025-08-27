import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiTwitter,
  FiFacebook,
  FiLinkedin,
  FiGithub,
  FiShield,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function Contact() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const topic = String(fd.get("topic") || "").trim();
    const message = String(fd.get("message") || "").trim();

    // Basic validation
    if (!name || !email || !topic || !message) {
      toast.error("Please fill out all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (message.length < 10) {
      toast.error("Message should be at least 10 characters.");
      return;
    }

    setIsSending(true);
    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      toast.success("Thanks! Your message has been sent.");
      formRef.current?.reset();
    }, 700);
  };

  return (
    <div className="min-h-[80vh]">
      {/* Mini-hero */}
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
              Contact <span className="text-primary">Support</span>
            </h1>
            <p className="mt-3 opacity-80">
              Have a question about transfers, limits, or security? Send us a
              message—our team is quick to help.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link className="btn btn-outline btn-sm" to="/faq">
                Browse FAQs
              </Link>
              <Link className="btn btn-primary btn-sm" to="/features">
                Explore Features
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT: Contact form (now left, spans 2 cols) */}
          <motion.div
            className="lg:col-span-2 order-1"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card bg-base-100 border border-base-300/60 shadow">
              <div className="card-body">
                <h3 className="card-title">Send us a message</h3>
                <p className="opacity-80 text-sm">
                  Fill out the form and our team will get back shortly. Include
                  a transaction ID if applicable for faster help.
                </p>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="mt-5 grid gap-5"
                >
                  {/* Row 1: Name / Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Your name</span>
                      </div>
                      <input
                        name="name"
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Jane Doe"
                        required
                      />
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Email</span>
                      </div>
                      <input
                        name="email"
                        type="email"
                        className="input input-bordered w-full"
                        placeholder="you@example.com"
                        required
                      />
                    </label>
                  </div>

                  {/* Row 2: Topic / Tx ID */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Topic</span>
                      </div>
                      <select
                        name="topic"
                        className="select select-bordered w-full"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Choose a topic
                        </option>
                        <option value="Account">Account</option>
                        <option value="Transfers">Transfers</option>
                        <option value="Security">Security</option>
                        <option value="Agent onboarding">
                          Agent onboarding
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">
                          Transaction ID (optional)
                        </span>
                      </div>
                      <input
                        name="txid"
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="e.g., TXN-8342A9"
                      />
                    </label>
                  </div>

                  {/* Row 3: Message */}
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Message</span>
                    </div>
                    <textarea
                      name="message"
                      className="textarea textarea-bordered w-full min-h-[140px]"
                      placeholder="How can we help?"
                      required
                    />
                  </label>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs opacity-70">
                      By submitting, you agree to our{" "}
                      <a href="#" className="link">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="link">
                        Privacy Policy
                      </a>
                      .
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-primary ${
                        isSending ? "btn-disabled" : ""
                      }`}
                      disabled={isSending}
                    >
                      {isSending ? (
                        <>
                          <span className="loading loading-spinner loading-xs mr-2" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <FiSend className="mr-2" />
                          Send message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Support info & socials */}
          <motion.div
            className="order-2"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card bg-base-100 border border-base-300/60 shadow">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 grid place-items-center">
                    <FiShield className="text-primary" />
                  </div>
                  <h3 className="card-title">We’re here to help</h3>
                </div>
                <p className="opacity-80 text-sm">
                  24/7 monitoring. Typical response time during business hours
                  (Mon–Fri, 9am–6pm CT): under 2 hours.
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <FiMail className="mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Email</div>
                      <a
                        className="link"
                        href="mailto:support@digitalwallet.example"
                      >
                        support@digitalwallet.example
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiPhone className="mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <a className="link" href="tel:+15551234567">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiClock className="mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Hours</div>
                      Mon–Fri, 9:00–18:00 (CT)
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="mt-0.5 text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      Dallas–Fort Worth, TX
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div className="mt-5">
                  <div className="text-sm font-medium mb-2">Follow us</div>
                  <div className="flex gap-4 text-xl">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                      aria-label="Twitter"
                    >
                      <FiTwitter />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                      aria-label="Facebook"
                    >
                      <FiFacebook />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                      aria-label="GitHub"
                    >
                      <FiGithub />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

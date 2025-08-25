import { useState } from "react";
import { z } from "zod";
import { toast } from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const err = parsed.error.flatten();
      const first =
        err.fieldErrors.name?.[0] ||
        err.fieldErrors.email?.[0] ||
        err.fieldErrors.message?.[0];
      toast.error(first || "Please fix the form");
      return;
    }

    try {
      setLoading(true);
      // simulate network call
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Thanks! We’ll be in touch.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-3 py-10 max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="name"
          className="input input-bordered w-full"
          placeholder="Your name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          className="input input-bordered w-full"
          placeholder="Your email"
          value={form.email}
          onChange={onChange}
          required
        />
        <textarea
          name="message"
          className="textarea textarea-bordered w-full min-h-[140px]"
          placeholder="How can we help?"
          value={form.message}
          onChange={onChange}
          required
        />
        <button
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

const QA = [
  {
    q: "Is my money safe?",
    a: "Yes. Authentication uses JWT and all wallet actions are guarded and validated with server-side checks.",
  },
  {
    q: "Can I send money by email or phone?",
    a: "Yes. Recipient lookup supports username, email, or phone — just type any of them in Send Money.",
  },
  {
    q: "What roles are supported?",
    a: "User, Agent, and Admin — each has a dedicated dashboard and permissions.",
  },
  {
    q: "Do I get filters and pagination?",
    a: "Yes. Transactions and admin lists include multiple filters with pagination for large datasets.",
  },
  {
    q: "Is the UI responsive and accessible?",
    a: "The layout is responsive (Tailwind + DaisyUI) and aims to meet common accessibility best practices.",
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-3 py-10">
      <h1 className="text-3xl font-semibold mb-6">FAQ</h1>

      <div className="join join-vertical w-full">
        {QA.map((item, idx) => (
          <div
            key={idx}
            className="collapse collapse-arrow join-item border border-base-300 bg-base-100"
          >
            <input type="checkbox" />
            <div className="collapse-title text-lg font-medium">{item.q}</div>
            <div className="collapse-content opacity-80">
              <p>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

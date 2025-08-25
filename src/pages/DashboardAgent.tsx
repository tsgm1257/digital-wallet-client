import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCashInMutation, useCashOutMutation, useGetMyTransactionsQuery } from "../redux/api/txnApi";
import { useLazyLookupUserQuery } from "../redux/api/profileApi";
import Pagination from "../components/Pagination";

/**
 * NOTE on username vs email/phone:
 * Backend cash-in/out expects a "username" (not email/phone).
 * We accept username/email/phone from the agent, then call /users/lookup
 * and pass the found user's username to the cash-in/out mutation.
 */

export default function DashboardAgent() {
  // Filters for handled transactions
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [type, setType] = useState<"" | "deposit" | "withdraw" | "send">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: txns, isLoading: txLoading, refetch } = useGetMyTransactionsQuery({
    page, limit, type: type || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined,
  });

  // Forms state
  const [recipient, setRecipient] = useState("");
  const [amountIn, setAmountIn] = useState<number | "">("");
  const [amountOut, setAmountOut] = useState<number | "">("");

  const [cashIn, { isLoading: cashInLoading }] = useCashInMutation();
  const [cashOut, { isLoading: cashOutLoading }] = useCashOutMutation();
  const [lookupTrigger] = useLazyLookupUserQuery();

  const handleCash = async (mode: "in" | "out") => {
    try {
      if (!recipient.trim()) return toast.error("Enter a username/email/phone");
      const user = await lookupTrigger({ q: recipient.trim() }).unwrap();
      if (!user?.username) return toast.error("User not found");
      const amt = mode === "in" ? Number(amountIn) : Number(amountOut);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");

      if (mode === "in") {
        await cashIn({ username: user.username, amount: amt }).unwrap();
        toast.success("Cash-in successful");
        setAmountIn("");
      } else {
        await cashOut({ username: user.username, amount: amt }).unwrap();
        toast.success("Cash-out successful");
        setAmountOut("");
      }
      setRecipient("");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      {/* Quick actions */}
      <div id="stats-cards" className="grid gap-4 md:grid-cols-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-3">
            <h3 className="card-title">Cash In (to User)</h3>
            <input
              className="input input-bordered"
              placeholder="User (username / email / phone)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              className="input input-bordered"
              placeholder="Amount"
              type="number"
              min={0}
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <button
              onClick={() => handleCash("in")}
              className={`btn btn-primary ${cashInLoading ? "loading" : ""}`}
              disabled={cashInLoading}
            >
              {cashInLoading ? "Processing..." : "Add Money"}
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-3">
            <h3 className="card-title">Cash Out (from User)</h3>
            <input
              className="input input-bordered"
              placeholder="User (username / email / phone)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              className="input input-bordered"
              placeholder="Amount"
              type="number"
              min={0}
              value={amountOut}
              onChange={(e) => setAmountOut(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <button
              onClick={() => handleCash("out")}
              className={`btn btn-secondary ${cashOutLoading ? "loading" : ""}`}
              disabled={cashOutLoading}
            >
              {cashOutLoading ? "Processing..." : "Withdraw Money"}
            </button>
          </div>
        </div>
      </div>

      {/* Activity table */}
      <div id="chart-area" className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Handled Transactions</h3>

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <select className="select select-bordered" value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="">All Types</option>
              <option value="deposit">Deposit (cash-in)</option>
              <option value="withdraw">Withdraw (cash-out)</option>
              <option value="send">Send</option>
            </select>
            <input
              type="date"
              className="input input-bordered"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <input
              type="date"
              className="input input-bordered"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <button className="btn" onClick={() => setPage(1)}>Apply</button>
          </div>

          {txLoading ? (
            <div className="space-y-2">
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-full" />
              <div className="skeleton h-6 w-full" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns?.data?.map((t) => (
                      <tr key={t._id}>
                        <td className="capitalize">{t.type}</td>
                        <td>${t.amount.toFixed(2)}</td>
                        <td>{t.sender?.username || "-"}</td>
                        <td>{t.receiver?.username || "-"}</td>
                        <td className="capitalize">{t.status}</td>
                        <td>{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                page={page}
                limit={limit}
                total={txns?.total || 0}
                onPage={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

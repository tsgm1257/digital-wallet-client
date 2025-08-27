import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetMyTransactionsQuery,
  useCashInMutation,
  useCashOutMutation,
  type TxType,
} from "../redux/api/txnApi";
import { useLazyLookupUserQuery } from "../redux/api/profileApi";
import Pagination from "../components/Pagination";
import AreaVolumeChart from "../components/charts/AreaVolumeChart";
import PieTypeChart from "../components/charts/PieTypeChart";
import { buildDailySeries, daysAgoISO, sumByType } from "../utils/txAgg";

export default function DashboardAgent() {
  // ===== Table filters =====
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [type, setType] = useState<"" | TxType>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const {
    data: txns,
    isLoading: txLoading,
    refetch: refetchTxns,
  } = useGetMyTransactionsQuery({
    page,
    limit,
    type: (type || undefined) as TxType | undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  // ===== Charts (last 30 days) =====
  const { data: txnsForChart, isLoading: chartLoading } =
    useGetMyTransactionsQuery({
      page: 1,
      limit: 1000,
      dateFrom: daysAgoISO(30),
    });

  const daily = useMemo(
    () => buildDailySeries(txnsForChart?.data, 30),
    [txnsForChart?.data]
  );
  const byType = useMemo(
    () => sumByType(txnsForChart?.data),
    [txnsForChart?.data]
  );
  const pieData = useMemo(
    () => [
      { name: "Deposit (cash-in)", value: byType.deposit },
      { name: "Withdraw (cash-out)", value: byType.withdraw },
      { name: "Send", value: byType.send },
    ],
    [byType]
  );

  // ===== Mutations: cash-in/out =====
  const [cashIn, { isLoading: cashInLoading }] = useCashInMutation();
  const [cashOut, { isLoading: cashOutLoading }] = useCashOutMutation();
  const [lookupTrigger] = useLazyLookupUserQuery();

  // Forms state
  const [recipient, setRecipient] = useState("");
  const [amountIn, setAmountIn] = useState<number | "">("");
  const [amountOut, setAmountOut] = useState<number | "">("");

  const handleCash = async (mode: "in" | "out") => {
    try {
      if (!recipient.trim()) return toast.error("Enter a username/email/phone");
      const amt = mode === "in" ? Number(amountIn) : Number(amountOut);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");

      const user = await lookupTrigger({ q: recipient.trim() }).unwrap();
      if (!user?.username) return toast.error("User not found");

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
      refetchTxns();
    } catch (e: any) {
      toast.error(e?.data?.message || "Operation failed");
    }
  };

  // ===== Local quick search =====
  const [q, setQ] = useState("");
  const filteredRows = useMemo(() => {
    const rows = txns?.data || [];
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((t) => {
      const sender = String(t.sender?.username || "").toLowerCase();
      const receiver = String(t.receiver?.username || "").toLowerCase();
      return (
        sender.includes(qq) ||
        receiver.includes(qq) ||
        String(t.type).toLowerCase().includes(qq)
      );
    });
  }, [txns?.data, q]);

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      {/* ===== Quick actions ===== */}
      <div
        id="stats-cards"
        data-tour="balance-card-agent"
        className="grid gap-4 md:grid-cols-2"
      >
        <div
          data-tour="process-cashout-form"
          className="card bg-base-100 shadow"
        >
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
              onChange={(e) =>
                setAmountIn(e.target.value === "" ? "" : Number(e.target.value))
              }
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
              onChange={(e) =>
                setAmountOut(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
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

      {/* ===== Charts ===== */}
      <div
        id="chart-area"
        data-tour="charts-agent"
        className="card bg-base-100 shadow"
      >
        <div className="card-body">
          <h3 className="card-title">Agent Activity (Last 30 days)</h3>
          {chartLoading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <>
              <AreaVolumeChart data={daily} />
              <div className="divider" />
              <PieTypeChart data={pieData} />
            </>
          )}
        </div>
      </div>

      {/* ===== Transactions history ===== */}
      <div
        data-tour="recent-tx-table-agent"
        className="card bg-base-100 shadow"
      >
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Handled Transactions</h3>
            <input
              id="table-search" // tour anchor
              className="input input-bordered"
              placeholder="Quick search (sender/receiver/type)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-5 gap-3 mb-4">
            <select
              className="select select-bordered"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
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
            <button className="btn" onClick={() => setPage(1)}>
              Apply
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setType("");
                setDateFrom("");
                setDateTo("");
                setQ("");
                setPage(1);
              }}
            >
              Reset
            </button>
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
                    {(filteredRows || []).map((t) => (
                      <tr key={t._id}>
                        <td className="capitalize">{t.type}</td>
                        <td>${Number(t.amount).toFixed(2)}</td>
                        <td>{t.sender?.username || "-"}</td>
                        <td>{t.receiver?.username || "-"}</td>
                        <td className="capitalize">{t.status}</td>
                        <td>
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleString()
                            : "-"}
                        </td>
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

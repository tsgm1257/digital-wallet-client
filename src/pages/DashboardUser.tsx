import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  useGetMyWalletQuery,
  useAddMoneyMutation,
  useWithdrawMoneyMutation,
} from "../redux/api/walletApi";
import {
  useGetMyTransactionsQuery,
  useSendMoneyMutation,
  type TxType,
} from "../redux/api/txnApi";
import AreaVolumeChart from "../components/charts/AreaVolumeChart";
import PieTypeChart from "../components/charts/PieTypeChart";
import { buildDailySeries, daysAgoISO, sumByType } from "../utils/txAgg";
import Pagination from "../components/Pagination";

export default function DashboardUser() {
  // ===== Queries =====
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useGetMyWalletQuery();

  // Table filters
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

  // Charts query (grab last 30 days)
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
      { name: "Deposit", value: byType.deposit },
      { name: "Withdraw", value: byType.withdraw },
      { name: "Send", value: byType.send },
    ],
    [byType]
  );

  // ===== Mutations: quick actions =====
  const [sendMoney, { isLoading: sending }] = useSendMoneyMutation();
  const [addMoney, { isLoading: adding }] = useAddMoneyMutation();
  const [withdrawMoney, { isLoading: withdrawing }] =
    useWithdrawMoneyMutation();

  // Forms state
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState<number | "">("");
  const [addAmount, setAddAmount] = useState<number | "">("");
  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");

  const onSend = async () => {
    try {
      if (!recipient.trim()) return toast.error("Enter username/email/phone");
      const amt = Number(sendAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await sendMoney({ recipient: recipient.trim(), amount: amt }).unwrap();
      toast.success("Money sent");
      setRecipient("");
      setSendAmount("");
      refetchWallet();
      refetchTxns();
    } catch (e: any) {
      toast.error(e?.data?.message || "Send failed");
    }
  };

  const onAdd = async () => {
    try {
      const amt = Number(addAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await addMoney({ amount: amt }).unwrap();
      toast.success("Deposited");
      setAddAmount("");
      refetchWallet();
      refetchTxns();
    } catch (e: any) {
      toast.error(e?.data?.message || "Deposit failed");
    }
  };

  const onWithdraw = async () => {
    try {
      const amt = Number(withdrawAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await withdrawMoney({ amount: amt }).unwrap();
      toast.success("Withdrawn");
      setWithdrawAmount("");
      refetchWallet();
      refetchTxns();
    } catch (e: any) {
      toast.error(e?.data?.message || "Withdraw failed");
    }
  };

  // Local quick filter for current page (for demo/tour). It filters only the loaded page.
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
      {/* ===== Stats cards ===== */}
      <div id="stats-cards" className="grid gap-4 md:grid-cols-3">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Wallet Balance</h3>
            {walletLoading ? (
              <div className="skeleton h-8 w-32" />
            ) : (
              <p className="text-3xl font-bold">
                ${wallet?.balance?.toFixed(2) ?? "0.00"}
              </p>
            )}
            <span className="text-sm opacity-70">
              Current available balance
            </span>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-3">
            <h3 className="card-title">Quick Send</h3>
            <input
              className="input input-bordered w-full"
              placeholder="Recipient (username / email / phone)"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <input
              className="input input-bordered w-full"
              placeholder="Amount"
              type="number"
              min={0}
              value={sendAmount}
              onChange={(e) =>
                setSendAmount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
            <button
              className={`btn btn-primary w-full ${sending ? "loading" : ""}`}
              disabled={sending}
              onClick={onSend}
            >
              {sending ? "Sending..." : "Send Money"}
            </button>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body space-y-3">
            <h3 className="card-title">Deposit / Withdraw</h3>
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Deposit amount"
                type="number"
                min={0}
                value={addAmount}
                onChange={(e) =>
                  setAddAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <button
                className={`btn btn-outline ${adding ? "loading" : ""}`}
                disabled={adding}
                onClick={onAdd}
              >
                {adding ? "..." : "Deposit"}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Withdraw amount"
                type="number"
                min={0}
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <button
                className={`btn btn-outline btn-secondary ${
                  withdrawing ? "loading" : ""
                }`}
                disabled={withdrawing}
                onClick={onWithdraw}
              >
                {withdrawing ? "..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <div id="chart-area" className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Activity (Last 30 days)</h3>
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

      {/* ===== Transaction history ===== */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Recent Transactions</h3>
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
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
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

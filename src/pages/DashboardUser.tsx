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

/* ------------------------------ Types ---------------------------------- */
interface Wallet {
  balance?: number;
}

interface UserLite {
  username?: string;
}

interface TxRow {
  _id: string;
  type: TxType; // "send" | "withdraw" | "deposit"
  amount: number;
  sender?: UserLite;
  receiver?: UserLite;
  status: "completed" | "failed" | string;
  createdAt?: string;
}

interface Paged<T> {
  data: T[];
  total: number;
}

type NumOrEmpty = number | "";

/* --------------------------- Utilities --------------------------------- */
const toNumberOr = (v: NumOrEmpty, fallback = 0): number =>
  typeof v === "number" ? v : fallback;

const getErrorMessage = (err: unknown): string => {
  const apiMsg =
    (err as { data?: { message?: string } })?.data?.message ??
    (err as { message?: string })?.message;
  return apiMsg || "Operation failed";
};

/* ---------------------------- Component -------------------------------- */
export default function DashboardUser() {
  // ===== Queries =====
  const {
    data: wallet,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useGetMyWalletQuery(undefined, { refetchOnMountOrArgChange: true });

  // Table filters
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [type, setType] = useState<"" | TxType>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

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
    () =>
      buildDailySeries((txnsForChart as Paged<TxRow> | undefined)?.data, 30),
    [txnsForChart]
  );

  const byType = useMemo(
    () => sumByType((txnsForChart as Paged<TxRow> | undefined)?.data),
    [txnsForChart]
  );

  const pieData = useMemo(
    () => [
      { name: "Deposit", value: byType.deposit ?? 0 },
      { name: "Withdraw", value: byType.withdraw ?? 0 },
      { name: "Send", value: byType.send ?? 0 },
    ],
    [byType]
  );

  // ===== Mutations: quick actions =====
  const [sendMoney, { isLoading: sending }] = useSendMoneyMutation();
  const [addMoney, { isLoading: adding }] = useAddMoneyMutation();
  const [withdrawMoney, { isLoading: withdrawing }] =
    useWithdrawMoneyMutation();

  // Forms state
  const [recipient, setRecipient] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<NumOrEmpty>("");
  const [addAmount, setAddAmount] = useState<NumOrEmpty>("");
  const [withdrawAmount, setWithdrawAmount] = useState<NumOrEmpty>("");

  const onSend = async () => {
    try {
      if (!recipient.trim()) return toast.error("Enter username/email/phone");
      const amt = toNumberOr(sendAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await sendMoney({ recipient: recipient.trim(), amount: amt }).unwrap();
      toast.success("Money sent");
      setRecipient("");
      setSendAmount("");
      refetchWallet();
      refetchTxns();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const onAdd = async () => {
    try {
      const amt = toNumberOr(addAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await addMoney({ amount: amt }).unwrap();
      toast.success("Deposited");
      setAddAmount("");
      refetchWallet();
      refetchTxns();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  const onWithdraw = async () => {
    try {
      const amt = toNumberOr(withdrawAmount);
      if (!amt || amt <= 0) return toast.error("Enter a valid amount");
      await withdrawMoney({ amount: amt }).unwrap();
      toast.success("Withdrawn");
      setWithdrawAmount("");
      refetchWallet();
      refetchTxns();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    }
  };

  // Local quick filter for current page (filters only the loaded page)
  const [q, setQ] = useState<string>("");
  const filteredRows = useMemo(() => {
    const rows = (txns as Paged<TxRow> | undefined)?.data ?? [];
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
  }, [txns, q]);

  const totalTx = (txns as Paged<TxRow> | undefined)?.total ?? 0;

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      {/* ===== Stats & Quick Actions ===== */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Balance */}
        <section
          data-tour="balance-card"
          className="card bg-base-100 shadow border border-base-200"
        >
          <div className="card-body">
            <h3 className="card-title">Wallet Balance</h3>
            {walletLoading ? (
              <div className="skeleton h-8 w-32" />
            ) : (
              <p className="text-3xl font-bold">
                ${((wallet as Wallet | undefined)?.balance ?? 0).toFixed(2)}
              </p>
            )}
            <span className="text-sm opacity-70">
              Current available balance
            </span>
          </div>
        </section>

        {/* Quick Send */}
        <section
          data-tour="send-money-form"
          className="card bg-base-100 shadow border border-base-200"
        >
          <div className="card-body space-y-3">
            <h3 className="card-title">Quick Send</h3>
            <input
              className="input input-bordered w-full"
              placeholder="Recipient (username / email / phone)"
              value={recipient}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRecipient(e.target.value)
              }
            />
            <input
              className="input input-bordered w-full"
              placeholder="Amount"
              type="number"
              min={0}
              value={sendAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
        </section>

        {/* Deposit / Withdraw */}
        <section
          data-tour="add-money-form"
          className="card bg-base-100 shadow border border-base-200"
        >
          <div className="card-body space-y-3">
            <h3 className="card-title">Deposit / Withdraw</h3>
            <div className="flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Deposit amount"
                type="number"
                min={0}
                value={addAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
        </section>
      </div>

      {/* ===== Charts ===== */}
      <section
        id="chart-area"
        data-tour="charts"
        className="card bg-base-100 shadow"
      >
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
      </section>

      {/* ===== Transaction history ===== */}
      <section data-tour="recent-tx-table" className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">Recent Transactions</h3>
            <input
              id="table-search" // tour anchor if you want to mention quick search
              className="input input-bordered"
              placeholder="Quick search (sender/receiver/type)"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQ(e.target.value)
              }
            />
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-5 gap-3 mb-4">
            <select
              className="select select-bordered"
              value={type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setType(e.target.value as "" | TxType)
              }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateFrom(e.target.value)
              }
            />
            <input
              type="date"
              className="input input-bordered"
              value={dateTo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateTo(e.target.value)
              }
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
                    {(filteredRows as TxRow[]).map((t) => (
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
                total={totalTx}
                onPage={(p: number) => setPage(p)}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}

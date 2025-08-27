import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Pagination from "../components/Pagination";
import {
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetWalletsQuery,
  useGetAllTransactionsAdminQuery,
  useSetWalletBlockedMutation,
  useUpdateAgentApprovalMutation,
} from "../redux/api/adminApi";
import AreaVolumeChart from "../components/charts/AreaVolumeChart";
import PieTypeChart from "../components/charts/PieTypeChart";
import { buildDailySeries, daysAgoISO } from "../utils/txAgg";

/* ------------------------------ Types ---------------------------------- */
type Role = "user" | "agent" | "admin";
type BoolStr = "" | "true" | "false";
type TabKey = "users" | "wallets" | "transactions";

interface AdminStats {
  users: {
    totalUsers: number;
    totalAgents: number;
    approvedAgents: number;
    pendingAgents: number;
  };
  transactions: {
    total: number;
    totalVolume: number;
    byType?: Partial<Record<"deposit" | "withdraw" | "send", number>>;
    byStatus?: Partial<Record<"completed" | "failed", number>>;
  };
}

interface UserRow {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  role: Role;
  isApproved?: boolean;
}

interface WalletRow {
  _id: string;
  user?: UserRow;
  balance: number;
  isBlocked: boolean;
}

interface TxRow {
  _id: string;
  type: "send" | "withdraw" | "deposit";
  amount: number;
  sender?: UserRow;
  receiver?: UserRow;
  status: "completed" | "failed";
  createdAt?: string;
}

/* -------------------------- Helpers ------------------------------------ */
const getErrorMessage = (err: unknown): string => {
  const apiMsg =
    (err as { data?: { message?: string } })?.data?.message ??
    (err as { message?: string })?.message;
  return apiMsg || "Operation failed";
};

/* -------------------------- Component ---------------------------------- */
export default function DashboardAdmin() {
  const [tab, setTab] = useState<TabKey>("users");

  // ===== KPI cards =====
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetAdminStatsQuery(undefined, { refetchOnMountOrArgChange: true });

  // ===== USERS tab state & query =====
  const [uPage, setUPage] = useState<number>(1);
  const [uLimit] = useState<number>(10);
  const [uRole, setURole] = useState<"" | Role>("");
  const [uApproved, setUApproved] = useState<BoolStr>("");
  const [uSearch, setUSearch] = useState<string>("");

  const usersQuery = useGetUsersQuery({
    page: uPage,
    limit: uLimit,
    role: uRole || undefined,
    approved: uApproved ? uApproved === "true" : undefined,
    search: uSearch || undefined,
  });

  // ===== WALLETS tab state & query =====
  const [wPage, setWPage] = useState<number>(1);
  const [wLimit] = useState<number>(10);
  const [wBlocked, setWBlocked] = useState<BoolStr>("");
  const [wRole, setWRole] = useState<"" | Role>("");
  const [wApproved, setWApproved] = useState<BoolStr>("");
  const [wMin, setWMin] = useState<string>("");
  const [wMax, setWMax] = useState<string>("");
  const [wSearch, setWSearch] = useState<string>("");

  const walletsQuery = useGetWalletsQuery({
    page: wPage,
    limit: wLimit,
    blocked: wBlocked ? wBlocked === "true" : undefined,
    role: wRole || undefined,
    approved: wApproved ? wApproved === "true" : undefined,
    minBalance: wMin ? Number(wMin) : undefined,
    maxBalance: wMax ? Number(wMax) : undefined,
    search: wSearch || undefined,
  });

  // ===== TRANSACTIONS tab state & query =====
  const [tPage, setTPage] = useState<number>(1);
  const [tLimit] = useState<number>(10);
  const [tType, setTType] = useState<"" | TxRow["type"]>("");
  const [tStatus, setTStatus] = useState<"" | "completed" | "failed">("");
  const [tFrom, setTFrom] = useState<string>("");
  const [tTo, setTTo] = useState<string>("");
  const [tUserId, setTUserId] = useState<string>("");
  const [tMin, setTMin] = useState<string>("");
  const [tMax, setTMax] = useState<string>("");

  const txQuery = useGetAllTransactionsAdminQuery({
    page: tPage,
    limit: tLimit,
    type: tType || undefined,
    status: tStatus || undefined,
    dateFrom: tFrom || undefined,
    dateTo: tTo || undefined,
    userId: tUserId || undefined,
    minAmount: tMin ? Number(tMin) : undefined,
    maxAmount: tMax ? Number(tMax) : undefined,
  });

  // ===== Mutations =====
  const [setWalletBlocked] = useSetWalletBlockedMutation();
  const [updateAgentApproval] = useUpdateAgentApprovalMutation();

  const refreshAll = () => {
    usersQuery.refetch();
    walletsQuery.refetch();
    txQuery.refetch();
    refetchStats();
  };

  // ===== Charts for Admin (last 30 days) =====
  const txChartQuery = useGetAllTransactionsAdminQuery({
    page: 1,
    limit: 1000,
    dateFrom: daysAgoISO(30),
  });
  const dailySeries = useMemo(
    () => buildDailySeries(txChartQuery.data?.data as TxRow[] | undefined, 30),
    [txChartQuery.data?.data]
  );

  const pieTypeData = useMemo(() => {
    const t = (stats as AdminStats | undefined)?.transactions?.byType ?? {};
    return [
      { name: "Deposit", value: t.deposit ?? 0 },
      { name: "Withdraw", value: t.withdraw ?? 0 },
      { name: "Send", value: t.send ?? 0 },
    ];
  }, [stats]);

  const pieStatusData = useMemo(() => {
    const s = (stats as AdminStats | undefined)?.transactions?.byStatus ?? {};
    return [
      { name: "Completed", value: s.completed ?? 0 },
      { name: "Failed", value: s.failed ?? 0 },
    ];
  }, [stats]);

  // keep tab when switching
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_tab");
    if (saved === "users" || saved === "wallets" || saved === "transactions") {
      setTab(saved);
    }
  }, []);
  useEffect(() => {
    sessionStorage.setItem("admin_tab", tab);
  }, [tab]);

  // Typed snapshots for mapping
  const users: UserRow[] = (usersQuery.data?.data ?? []) as UserRow[];
  const usersTotal = usersQuery.data?.total ?? 0;

  const wallets: WalletRow[] = (walletsQuery.data?.data ?? []) as WalletRow[];
  const walletsTotal = walletsQuery.data?.total ?? 0;

  const txs: TxRow[] = (txQuery.data?.data ?? []) as TxRow[];
  const txTotal = txQuery.data?.total ?? 0;

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      {/* ===== KPI Cards ===== */}
      <div
        id="stats-cards"
        data-tour="balance-card-admin"
        className="grid gap-4 md:grid-cols-3"
      >
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Users</h3>
            {statsLoading ? (
              <div className="skeleton h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">
                {(stats as AdminStats | undefined)?.users.totalUsers ?? 0}
              </p>
            )}
            <span className="text-sm opacity-70">Total Users</span>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Agents</h3>
            {statsLoading ? (
              <div className="skeleton h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">
                {(stats as AdminStats | undefined)?.users.totalAgents ?? 0}
              </p>
            )}
            <span className="text-sm opacity-70">
              Approved{" "}
              {(stats as AdminStats | undefined)?.users.approvedAgents ?? 0} /
              Pending{" "}
              {(stats as AdminStats | undefined)?.users.pendingAgents ?? 0}
            </span>
          </div>
        </div>
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Txn Volume</h3>
            {statsLoading ? (
              <div className="skeleton h-8 w-24" />
            ) : (
              <p className="text-3xl font-bold">
                $
                {(
                  (stats as AdminStats | undefined)?.transactions.totalVolume ??
                  0
                ).toFixed(2)}
              </p>
            )}
            <span className="text-sm opacity-70">
              Across{" "}
              {(stats as AdminStats | undefined)?.transactions.total ?? 0}{" "}
              transactions
            </span>
          </div>
        </div>
      </div>

      {/* ===== Charts ===== */}
      <section
        id="chart-area"
        data-tour="charts-admin"
        className="card bg-base-100 shadow"
      >
        <div className="card-body">
          <h3 className="card-title">Transactions Overview (Last 30 days)</h3>
          {txChartQuery.isLoading ? (
            <div className="skeleton h-64 w-full" />
          ) : (
            <AreaVolumeChart data={dailySeries} />
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-semibold">By Type</h4>
                {statsLoading ? (
                  <div className="skeleton h-64 w-full" />
                ) : (
                  <PieTypeChart data={pieTypeData} />
                )}
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <h4 className="font-semibold">By Status</h4>
                {statsLoading ? (
                  <div className="skeleton h-64 w-full" />
                ) : (
                  <PieTypeChart data={pieStatusData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Tabs ===== */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${tab === "users" ? "tab-active" : ""}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
        <button
          className={`tab ${tab === "wallets" ? "tab-active" : ""}`}
          onClick={() => setTab("wallets")}
        >
          Wallets
        </button>
        <button
          className={`tab ${tab === "transactions" ? "tab-active" : ""}`}
          onClick={() => setTab("transactions")}
        >
          Transactions
        </button>
      </div>

      {/* ===== USERS ===== */}
      {tab === "users" && (
        <section className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Users</h3>

            <div className="grid md:grid-cols-5 gap-3 mb-4">
              <select
                className="select select-bordered"
                value={uRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setURole(e.target.value as "" | Role)
                }
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
              <select
                className="select select-bordered"
                value={uApproved}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setUApproved(e.target.value as BoolStr)
                }
              >
                <option value="">Approval (any)</option>
                <option value="true">Approved</option>
                <option value="false">Pending/Suspended</option>
              </select>
              <input
                id="table-search" // tour anchor (if needed)
                className="input input-bordered"
                placeholder="Search username/email/phone"
                value={uSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUSearch(e.target.value)
                }
              />
              <button className="btn" onClick={() => setUPage(1)}>
                Apply
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setURole("");
                  setUApproved("");
                  setUSearch("");
                  setUPage(1);
                }}
              >
                Reset
              </button>
            </div>

            {usersQuery.isLoading ? (
              <div className="skeleton h-6 w-full" />
            ) : (
              <>
                <div data-tour="manage-users-table" className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Approved</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.username}</td>
                          <td>{u.email || "-"}</td>
                          <td>{u.phone || "-"}</td>
                          <td className="capitalize">{u.role}</td>
                          <td>
                            {typeof u.isApproved === "boolean"
                              ? u.isApproved
                                ? "Yes"
                                : "No"
                              : "-"}
                          </td>
                          <td>
                            {u.role === "agent" && (
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-xs"
                                  onClick={async () => {
                                    try {
                                      await updateAgentApproval({
                                        userId: u._id,
                                        approve: true,
                                      }).unwrap();
                                      toast.success("Agent approved");
                                      refreshAll();
                                    } catch (err: unknown) {
                                      toast.error(getErrorMessage(err));
                                    }
                                  }}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-xs btn-outline"
                                  onClick={async () => {
                                    try {
                                      await updateAgentApproval({
                                        userId: u._id,
                                        approve: false,
                                      }).unwrap();
                                      toast.success("Agent suspended");
                                      refreshAll();
                                    } catch (err: unknown) {
                                      toast.error(getErrorMessage(err));
                                    }
                                  }}
                                >
                                  Suspend
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={uPage}
                  limit={uLimit}
                  total={usersTotal}
                  onPage={(p: number) => setUPage(p)}
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* ===== WALLETS ===== */}
      {tab === "wallets" && (
        <section className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Wallets</h3>

            <div className="grid md:grid-cols-7 gap-3 mb-4">
              <select
                className="select select-bordered"
                value={wBlocked}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setWBlocked(e.target.value as BoolStr)
                }
              >
                <option value="">Blocked (any)</option>
                <option value="true">Blocked</option>
                <option value="false">Active</option>
              </select>
              <select
                className="select select-bordered"
                value={wRole}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setWRole(e.target.value as "" | Role)
                }
              >
                <option value="">Role (any)</option>
                <option value="user">User</option>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
              <select
                className="select select-bordered"
                value={wApproved}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setWApproved(e.target.value as BoolStr)
                }
              >
                <option value="">Approval (any)</option>
                <option value="true">Approved</option>
                <option value="false">Pending/Suspended</option>
              </select>
              <input
                className="input input-bordered"
                placeholder="Min $"
                value={wMin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWMin(e.target.value)
                }
              />
              <input
                className="input input-bordered"
                placeholder="Max $"
                value={wMax}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWMax(e.target.value)
                }
              />
              <input
                className="input input-bordered"
                placeholder="Search username/email/phone"
                value={wSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setWSearch(e.target.value)
                }
              />
              <div className="flex gap-2">
                <button className="btn" onClick={() => setWPage(1)}>
                  Apply
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setWBlocked("");
                    setWRole("");
                    setWApproved("");
                    setWMin("");
                    setWMax("");
                    setWSearch("");
                    setWPage(1);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {walletsQuery.isLoading ? (
              <div className="skeleton h-6 w-full" />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Approved</th>
                        <th>Balance</th>
                        <th>Blocked</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map((w) => (
                        <tr key={w._id}>
                          <td>{w.user?.username}</td>
                          <td className="capitalize">{w.user?.role}</td>
                          <td>
                            {typeof w.user?.isApproved === "boolean"
                              ? w.user.isApproved
                                ? "Yes"
                                : "No"
                              : "-"}
                          </td>
                          <td>${Number(w.balance).toFixed(2)}</td>
                          <td>{w.isBlocked ? "Yes" : "No"}</td>
                          <td>
                            <button
                              className={`btn btn-xs ${
                                w.isBlocked ? "btn-success" : "btn-outline"
                              }`}
                              onClick={async () => {
                                try {
                                  await setWalletBlocked({
                                    walletId: w._id,
                                    block: !w.isBlocked,
                                  }).unwrap();
                                  toast.success(
                                    w.isBlocked
                                      ? "Wallet unblocked"
                                      : "Wallet blocked"
                                  );
                                  refreshAll();
                                } catch (err: unknown) {
                                  toast.error(getErrorMessage(err));
                                }
                              }}
                            >
                              {w.isBlocked ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  page={wPage}
                  limit={wLimit}
                  total={walletsTotal}
                  onPage={(p: number) => setWPage(p)}
                />
              </>
            )}
          </div>
        </section>
      )}

      {/* ===== TRANSACTIONS ===== */}
      {tab === "transactions" && (
        <section className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Transactions</h3>

            <div className="grid md:grid-cols-8 gap-3 mb-4">
              <select
                className="select select-bordered"
                value={tType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTType(e.target.value as "" | TxRow["type"])
                }
              >
                <option value="">Type (any)</option>
                <option value="send">Send</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
              </select>
              <select
                className="select select-bordered"
                value={tStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setTStatus(e.target.value as "" | "completed" | "failed")
                }
              >
                <option value="">Status (any)</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              <input
                type="date"
                className="input input-bordered"
                value={tFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTFrom(e.target.value)
                }
              />
              <input
                type="date"
                className="input input-bordered"
                value={tTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTTo(e.target.value)
                }
              />
              <input
                className="input input-bordered"
                placeholder="UserId (optional)"
                value={tUserId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTUserId(e.target.value)
                }
              />
              <input
                className="input input-bordered"
                placeholder="Min $"
                value={tMin}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTMin(e.target.value)
                }
              />
              <input
                className="input input-bordered"
                placeholder="Max $"
                value={tMax}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTMax(e.target.value)
                }
              />
              <div className="flex gap-2">
                <button className="btn" onClick={() => setTPage(1)}>
                  Apply
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setTType("");
                    setTStatus("");
                    setTFrom("");
                    setTTo("");
                    setTUserId("");
                    setTMin("");
                    setTMax("");
                    setTPage(1);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {txQuery.isLoading ? (
              <div className="skeleton h-6 w-full" />
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
                      {txs.map((t) => (
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
                  page={tPage}
                  limit={tLimit}
                  total={txTotal}
                  onPage={(p: number) => setTPage(p)}
                />
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

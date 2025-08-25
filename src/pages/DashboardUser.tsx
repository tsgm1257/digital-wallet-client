import { useGetMyWalletQuery } from "../redux/api/walletApi";
import { useGetMyTransactionsQuery } from "../redux/api/txnApi";

export default function DashboardUser() {
  const { data: wallet } = useGetMyWalletQuery();
  const { data: txns } = useGetMyTransactionsQuery({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto px-3 py-6 space-y-6">
      <div id="stats-cards" className="grid gap-4 md:grid-cols-3">
        <div id="chart-area" className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Wallet Balance</h3>
            <p className="text-3xl font-bold">${wallet?.balance?.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Recent Transactions</h3>
          <input
          id="table-search"
          className="input input-bordered"
          placeholder="Search or filter…"
        />
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {txns?.data?.map(t => (
                  <tr key={t._id}>
                    <td className="capitalize">{t.type}</td>
                    <td>${t.amount.toFixed(2)}</td>
                    <td className="capitalize">{t.status}</td>
                    <td>{new Date(t.createdAt!).toLocaleString()}</td>
                  </tr>
                )) || null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

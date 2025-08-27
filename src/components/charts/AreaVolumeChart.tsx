import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { SeriesRow } from "../../utils/txAgg";

const COLORS = {
  deposit: "#6366F1", // indigo (matches Pie)
  withdraw: "#22C55E", // green
  send: "#F59E0B", // amber
};

const fmtNum = (n: number) =>
  typeof n === "number" ? n.toLocaleString() : String(n ?? "");

const fmtDate = (iso: string) => {
  // Expecting YYYY-MM-DD
  if (!iso || iso.length < 10) return iso;
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export default function AreaVolumeChart({ data }: { data: SeriesRow[] }) {
  const safe = Array.isArray(data) ? data : [];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <AreaChart
          data={safe}
          margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradDeposit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.deposit} stopOpacity={0.75} />
              <stop
                offset="95%"
                stopColor={COLORS.deposit}
                stopOpacity={0.05}
              />
            </linearGradient>
            <linearGradient id="gradWithdraw" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={COLORS.withdraw}
                stopOpacity={0.75}
              />
              <stop
                offset="95%"
                stopColor={COLORS.withdraw}
                stopOpacity={0.05}
              />
            </linearGradient>
            <linearGradient id="gradSend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.send} stopOpacity={0.75} />
              <stop offset="95%" stopColor={COLORS.send} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            tick={{ fontSize: 12 }}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => fmtNum(Number(v))}
          />

          <Tooltip
            labelFormatter={(label) => `Date: ${fmtDate(String(label))}`}
            formatter={(value: any, name: any) => [
              fmtNum(Number(value)),
              String(name),
            ]}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Legend />

          {/* Stacked volumes with smooth curves + distinct colors */}
          <Area
            type="monotone"
            dataKey="deposit"
            name="Deposit"
            stackId="1"
            stroke={COLORS.deposit}
            fill="url(#gradDeposit)"
            strokeWidth={2}
            dot={{ r: 2 }}
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="withdraw"
            name="Withdraw"
            stackId="1"
            stroke={COLORS.withdraw}
            fill="url(#gradWithdraw)"
            strokeWidth={2}
            dot={{ r: 2 }}
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="send"
            name="Send"
            stackId="1"
            stroke={COLORS.send}
            fill="url(#gradSend)"
            strokeWidth={2}
            dot={{ r: 2 }}
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

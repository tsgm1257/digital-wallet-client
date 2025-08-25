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

export default function AreaVolumeChart({ data }: { data: SeriesRow[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="deposit" stackId="1" />
          <Area type="monotone" dataKey="withdraw" stackId="1" />
          <Area type="monotone" dataKey="send" stackId="1" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

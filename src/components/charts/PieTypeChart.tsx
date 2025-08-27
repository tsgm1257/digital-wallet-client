import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type Slice = { name: string; value: number };

const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#0EA5E9", // sky
  "#A855F7", // violet
  "#14B8A6", // teal
  "#F97316", // orange
  "#84CC16", // lime
  "#E11D48", // rose
];

// Stable name→color map so colors don’t “jump” when order changes
const NAME_COLOR: Record<string, string> = {
  deposit: COLORS[0],
  withdraw: COLORS[1],
  send: COLORS[2],
  refunded: COLORS[3],
  failed: COLORS[4],
};

const pickColor = (name: string, i: number) =>
  NAME_COLOR[name?.toLowerCase()] ?? COLORS[i % COLORS.length];

export default function PieTypeChart({ data }: { data: Slice[] }) {
  const safeData = Array.isArray(data)
    ? data.filter((d) => Number(d.value) > 0)
    : [];

  if (safeData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-sm opacity-70">
        No data to display
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={safeData}
            innerRadius="45%"
            outerRadius="75%"
            isAnimationActive
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {safeData.map((entry, i) => (
              <Cell
                key={`slice-${entry.name}-${i}`}
                fill={pickColor(entry.name, i)}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: any, name: any) => [val, String(name)]}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

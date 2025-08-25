import type { Transaction } from "../redux/api/txnApi";

const toKey = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
export const daysAgoISO = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export type SeriesRow = {
  date: string;
  send: number;
  withdraw: number;
  deposit: number;
  total: number;
};

export function buildDailySeries(
  txns: Transaction[] = [],
  days: number = 30
): SeriesRow[] {
  const map: Record<string, SeriesRow> = {};
  // initialize last N days
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = toKey(d);
    map[k] = { date: k, send: 0, withdraw: 0, deposit: 0, total: 0 };
  }

  for (const t of txns) {
    if (!t.createdAt) continue;
    const k = toKey(new Date(t.createdAt));
    if (!map[k]) continue; // outside range
    const amt = Number(t.amount) || 0;
    if (t.type === "send") map[k].send += amt;
    if (t.type === "withdraw") map[k].withdraw += amt;
    if (t.type === "deposit") map[k].deposit += amt;
    map[k].total += amt;
  }

  return Object.values(map);
}

export function sumByType(txns: Transaction[] = []) {
  return txns.reduce(
    (acc, t) => {
      const amt = Number(t.amount) || 0;
      if (t.type === "send") acc.send += amt;
      if (t.type === "withdraw") acc.withdraw += amt;
      if (t.type === "deposit") acc.deposit += amt;
      return acc;
    },
    { send: 0, withdraw: 0, deposit: 0 }
  );
}

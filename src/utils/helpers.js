import { CURRENCY } from '../theme';

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n) => String(n).padStart(2, '0');

// Indian digit grouping: 1,23,456
export function formatMoney(n) {
  const v = Math.round(Number(n) || 0);
  const s = Math.abs(v).toString();
  let last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  if (rest) last3 = ',' + last3;
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3;
  return (v < 0 ? '-' : '') + CURRENCY + grouped;
}

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const sameDay = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();
export const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

export function formatDMY(date) {
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
}

export function formatDate(date) {
  const d = new Date(date);
  return `${pad(d.getDate())} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(date) {
  const d = new Date(date);
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${pad(h)}:${pad(d.getMinutes())} ${ampm}`;
}

export function dayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return formatDate(d);
}

// Strict DD-MM-YYYY (or DD/MM/YYYY) parser. Returns Date or null.
export function parseDMY(str) {
  const m = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec((str || '').trim());
  if (!m) return null;
  const d = +m[1];
  const mo = +m[2] - 1;
  const y = +m[3];
  const dt = new Date(y, mo, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;
  return dt;
}

export function initials(name) {
  return (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

// ---------- Reports (daily / weekly / monthly / yearly) ----------
export function getBuckets(period, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const out = [];
  if (period === 'daily') {
    [['12-6 AM', 0, 6], ['6-12 AM', 6, 12], ['12-6 PM', 12, 18], ['6-12 PM', 18, 24]].forEach(([label, a, b]) =>
      out.push({ label, from: new Date(y, m, d, a), to: new Date(y, m, d, b) })
    );
  } else if (period === 'weekly') {
    for (let i = 6; i >= 0; i--) {
      const f = new Date(y, m, d - i);
      out.push({ label: DAY_SHORT[f.getDay()], from: f, to: new Date(y, m, d - i + 1) });
    }
  } else if (period === 'monthly') {
    const dim = new Date(y, m + 1, 0).getDate();
    [[1, 8], [8, 15], [15, 22], [22, dim + 1]].forEach(([a, b], i) =>
      out.push({ label: `Week ${i + 1}`, from: new Date(y, m, a), to: new Date(y, m, b) })
    );
  } else {
    for (let i = 0; i < 12; i++) {
      out.push({ label: MONTH_SHORT[i], from: new Date(y, i, 1), to: new Date(y, i + 1, 1) });
    }
  }
  return out;
}

const sumBy = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

export function buildReport(txs, period, now = new Date()) {
  const buckets = getBuckets(period, now);
  const from = buckets[0].from;
  const to = buckets[buckets.length - 1].to;
  const items = txs
    .filter((t) => {
      const dt = new Date(t.date);
      return dt >= from && dt < to;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const bars = buckets.map((b) => {
    const list = items.filter((t) => {
      const dt = new Date(t.date);
      return dt >= b.from && dt < b.to;
    });
    return { label: b.label, income: sumBy(list, 'income'), expense: sumBy(list, 'expense') };
  });
  const income = sumBy(items, 'income');
  const expense = sumBy(items, 'expense');
  return { income, expense, balance: income - expense, bars, items };
}

export function expenseByCategory(txs) {
  const map = {};
  txs
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export const totalOf = (txs, type) => sumBy(txs, type);

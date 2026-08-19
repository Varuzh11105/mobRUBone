const nf = new Intl.NumberFormat("ru-RU");

export const num = (n: number) => nf.format(Math.round(n));
export const money = (n: number) => `${nf.format(Math.round(n))} ₽`;

export function plural(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100;
  const d = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (d === 1) return one;
  if (d >= 2 && d <= 4) return few;
  return many;
}

export const pct = (raised: number, goal: number) =>
  goal <= 0 ? 0 : Math.min(100, Math.round((raised / goal) * 100));

export function timeAgo(ts: number) {
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  if (days <= 0) return "сегодня";
  if (days === 1) return "вчера";
  return `${days} ${plural(days, "день", "дня", "дней")} назад`;
}

export function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export const dayWord = (n: number) => plural(n, "день", "дня", "дней");

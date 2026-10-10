export const formatMa = (n) =>
  n <= 0.004 ? "Today" : n < 1 ? `${Math.round(n * 1e3)}k yrs ago` : `${n.toFixed(1)} Ma`;
export const formatRange = (n) => {
  let e = (t) => (t === 0 ? "present" : t < 1 ? `${Math.round(t * 1e3)}k` : `${t} Ma`);
  return n.end === 0 ? `${e(n.start)} → present` : `${e(n.start)} – ${e(n.end)}`;
};
export const maToY = (n) => 8.1 - (n <= 1 ? 4 * n : n <= 2 ? 4 + 2.6 * (n - 1) : 6.6 + 1.6 * (n - 2));
export const yToMa = (y) => {
  let v = 8.1 - y;
  return v <= 0 ? 0 : v <= 4 ? v / 4 : v <= 6.6 ? 1 + (v - 4) / 2.6 : 2 + (v - 6.6) / 1.6;
};
export const formatMaShort = (v) =>
  v <= 0.004 ? "Today" : v < 1 ? Math.round(v * 1e3) + " ka" : v.toFixed(1) + " Ma";

export function clamp(n, mn, mx) {
  if (mn < mx) {
    return Math.max(mn, Math.min(mx, n));
  } else {
    return Math.max(mx, Math.min(mn, n));
  }
}

export const rad = Math.PI / 180;
export const _rad = 180 / Math.PI;

export function rand(n1 = 1, n2 = 0, rnd = false) {
  if (!n2) {
    n2 = n1;
    n1 = 0;
  }
  const n = n1 + Math.random() * (n2 - n1);
  // tslint:disable-next-line: no-bitwise
  return rnd ? (n + 0.5) | 0 : n;
}

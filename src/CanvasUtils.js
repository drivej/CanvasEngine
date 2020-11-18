export function clamp(n, mn, mx) {
  if (mn < mx) {
    return Math.max(mn, Math.min(mx, n));
  } else {
    return Math.max(mx, Math.min(mn, n));
  }
}

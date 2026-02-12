"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._rad = exports.rad = void 0;
exports.clamp = clamp;
exports.rand = rand;
function clamp(n, mn, mx) {
    if (mn < mx) {
        return Math.max(mn, Math.min(mx, n));
    }
    else {
        return Math.max(mx, Math.min(mn, n));
    }
}
exports.rad = Math.PI / 180;
exports._rad = 180 / Math.PI;
function rand(n1 = 1, n2 = 0, rnd = false) {
    if (!n2) {
        n2 = n1;
        n1 = 0;
    }
    const n = n1 + Math.random() * (n2 - n1);
    // tslint:disable-next-line: no-bitwise
    return rnd ? (n + 0.5) | 0 : n;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._rad = exports.rad = void 0;
exports.clamp = clamp;
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

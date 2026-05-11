"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._rad = exports.rad = void 0;
exports.clamp = clamp;
exports.rand = rand;
exports.drawRoundedRect = drawRoundedRect;
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
/**
 * Draw a rounded rectangle
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {number} radius - Border radius
 * @param {string} fillStyle - Fill color
 */
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
    if (width < 2 * radius)
        radius = width / 2;
    if (height < 2 * radius)
        radius = height / 2;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    if (fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
}

export function CanvasBitmapRenderer() {
  var ctx = this.root.ctx;
  if (this.repeatX === true) {
    if (this.repeatY === true) {
      var w = this.root.width;
      var h = this.root.height;
      var _w = this.__width;
      var _h = this.__height;
      var _ox = (this.__x % _w) - _w;
      var _oy = (this.__y % _h) - _h;
      var ox = _ox;
      var oy = _oy;
      while (oy < h) {
        while (ox < w) {
          ctx.drawImage(this.bitmapData, ox, oy, _w, _h);
          ox += Math.floor(_w);
        }
        ox = _ox;
        oy += Math.floor(_h);
      }
    } else {
      var w = this.root.width;
      var ox = Math.floor((this.__x % this.__width) - this.__width);
      while (ox < w) {
        ctx.drawImage(this.bitmapData, ox, this.__y, this.__width, this.__height);
        ox += Math.floor(this.__width);
      }
    }
  } else {
    ctx.drawImage(this.bitmapData, this.__x, this.__y, this.__width, this.__height);
  }
}

import { CanvasBitmapRenderer } from './CanvasBitmapRenderer';
import { CanvasImageLoader } from './CanvasImageLoader';

export function CanvasElementRenderer() {
  var ctx = this.root.ctx;
  var restore = false;
  var transform = false;
  var alpha = false;

  if (this.viewport !== false) {
    ctx.save();
    restore = true;
  }

  if (this.blendMode !== false) {
    ctx.globalCompositeOperation = this.blendMode;
  }

  if (this._rotation !== 0) {
    transform = true;
    var i, p;
    var n = this.parentChain.length;
    for (i = 0; i < n; i++) {
      p = this.parentChain[i];
      if (p.rotation !== 0) {
        p._tx = p.__x + p.__width * p.transformCenterX;
        p._ty = p.__y + p.__height * p.transformCenterY;
        ctx.translate(p._tx, p._ty);
        ctx.rotate(p.rotation * rad);
        ctx.translate(-p._tx, -p._ty);
      }
    }
  }
  if (this.viewport !== false) {
    // add check for viewport overlap
    var v = this.viewport;
    var r = { x: v.__x, y: v.__y, right: v.__x + v.__width, bottom: v.__y + v.__height, width: v.__width, height: v.__height };
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.width, r.height);
    ctx.clip();
  }
  if (this.rotation !== 0) {
    this._tx = this.__x + this.__width * this.transformCenterX;
    this._ty = this.__y + this.__height * this.transformCenterY;
    ctx.translate(this._tx, this._ty);
    ctx.rotate(this.rotation * rad);
    ctx.translate(-this._tx, -this._ty);
  }
  if (this.clip) {
    ctx.beginPath();
    ctx.rect(this.__x + this.clip.x, this.__y + this.clip.y, this.clip.width, this.clip.height);
    ctx.clip();
  }
  if (this._alpha < 1) {
    alpha = true;
    ctx.globalAlpha = this._alpha;
  }
  if (this.fillStyle) {
    ctx.fillStyle = this.fillStyle;
    if (this.repeatX === true) {
      ctx.fillRect(0, this.__y, this.root.width, this.__height);
    } else {
      if (this.borderRadius !== false) {
        // rounded corners! - can't live without this
        CanvasUtils.drawRoundedRect(ctx, this.__x, this.__y, this.__width, this.__height, this.borderRadius, this.fillStyle);
      } else {
        ctx.fillRect(this.__x, this.__y, this.__width, this.__height);
      }
    }
  }
  if (this.bitmapData !== false) {
    CanvasBitmapRenderer.call(this);
  } else if (this.html !== false) {
    CanvasTextRenderer.call(this);
  } else if (this.image !== false) {
    CanvasImageLoader.call(this);
  }

  if (this.div !== false) {
    //this.div.css({visibility:this._visible ? 'visible' : 'hidden', opacity:this._alpha, top:this.__y, left:this.__x, width:this.__width, height:this.__height});
    var styles = {
      position: 'fixed',
      visibility: this._visible ? 'visible' : 'hidden',
      opacity: String(this._alpha),
      top: this.__y.toFixed(3) + 'px',
      left: this.__x.toFixed(3) + 'px',
      width: this.__width.toFixed(3) + 'px',
      height: this.__height.toFixed(3) + 'px',
    };
    var style = this.div.style;
    var updated = [];

    for (var e in styles) {
      if (style[e] !== styles[e]) {
        style[e] = styles[e];
        updated.push(e);
      }
    }
    // console.log('updated',updated[0])

    // if(style.position !== 'fixed'){
    // 	style.position = 'fixed'
    // }

    // if(style.position !== 'fixed'){
    // 	style.position = 'fixed'
    // }
    // this._divStyle = {
    // 	position:'fixed',
    // 	visibility:this._visible ? 'visible' : 'hidden',
    // 	opacity:this._alpha,
    // 	top:this.__y+'px',
    // 	left:this.__x+'px',
    // 	width:this.__width+'px',
    // 	height:this.__height+'px'
    // }

    // Object.assign(this.div.style,{
    // 	//position:'fixed',
    // 	visibility:this._visible ? 'visible' : 'hidden',
    // 	opacity:this._alpha,
    // 	top:this.__y+'px',
    // 	left:this.__x+'px',
    // 	width:this.__width+'px',
    // 	height:this.__height+'px'
    // });
  }

  if (restore === true) {
    ctx.restore();
  } else {
    if (this.blendMode !== false) {
      ctx.globalCompositeOperation = 'source-over';
    }
    if (alpha === true) {
      ctx.globalAlpha = 1;
    }
    if (transform === true) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

export function CanvasEvent(evt) {
  var self = this;
  this.className = 'UIEvent';
  this.currentTarget = false;
  if (typeof evt === 'string') {
    evt = { type: evt, phase: 'bubble' };
  }
  this._stopPropagation = false;
  this.stopPropagation = function () {
    self._stopPropagation = true;
  };
  for (var e in evt) {
    this[e] = evt[e];
  }
}

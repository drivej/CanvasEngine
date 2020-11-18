import { clamp } from './CanvasUtils';

export function CanvasBounds(config) {
  var self = this;
  this.minX = -Infinity;
  this.maxX = Infinity;
  this.minY = -Infinity;
  this.maxY = Infinity;
  this.minZ = -Infinity;
  this.maxZ = Infinity;

  this.set = function (o) {
    for (var e in o) {
      this[e] = o[e];
    }
  };
  this.clamp = function (p) {
    if ('x' in p) p.x = clamp(p.x, self.minX, self.maxX);
    if ('y' in p) p.y = clamp(p.y, self.minY, self.maxY);
    if ('z' in p) p.z = clamp(p.z, self.minZ, self.maxZ);
    return p;
  };
  this.set(config);
}

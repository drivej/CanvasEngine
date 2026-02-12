import { clamp } from './CanvasUtils';

export class CanvasBounds {
  /**
   * @param {any} config
   */
  constructor(config) {
    var self = this;
    /** @type {number} */
    this.minX = -Infinity;
    /** @type {number} */
    this.maxX = Infinity;
    /** @type {number} */
    this.minY = -Infinity;
    /** @type {number} */
    this.maxY = Infinity;
    /** @type {number} */
    this.minZ = -Infinity;
    /** @type {number} */
    this.maxZ = Infinity;

    /**
     * @type {(o: any) => void}
     */
    this.set = function (o) {
      for (var e in o) {
        this[e] = o[e];
      }
    };
    /**
     * @type {(p: any) => any}
     */
    this.clamp = function (p) {
      if ('x' in p) p.x = clamp(p.x, self.minX, self.maxX);
      if ('y' in p) p.y = clamp(p.y, self.minY, self.maxY);
      if ('z' in p) p.z = clamp(p.z, self.minZ, self.maxZ);
      return p;
    };
    this.set(config);
  }
}

// export class CanvasBounds {
//   constructor(config) {
//     var self = this;
//     this.minX = -Infinity;
//     this.maxX = Infinity;
//     this.minY = -Infinity;
//     this.maxY = Infinity;
//     this.minZ = -Infinity;
//     this.maxZ = Infinity;

//     this.set(config);
//   }

//   set(o) {
//     for (var e in o) {
//       this[e] = o[e];
//     }
//   }

//   clamp(p) {
//     if ('x' in p) p.x = clamp(p.x, self.minX, self.maxX);
//     if ('y' in p) p.y = clamp(p.y, self.minY, self.maxY);
//     if ('z' in p) p.z = clamp(p.z, self.minZ, self.maxZ);
//     return p;
//   }
// }

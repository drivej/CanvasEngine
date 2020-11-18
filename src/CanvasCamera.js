import { gsap } from 'gsap';

export function CanvasCamera(config) {
  var self = this;
  this.x = 0;
  this.y = 0;
  this.z = -200;
  this.offsetX = 400;
  this.offsetY = 400;
  this.focalLength = 300;
  this.focalPower = 0.3;
  this.fov = 1000;
  this.fog = { start: 20000, end: 22000, range: 2000 };

  this.moveTo = function (loc, duration, ease) {
    var time = duration || 0.5;
    var o = {
      ease: ease || 'power1.out',
      onUpdate: function () {
        self.stage.root.changed = true;
        self.onChange();
      },
    };
    for (var e in loc) {
      switch (e) {
        case 'x':
        case 'y':
        case 'z':
          loc[e] = Math.round(loc[e]);
        case 'offsetX':
        case 'offsetY':
        case 'focalLength':
        case 'focalPower':
        case 'ease':
          o[e] = loc[e];
          break;
        case 'time':
          time = loc[e];
          break;
      }
    }
    var T = gsap;
    T.to(self, time, o);
  };

  this.moveToElement = function (el, zOffset, duration, ease) {
    self.moveTo(
      {
        x: el._x + el._width * 0.5,
        y: el._y + el._height * 0.5,
        z: el._z - (!isNaN(zOffset) ? zOffset : self.focalLength),
      },
      duration,
      ease
    );
  };

  this.zFactor = function (z) {
    if (z === 0) {
      return 1;
    }
    return Math.pow(self.focalLength / z, self.focalPower);
    // return self.fov/(self.fov+z);
  };

  this.onChange = function () {};

  for (var e in config) {
    this[e] = config[e];
  }
}

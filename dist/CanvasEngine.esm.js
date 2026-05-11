// src/CanvasUtils.js
function clamp2(n, mn, mx) {
  if (mn < mx) {
    return Math.max(mn, Math.min(mx, n));
  } else {
    return Math.max(mx, Math.min(mn, n));
  }
}
var rad = Math.PI / 180;
var _rad = 180 / Math.PI;
function rand(n1 = 1, n2 = 0, rnd = false) {
  if (!n2) {
    n2 = n1;
    n1 = 0;
  }
  const n = n1 + Math.random() * (n2 - n1);
  return rnd ? n + 0.5 | 0 : n;
}
function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
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

// src/CanvasBounds.js
var CanvasBounds = class {
  /**
   * @param {any} config
   */
  constructor(config) {
    var self = this;
    this.minX = -Infinity;
    this.maxX = Infinity;
    this.minY = -Infinity;
    this.maxY = Infinity;
    this.minZ = -Infinity;
    this.maxZ = Infinity;
    this.set = function(o) {
      for (var e in o) {
        this[e] = o[e];
      }
    };
    this.clamp = function(p) {
      if ("x" in p) p.x = clamp2(p.x, self.minX, self.maxX);
      if ("y" in p) p.y = clamp2(p.y, self.minY, self.maxY);
      if ("z" in p) p.z = clamp2(p.z, self.minZ, self.maxZ);
      return p;
    };
    this.set(config);
  }
};

// src/CanvasStage.js
import { gsap as gsap2 } from "gsap";

// src/CanvasCamera.js
import { gsap } from "gsap";
function CanvasCamera(config) {
  var self = this;
  this.x = 0;
  this.y = 0;
  this.z = -200;
  this.offsetX = 400;
  this.offsetY = 400;
  this.focalLength = 300;
  this.focalPower = 0.3;
  this.fov = 1e3;
  this.fog = { start: 2e4, end: 22e3, range: 2e3 };
  this.moveTo = function(loc, duration, ease) {
    var time = duration || 0.5;
    var o = {
      ease: ease || "power1.out",
      onUpdate: function() {
        self.stage.root.changed = true;
        self.onChange();
      }
    };
    for (var e2 in loc) {
      switch (e2) {
        case "x":
        case "y":
        case "z":
          if (!isNaN(loc[e2])) {
            loc[e2] = Math.round(loc[e2]);
          } else {
            loc[e2] = 0;
          }
        case "offsetX":
        case "offsetY":
        case "focalLength":
        case "focalPower":
        case "ease":
          o[e2] = loc[e2];
          break;
        case "time":
          time = loc[e2];
          break;
      }
    }
    var T = gsap;
    T.to(self, time, o);
  };
  this.moveToElement = function(el, zOffset, duration, ease) {
    self.moveTo(
      {
        x: el._x + el._width * 0.5,
        y: el._y + el._height * 0.5,
        z: el._z - (!isNaN(zOffset) ? zOffset : self.focalLength)
      },
      duration,
      ease
    );
  };
  this.zFactor = function(z) {
    if (z === 0) {
      return 1;
    }
    return Math.pow(self.focalLength / z, self.focalPower);
  };
  this.onChange = function() {
  };
  for (var e in config) {
    this[e] = config[e];
  }
}

// src/CanvasEvent.js
function CanvasEvent(evt) {
  var self = this;
  this.className = "UIEvent";
  this.currentTarget = false;
  if (typeof evt === "string") {
    evt = { type: evt, phase: "bubble" };
  }
  this._stopPropagation = false;
  this.stopPropagation = function() {
    self._stopPropagation = true;
  };
  for (var e in evt) {
    this[e] = evt[e];
  }
}

// src/UIElement.js
var UIELEMENT_UNIQUEID = 0;
var UIElement = class {
  constructor(props) {
    console.log("make");
    var self = this;
    this.id = "";
    this.___uniqueid = UIELEMENT_UNIQUEID++;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.width = 0;
    this.height = 0;
    this.scale = 1;
    this.visible = true;
    this.alpha = 1;
    this.rotation = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._width = 0;
    this._height = 0;
    this._scale = 1;
    this._visible = true;
    this._alpha = 1;
    this._rotation = 0;
    this.__x = 0;
    this.__y = 0;
    this.__z = 0;
    this.__width = 0;
    this.__height = 0;
    this.viewport = false;
    this.mouseEnabled = true;
    this.smoothing = false;
    this.onstage = true;
    this.parent = false;
    this.children = [];
    this.parentChain = [];
    this.__remove = false;
    var listeners = {};
    this.root = self;
    this.rootArray = [];
    function addRootNode(e) {
      self.rootArray.push(e);
      sortRootNodes();
    }
    function sortNodes(arr) {
      arr.sort(function(a, b) {
        return a._z < b._z ? -1 : a._z > b._z ? 1 : 0;
      });
    }
    var sortRootNodesTimeout = false;
    function sortRootNodes(instant) {
      if (instant === true) {
        self.root.rootArray.sort(function(a, b) {
          return a._z < b._z ? -1 : a._z > b._z ? 1 : a.___uniqueid > b.___uniqueid ? -1 : a.___uniqueid < b.___uniqueid ? 1 : 0;
        });
        sortRootNodesTimeout = false;
      } else {
        if (sortRootNodesTimeout === false) {
          sortRootNodesTimeout = setTimeout(function() {
            sortRootNodes(true);
          }, 1);
        }
      }
    }
    function sortChildren() {
      sortNodes(self.children);
    }
    function hitTest(x, y) {
      return this.mouseEnabled === true && this._visible === true && this.onstage === true && x > this.__x && x < this.__x + this.__width && y > this.__y && y < this.__y + this.__height;
    }
    function addChild(c) {
      c.parent = self;
      c.root = self.root;
      c.parentChain = self.parentChain.concat([self]);
      c.children.forEach((child) => {
        child.root = self.root;
      });
      if (c.viewport === false) c.viewport = self.viewport;
      self.children.push(c);
      sortChildren();
      if (self.root.addRootNode) self.root.addRootNode(c);
      return c;
    }
    function removeChild(e) {
      var c = e.parent.children;
      if (!c) {
        return;
      }
      var i = c.length;
      while (i--) {
        if (c[i] == e) {
          c.splice(i, 1);
          e.__remove = true;
          e.parent = false;
          break;
        }
      }
    }
    function remove() {
      removeChild(self);
    }
    function getElementById(id) {
      for (var i = 0; i < self.children.length; i++) {
        if (self.children[i].id === id) {
          return self.children[i];
        }
      }
      return false;
    }
    function on(evt, func) {
      if (!listeners[evt]) {
        listeners[evt] = [];
      }
      listeners[evt].push(func);
      self.mouseEnabled = true;
      return self;
    }
    function off(evt, func) {
      if (listeners[evt]) {
        if (func) {
          var i = listeners[evt].length;
          while (i--) {
            if (listeners[evt][i] === func) {
              listeners[evt].splice(i, 1);
            }
          }
        } else {
          delete listeners[evt];
        }
      }
      return self;
    }
    function trigger(evt, bubble) {
      if (evt.className != "UIEvent") {
        evt = new CanvasEvent(evt);
      }
      if (evt.currentTarget === false) {
        evt.currentTarget = self;
      }
      evt.target = self;
      if (listeners[evt.type]) {
        var i = listeners[evt.type].length;
        while (i--) {
          listeners[evt.type][i].call(self, evt);
        }
      }
      if (evt.type === UIEventTypes.DOWN && self.draggable === true) {
        self.mouseData = { down: { x: self.x, y: self.y, z: self.z } };
        if (self.root.dragTarget !== self) {
          self.trigger(UIEventTypes.DRAG_START);
          self.root.dragTarget = self;
        }
        if (self.smartDrag !== true) {
          evt.stopPropagation();
        }
      }
      if (bubble !== false && evt._stopPropagation === false && self.parent !== false) {
        self.parent.trigger(evt);
      }
    }
    function willTrigger(evt) {
      return evt.type in listeners && listeners[evt.type] && listeners[evt.type].length > 0;
    }
    function setProperty(props2) {
      if (props2) {
        for (var e in props2) {
          self[e] = props2[e];
        }
        if (typeof self.root === "object") {
          self.root.changed = true;
        }
        if ("image" in props2) {
          if (self.img) {
            self.img.src = self.image;
          }
        }
        if ("width" in props2 || "height" in props2) {
        }
        if ("z" in props2) {
          self.trigger({ type: "zchange" });
        }
        if ("viewport" in props2) {
          for (var i = 0; i < self.children.length; i++) {
            self.children.setProperty({ viewport: self });
          }
        }
      }
    }
    function _render() {
      if (self.onstage === true) {
        self.render.call(self);
      }
    }
    this.update = function() {
    };
    this.render = function() {
    };
    this._render = _render;
    this.trigger = trigger;
    this.willTrigger = willTrigger;
    this.on = on;
    this.off = off;
    this.setProperty = setProperty;
    this.addChild = addChild;
    this.removeChild = removeChild;
    this.remove = remove;
    this.hitTest = hitTest;
    this.getElementById = getElementById;
    setProperty(props);
    if (this.root === true) {
      this.root = this;
      this.addRootNode = addRootNode;
      this.sortRootNodes = sortRootNodes;
    }
    if (this.viewport === true) {
      this.viewport = this;
    }
  }
};
var UIEventTypes = {
  DRAG_START: "drag_start",
  DRAG: "drag",
  DRAG_EASE: "drag_ease",
  DRAG_END: "drag_end",
  WHEEL: "wheel",
  MOVE: "move",
  OVER: "over",
  OUT: "out",
  DOWN: "down",
  UP: "up",
  ENTER: "enter",
  LEAVE: "leave",
  ENTER_STAGE: "enter_stage",
  LEAVE_STAGE: "leave_stage",
  CLICK: "click",
  REMOVED: "removed",
  CHANGED: "changed",
  UPDATED: "updated",
  PROGRESS: "progress"
};
function UIMouse(config) {
  var self = this;
  this.currentTarget = false;
  this.isDown = false;
  this.position = { target: null, x: 0, y: 0 };
  this.down = { target: null, x: 0, y: 0 };
  this.move = { target: null, x: 0, y: 0 };
  this.up = { target: null, x: 0, y: 0 };
  this.vector = { x: 0, y: 0 };
  this.data = {};
  this.onAfterClick = false;
  var _root = config.root;
  var _targ = config.target;
  this.config = config;
  var LAST_OVER_TARGET = false;
  var hasTouch = "ontouchstart" in window && !/hp-tablet/gi.test(navigator.appVersion);
  function fixMouseEvent(e) {
    e.multitouch = false;
    e.zoomedIn = document.width / window.innerWidth > 1;
    if (hasTouch) {
      var t = e.originalEvent ? e.originalEvent.touches : e.touches;
      if (t) {
        if (t && t.length > 0) {
          e.pageX = t[0].pageX;
          e.pageY = t[0].pageY;
          e.multitouch = t.length > 1;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
          e.pageX = e.changedTouches[0].pageX;
          e.pageY = e.changedTouches[0].pageY;
          e.multitouch = e.changedTouches.length > 1;
        }
      }
    }
  }
  function UIEventLookup(str) {
    var EVENTS = {
      mousedown: UIEventTypes.DOWN,
      mouseup: UIEventTypes.UP,
      mousemove: self.isDown ? UIEventTypes.DRAG : UIEventTypes.MOVE,
      mouseleave: UIEventTypes.LEAVE,
      mousewheel: UIEventTypes.WHEEL,
      touchstart: UIEventTypes.DOWN,
      touchend: UIEventTypes.UP,
      touchmove: self.isDown ? UIEventTypes.DRAG : UIEventTypes.MOVE,
      touchcancel: UIEventTypes.LEAVE,
      pointerdown: UIEventTypes.DOWN,
      pointerup: UIEventTypes.UP,
      pointermove: self.isDown ? UIEventTypes.DRAG : UIEventTypes.MOVE,
      pointerleave: UIEventTypes.LEAVE
    };
    return EVENTS[str] || "";
  }
  function handleMouse(e) {
    e.preventDefault();
    fixMouseEvent(e);
    var rect = _targ.getBoundingClientRect();
    var offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
    self.position.x = e.pageX - offset.left;
    self.position.y = e.pageY - offset.top;
    var EVENT = new CanvasEvent({ type: UIEventLookup(e.type), mouse: self, pageX: self.position.x, pageY: self.position.y });
    switch (EVENT.type) {
      case UIEventTypes.WHEEL:
        EVENT.deltaFactor = e.originalEvent && e.originalEvent.deltaFactor ? e.originalEvent.deltaFactor : 1;
        EVENT.deltaX = "deltaX" in e ? e.deltaX : e.originalEvent.deltaX;
        EVENT.deltaY = "deltaY" in e ? e.deltaY : e.originalEvent.deltaY;
        break;
      case UIEventTypes.DOWN:
        self.isDown = true;
        self.down.x = self.position.x;
        self.down.y = self.position.y;
        self.vector.x = 0;
        self.vector.y = 0;
        self.vector.length = 0;
        self.vector.maxLength = 0;
        break;
      case UIEventTypes.MOVE:
        break;
      case UIEventTypes.DRAG:
        self.vector.x = self.position.x - self.down.x;
        self.vector.y = self.position.y - self.down.y;
        self.vector.length = Math.sqrt(Math.pow(self.vector.x, 2) + Math.pow(self.vector.y, 2));
        self.vector.maxLength = Math.max(self.vector.length, self.vector.maxLength);
        break;
      case UIEventTypes.LEAVE:
      case UIEventTypes.UP:
        if (self.isDown === true) {
          self.isDown = false;
        }
        break;
    }
    if (self.isDown === false) {
      var EVENT_OVER = new CanvasEvent({ type: UIEventTypes.OVER, mouse: self, pageX: self.position.x, pageY: self.position.y });
      var OVER_TARGET = getFirstHit(EVENT_OVER);
      if (OVER_TARGET !== null && LAST_OVER_TARGET !== OVER_TARGET) {
        if (LAST_OVER_TARGET !== false) {
          _targ.classList.remove("cursor-pointer");
          var EVENT_OUT = new CanvasEvent({ type: UIEventTypes.OUT, mouse: self, pageX: self.position.x, pageY: self.position.y });
          LAST_OVER_TARGET.trigger(EVENT_OUT);
        }
        if (OVER_TARGET.willTrigger(EVENT_OVER)) {
          OVER_TARGET.trigger(EVENT_OVER);
          _targ.classList.add("cursor-pointer");
        }
        LAST_OVER_TARGET = OVER_TARGET;
      }
    }
    var hit = getFirstHit(EVENT);
    hit = getDeepHit(hit, EVENT);
    hit.trigger(EVENT);
    if (hit.willTrigger({ type: UIEventTypes.CLICK })) {
      _targ.classList.add("cursor-pointer");
    }
    if (EVENT._stopPropagation === false && EVENT.type === UIEventTypes.UP && self.vector.maxLength < 3) {
      var EVENT_CLICK = new CanvasEvent({ type: UIEventTypes.CLICK, mouse: self, pageX: self.position.x, pageY: self.position.y });
      hit.trigger(EVENT_CLICK);
      if (self.onAfterClick !== false) {
        self.onAfterClick(hit);
      }
    }
  }
  function getFirstHit(e) {
    var hit = _root;
    for (var i = 0; i < _root.rootArray.length; i++) {
      var c = _root.rootArray[i];
      if (c.hitTest(e.pageX, e.pageY) && (c.viewport === false || c.viewport.hitTest(e.pageX, e.pageY))) {
        hit = c;
        break;
      }
    }
    return hit;
  }
  function getDeepHit(p, e) {
    if (p.children.length > 0) {
      for (var i = 0; i < p.children.length; i++) {
        var c = p.children[i];
        if (c.hitTest(e.pageX, e.pageY)) {
          p = getDeepHit(c, e);
        }
      }
    }
    return p;
  }
  _targ.addEventListener("mousewheel", handleMouse, { passive: false });
  _targ.addEventListener("pointerdown", handleMouse, { passive: false });
  _targ.addEventListener("pointermove", handleMouse, { passive: false });
  _targ.addEventListener("pointerup", handleMouse, { passive: false });
  _targ.addEventListener("pointerleave", handleMouse, { passive: false });
}

// src/CanvasStage.js
var CanvasStage = class {
  constructor(config) {
    var self = this;
    this.dragX = true;
    this.dragY = true;
    this.dragZ = true;
    this.userBounds = new CanvasBounds();
    this.cameraBounds = new CanvasBounds();
    this.maxWidth = Infinity;
    this.maxHeight = Infinity;
    this.dragFactor = 1;
    var TweenEngine = gsap2;
    var _config = Object.assign(
      {
        width: 100,
        height: 100,
        wheelZoom: true,
        mouseEnabledX: true,
        mouseEnabledY: true,
        mouseEnabledZ: true,
        fillStyle: "#FFF",
        fullscreen: true
      },
      config
    );
    if (config.userBounds) {
      this.userBounds.set(config.userBounds);
    }
    if (config.cameraBounds) {
      this.cameraBounds.set(config.cameraBounds);
    }
    if (config.maxWidth) {
      this.maxWidth = config.maxWidth;
    }
    if (config.maxHeight) {
      this.maxHeight = config.maxHeight;
    }
    this.camera = new CanvasCamera({ stage: this });
    var cam = this.camera;
    var cvs = this.cvs = document.createElement("canvas");
    var ctx = this.ctx = cvs.getContext("2d", { alpha: true });
    var win = {
      width: 0,
      height: 0
    };
    var resizeTimeout;
    function updateWindowSize(instant) {
      if (instant !== true) {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(function() {
          updateWindowSize(true);
        }, 50);
        return;
      }
      win.width = window.innerWidth;
      win.height = window.innerHeight;
      if (_config.fullscreen === true) {
        self.setSize(win.width, win.height);
      }
    }
    this.root = new UIElement({
      root: true,
      id: "stage",
      width: _config.width,
      height: _config.height,
      ctx,
      camera: self.camera,
      parent: false,
      changed: true
    });
    this.mouse = _config.mouseEnabled !== false ? new UIMouse({ target: cvs, root: this.root }) : false;
    var elementIdRef = {};
    function getVisibleElements() {
      return self.root.rootArray.filter(function(n) {
        return n.onstage === true && n.visible === true;
      });
    }
    function getElementById(id) {
      if (elementIdRef[id]) {
        return elementIdRef[id];
      }
      var r = self.root.rootArray;
      var n = r.length;
      for (var i = 0; i < n; i++) {
        if (r[i].id === id) {
          elementIdRef[id] = r[i];
          return r[i];
        }
      }
      return false;
    }
    function updateTree(e) {
      e.trigger(UIEventTypes.UPDATED, false);
      if (e.beforeUpdate) e.beforeUpdate.call(e);
      if (e.physics === true) {
        e.x += e.vector.x;
        e.y += e.vector.y;
        e.z += e.vector.z;
        e.vector.x *= e.friction.x;
        e.vector.y *= e.friction.y;
        e.vector.z *= e.friction.z;
      }
      if (e.position === "fixed") {
        e._onstage = false;
        e._visible = e.visible;
        if (e._visible) {
          e.__x = e.right !== false ? e.root.width - e.width : e.x;
          e.__y = e.y;
          if (e.bottom !== false) {
            e.__y = e.root.height - (e.height + e.bottom);
          } else if (e.verticalAlign !== false) {
            switch (e.verticalAlign) {
              case "middle":
                e.__y = (e.root.height - e.height) * 0.5;
                break;
              case "bottom":
                e.__y = e.root.height - e.height;
                break;
            }
          }
          e._z = e.z;
          e._alpha = e.alpha;
          e.__width = e.width * e.scale;
          e.__height = e.height * e.scale;
          e.__right = e.__x + e.__width;
          e.__bottom = e.__y + e.__height;
          if (e.__x < e.root.width && e.__y < e.root.height && e.__right > 0 && e.__bottom > 0) {
            e._onstage = true;
          }
        }
      } else {
        if (e.parent) {
          var p = e.parent;
          e._visible = p._visible ? e.visible : false;
          if (e.right !== false) {
            e._x = p._x + p.width - (e.width + e.right);
          } else {
            e._x = p._x + e.x;
          }
          e._y = p._y + e.y;
          e._z = p._z + e.z;
          e._rotation = p._rotation + e.rotation;
          e._scale = p._scale * e.scale;
          e._alpha = p._alpha * e.alpha;
          e.__z = e._z - cam.z;
          e._onstage = false;
          if (e._visible === true && e.__z >= 0) {
            if (e.__lastZ !== e.__z) {
              e.zFactor = cam.zFactor(e.__z);
              e.__lastZ = e.__z;
            }
            var r = self.root;
            e.__x = cam.offsetX + (e._x - cam.x) * e.zFactor;
            if (e.__x < r.width || e.repeatX === true) {
              e.__y = cam.offsetY + (e._y - cam.y) * e.zFactor;
              if (e.__y < r.height || e.repeatY === true) {
                e._width = e._scale * e.width;
                e.__width = e._width * e.zFactor;
                if (e.__x + e.__width > 0 || e.repeatX === true) {
                  e._height = e._scale * e.height;
                  e.__height = e._height * e.zFactor;
                  if (e.__y + e.__height > 0 || e.repeatY === true) {
                    e._onstage = true;
                  }
                }
              }
            }
            if (e._onstage === false && e.plane === true) {
              e.renderSkew();
              var rect = e.hitRect;
              e._onstage = rect.right > 0 && rect.bottom > 0 && rect.x < r.width && rect.y < r.height;
            }
            if (e._onstage === false && e._rotation !== 0) {
              var rect = {
                x: e.__x - e.__width * 1,
                y: e.__y - e.__height * 1,
                right: e.__x + e.__width * 2,
                bottom: e.__y + e.__height * 2
              };
              e._onstage = rect.right > 0 && rect.bottom > 0 && rect.x < r.width && rect.y < r.height;
            }
            if (e._onstage === true && cam.fog.active === true) {
              if (e.__z > cam.fog.start) {
                if (e.__z < cam.fog.end) {
                  cam.fog.range = cam.fog.end - cam.fog.start;
                  e._alpha *= (cam.fog.end - e.__z) / cam.fog.range;
                } else {
                  e._alpha = 0;
                }
              }
            }
          }
        }
      }
      if (e.div !== false && e._onstage === false) {
        e.div.style.visibility = "hidden";
      }
      var c = e.children;
      var i = c.length;
      while (i--) {
        updateTree(c[i]);
      }
      e.changed = false;
    }
    function setFillStyle(f) {
      _config.fillStyle = f;
      self.root.changed = true;
    }
    function render() {
      var r = self.root;
      var a = r.rootArray;
      var k = a.length;
      var e;
      var remove = [];
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = _config.fillStyle;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      updateTree(r);
      while (k--) {
        e = a[k];
        if (e.onstage !== e._onstage) {
          if (e._onstage && e.willTrigger({ type: UIEventTypes.ENTER_STAGE })) {
            e.trigger(UIEventTypes.ENTER_STAGE);
          } else if (e.willTrigger({ type: UIEventTypes.LEAVE_STAGE })) {
            e.trigger(UIEventTypes.LEAVE_STAGE);
          }
        }
        e.onstage = e._onstage;
        if (e.onstage) {
          if (e.willTrigger({ type: UIEventTypes.PROGRESS })) {
            var p = (e.__y + e.height) / (e.root.height + e.height);
            if (p != e.progress) {
              e.progress = p;
              e.trigger(UIEventTypes.PROGRESS);
            }
          }
          if (e.smoothing === false) {
            e.__x = e.__x + 0.5 | 0;
            e.__y = e.__y + 0.5 | 0;
            e.__width = e.__width + 0.5 | 0;
            e.__height = e.__height + 0.5 | 0;
          }
          e._render();
        }
        if (e.__remove === true) {
          remove.unshift(k);
          e.trigger(UIEventTypes.REMOVED);
        }
      }
      if (remove.length > 0) {
        k = remove.length;
        while (k--) {
          a.splice(remove[k], 1);
        }
      }
    }
    this.startRender = function() {
      TweenEngine.ticker.add(render);
    };
    this.stopRender = function() {
      TweenEngine.ticker.remove(render);
      render();
    };
    this.root.on("zchange", function(e) {
      this.sortRootNodes();
    });
    this.root.dragTarget = false;
    if (this.mouse) {
      this.root.on(UIEventTypes.DOWN, function(e) {
        this.mouseData = {
          down: {
            x: self.camera.x,
            y: self.camera.y
          }
        };
      });
      this.root.on(UIEventTypes.DRAG, function(e) {
        var dragCamera = false;
        var t = this.dragTarget;
        if (this.dragTarget !== this && this.dragTarget !== false) {
          var doDrag = false;
          if (t.smartDrag) {
            if (self.dragY !== false && Math.abs(e.mouse.vector.x) < Math.abs(e.mouse.vector.y)) {
              self.camera.moveTo(self.userBounds.clamp({ y: this.mouseData.down.y - e.mouse.vector.y }));
            } else {
              doDrag = true;
            }
          } else {
            doDrag = true;
          }
          if (doDrag) {
            var position = {
              x: t.mouseData.down.x + e.mouse.vector.x * (1 / t.zFactor),
              y: t.mouseData.down.y + e.mouse.vector.y * (1 / t.zFactor)
            };
            if (t.dragBounds) {
              if (t.dragBounds === "parent") {
                t.dragBounds = {
                  minX: Math.min(0, t.parent.width - t.width),
                  maxX: Math.max(0, t.parent.width - t.width),
                  minY: Math.min(0, t.parent.height - t.height),
                  maxY: Math.max(0, t.parent.height - t.height)
                };
              }
              position.x = clamp(position.x, t.dragBounds.minX, t.dragBounds.maxX);
              position.y = clamp(position.y, t.dragBounds.minY, t.dragBounds.maxY);
            }
            TweenEngine.to(t, {
              duration: 0.3,
              x: position.x,
              y: position.y,
              onUpdate: function() {
                t.trigger(UIEventTypes.DRAG_EASE);
              },
              onComplete: function() {
                t.trigger(UIEventTypes.DRAG_END);
              }
            });
          }
        } else {
          dragCamera = true;
        }
        if (dragCamera === true) {
          self.camera.moveTo(
            self.userBounds.clamp({
              x: this.mouseData.down.x - e.mouse.vector.x * self.dragFactor,
              y: this.mouseData.down.y - e.mouse.vector.y * self.dragFactor
            })
          );
        }
      });
      this.root.on(UIEventTypes.UP, function(e) {
        this.lastDragTarget = this.dragTarget;
        if (this.dragTarget) {
          this.dragTarget.trigger(UIEventTypes.DRAG_END);
        }
        this.dragTarget = false;
      });
      this.root.on(UIEventTypes.LEAVE, function(e) {
        this.lastDragTarget = this.dragTarget;
        if (this.dragTarget) {
          this.dragTarget.trigger(UIEventTypes.DRAG_END);
        }
        this.dragTarget = false;
      });
      this.root.on(UIEventTypes.WHEEL, function(e) {
        if (e.mouse.isDown && this.dragTarget !== this && this.dragTarget !== false) {
          this.dragTarget.setProperty({ z: this.dragTarget.z + e.deltaY * e.deltaFactor * 0.5 });
        } else {
          if (_config.wheelZoom && self.dragZ !== false) {
            self.camera.moveTo(self.userBounds.clamp({ z: self.camera.z + e.deltaY * e.deltaFactor * 1 }));
          } else if (self.dragY !== false) {
            self.camera.moveTo(self.userBounds.clamp({ y: self.camera.y - e.deltaY * e.deltaFactor * 2 }));
          }
        }
      });
    }
    this.setSize = function(w, h) {
      var _w = Math.min(self.maxWidth, w);
      var _h = Math.min(self.maxHeight, h);
      cvs.width = _w;
      cvs.height = _h;
      self.camera.offsetX = Math.round(_w * 0.5);
      self.camera.offsetY = Math.round(_h * 0.5);
      self.root.width = _w;
      self.root.height = _h;
      if (_w < w) {
        self.cvs.style.left = "50%";
        self.cvs.style.marginLeft = Math.round(-_w * 0.5) + "px";
      } else {
        self.cvs.style.left = "";
        self.cvs.style.marginLeft = "";
      }
    };
    this.allImages = [];
    this.preloadImages = [];
    this.nonPreloadImages = [];
    this.importData = function(data) {
      insertElement(data, self);
      setTimeout(function() {
        self.root.sortRootNodes();
      }, 1);
    };
    var insertElement = function(c, p) {
      if (p == null) {
        p = self;
      }
      var id = "";
      if (!c.id && c.image) {
        id = c.image.split("/").pop().split(".")[0];
      }
      if (c.image) {
        if (c.preload) {
          self.preloadImages.push(c.image);
        } else {
          self.nonPreloadImages.push(c.image);
        }
        self.allImages.push(c.image);
      }
      if (window.assetsDirectory && c.image && c.image.indexOf(assetsDirectory) == -1 && c.image.indexOf("data:image") !== 0) {
        c.image = assetsDirectory + c.image;
      }
      p = p.addChild(new CanvasElement(Object.assign({ id, smoothing: true }, c, { children: [] })));
      for (var e in UIEventTypes) {
        var evt = UIEventTypes[e];
        if (c[evt]) {
          if (CanvasEventHandlers[c[evt]]) {
            p["__" + evt] = c[evt];
            p.on(evt, CanvasEventHandlers[c[evt]]);
          } else if (typeof c[evt] === "function") {
            p["__" + evt] = "INLINE";
            p.on(evt, c[evt]);
          }
        }
      }
      evt = "update";
      if (c[evt]) {
        if (CanvasEventHandlers[c[evt]]) {
          p["__" + evt] = c[evt];
          p.update = CanvasEventHandlers[c[evt]];
        } else if (typeof c[evt] === "function") {
          p.update = c[evt];
        }
      }
      if (c.children) {
        for (var i = 0; i < c.children.length; i++) {
          insertElement(c.children[i], p);
        }
      }
    };
    this.getElementById = getElementById;
    this.getVisibleElements = getVisibleElements;
    this.addChild = this.root.addChild;
    this.on = this.root.on;
    this.trigger = this.root.trigger;
    this.setProperty = this.root.setProperty;
    this.render = render;
    this.setFillStyle = setFillStyle;
    this.setSize(_config.width, _config.height);
    updateWindowSize(true);
    window.addEventListener("resize", updateWindowSize);
    this.startRender();
  }
};

// src/CanvasBitmapRenderer.js
function CanvasBitmapRenderer() {
  var ctx = this.root.ctx;
  if (this.repeatX === true) {
    if (this.repeatY === true) {
      var w = this.root.width;
      var h = this.root.height;
      var _w = this.__width;
      var _h = this.__height;
      var _ox = this.__x % _w - _w;
      var _oy = this.__y % _h - _h;
      var ox = _ox;
      var oy = _oy;
      var xStep = Math.floor(_w);
      var yStep = Math.floor(_h);
      while (oy < h) {
        while (ox < w) {
          ctx.drawImage(this.bitmapData, ox, oy, _w, _h);
          ox += xStep;
        }
        ox = _ox;
        oy += yStep;
      }
    } else {
      var w = this.root.width;
      var ox = Math.floor(this.__x % this.__width - this.__width);
      while (ox < w) {
        ctx.drawImage(this.bitmapData, ox, this.__y, this.__width, this.__height);
        ox += Math.floor(this.__width);
      }
    }
  } else {
    ctx.drawImage(this.bitmapData, this.__x, this.__y, this.__width, this.__height);
  }
}

// src/LoaderMax.js
var LoaderMax = /* @__PURE__ */ (function() {
  var cache = {};
  var queue = [];
  var STATE = {
    IDLE: 0,
    LOADING: 0,
    LOADED: 1
  };
  function load(config) {
    if (!Array.isArray(config.images)) {
      config.images = [config.images];
    }
    if (!Array.isArray(config.onCompleteParams)) {
      config.onCompleteParams = [];
    }
    if (typeof config.onComplete !== "function") {
      config.onComplete = function() {
      };
    }
    config.images = config.images.filter(function(e) {
      return String(e).length > 0;
    });
    for (var i = 0; i < config.images.length; i++) {
      var img = String(config.images[i]);
      if (config.pattern) {
        img = config.pattern.replace("%IMAGE%", img);
      }
      if (config.root) {
        img = config.root + img;
      }
      config.images[i] = img;
      loadImage(img);
    }
    queue.unshift(config);
    checkQueue();
  }
  function getLoadedImages() {
    var a = [];
    for (var e in cache) {
      a.push(e);
    }
    return a;
  }
  function getImage(src) {
    if (isCached(src)) {
      return cache[src];
    }
    return false;
  }
  function isCached(src) {
    return src in cache;
  }
  function isLoaded(src) {
    return cache[src] && cache[src].state == STATE.LOADED;
  }
  function loadImage(src) {
    if (!isCached(src)) {
      var img = new Image();
      img.addEventListener("load", handleLoadImage, false);
      img.setAttribute("orig_src", src);
      cache[src] = { src, img, state: STATE.LOADING };
      img.src = src;
    } else {
      checkQueue();
    }
  }
  function handleLoadImage() {
    var src = this.getAttribute("orig_src");
    if (cache[src]) {
      cache[src].state = STATE.LOADED;
    }
    checkQueue();
  }
  function checkQueue() {
    var i = queue.length;
    while (i--) {
      var loaded = true;
      var imgs = [];
      for (var ii = 0; ii < queue[i].images.length; ii++) {
        if (cache[queue[i].images[ii]].state == STATE.LOADING) {
          loaded = false;
          break;
        } else {
          var o = cache[queue[i].images[ii]];
          o.width = o.img.width;
          o.height = o.img.height;
          o.squareWidth = Math.min(o.width, o.height);
          o.squareX = (o.width - o.squareWidth) * 0.5;
          o.squareY = (o.height - o.squareWidth) * 0.5;
          imgs.push(o);
        }
      }
      if (loaded) {
        var q = queue.splice(i, 1);
        q[0].onComplete.apply(this, [imgs].concat(q[0].onCompleteParams || []));
      }
    }
  }
  return {
    load,
    getLoadedImages,
    getImage
  };
})();

// src/CanvasImageLoader.js
function CanvasImageLoader() {
  if (this.imageLoaded !== true) {
    if (this.imageLoading === false) {
      if (this.image.indexOf("data:image") === 0) {
        var ref = this;
        var img = new Image();
        img.onload = function() {
          if (!this.complete) {
            console.log("INCOMPLETE LOAD");
          }
          handleLoadCanvasImage([{ img: this }], ref);
        };
        img.src = this.image;
      } else {
        var img = LoaderMax.getImage(this.image);
        if (img) {
          handleLoadCanvasImage([img], this);
        } else {
          LoaderMax.load({
            images: this.image,
            onComplete: handleLoadCanvasImage,
            onCompleteParams: [this]
          });
        }
      }
      this.imageLoading = true;
    }
  }
}
function handleLoadCanvasImage(imgs, ref) {
  ref.imageLoading = false;
  ref.imageLoaded = true;
  if (ref.autoSize === true || ref.width === 0 || ref.height === 0) {
    ref.width = imgs[0].width;
    ref.height = imgs[0].height;
  }
  ref.bitmapData = imgs[0].img;
}

// src/CanvasTextRenderer.js
var globalCSS = {};
function isNumeric(n) {
  return !isNaN(parseFloat(n));
}
function extend(tf, e1, e2, e3) {
  if (typeof tf == "boolean") {
    return Object.assign(e1, e2, e3 || {});
  }
  return Object.assign(e1, e2 || {}, e3 || {});
}
function CanvasTextRenderer() {
  var self = this;
  var text = self.html;
  if (text !== null && text !== "") {
    let setSafeCanvasDimension2 = function(val) {
      if (isNumeric(val) && val > 0) {
        if (val < 1) {
          return 1;
        } else {
          return Math.floor(val);
        }
      } else {
        return 0;
      }
    };
    var setSafeCanvasDimension = setSafeCanvasDimension2;
    if (self.bitmapData === false) {
      self.bitmapData = document.createElement("canvas");
      self.bitmapDataContext = self.bitmapData.getContext("2d");
      self.bitmapData.width = 10;
      self.bitmapData.height = 10;
    }
    var newCanvas = CanvasTextConverter.render(text + "<br>", { width: self.width }, globalCSS);
    var dimensions = {
      width: setSafeCanvasDimension2(newCanvas.width),
      height: setSafeCanvasDimension2(newCanvas.height)
    };
    self.bitmapData.width = dimensions.width;
    self.bitmapData.height = dimensions.height;
    self.width = dimensions.width;
    self.height = dimensions.height;
    if (dimensions.width > 0 && dimensions.height > 0) {
      self.bitmapDataContext.drawImage(newCanvas, 0, 0, dimensions.width, dimensions.height);
    }
  }
}
var CanvasTextConverter = /* @__PURE__ */ (function(config) {
  var SPACE_CHAR = "_-_-_-_-_-";
  var totalHeight;
  function render(text, config2, styleSheet) {
    totalHeight = 0;
    var cvs = document.createElement("canvas");
    var scale = config2 && isNumeric(config2.scale) ? config2.scale : 1;
    cvs.width = (config2 && isNumeric(config2.width) ? config2.width : 500) * scale;
    var d = htmlToTextData("<html>" + text + "</html>");
    var styles = extend(true, DEFAULT_STYLES, styleSheet || {});
    cvs.height = textDataToCanvas(d, styles, cvs, scale, true);
    textDataToCanvas(d, styles, cvs, scale, false);
    return cvs;
  }
  function addStyles(s) {
    extend(true, DEFAULT_STYLES, s);
  }
  var inlineStyleKeys = {
    "font-size": "fontSize",
    "font-face": "fontFace",
    "font-weight": "fontWeight",
    "font-style": "fontStyle",
    color: "color",
    "line-height": "lineHeight",
    width: "width",
    "margin-top": "marginTop",
    "margin-left": "marginLeft",
    "margin-right": "marginRight",
    "margin-bottom": "marginBottom",
    "text-align": "textAlign",
    "text-decoration": "textDecoration",
    display: "display"
  };
  function parseInlineStyles(str) {
    var inlineStyles = {};
    if (str) {
      var sty = str.split(";");
      for (var i = 0; i < sty.length; i++) {
        if (sty[i].indexOf(":") > -1) {
          sty[i] = sty[i].split(":");
          if (inlineStyleKeys[sty[i][0]]) {
            switch (inlineStyleKeys[sty[i][0]]) {
              case "fontSize":
              case "marginTop":
              case "marginLeft":
              case "marginRight":
              case "marginBottom":
              case "lineHeight":
                sty[i][1] = parseInt(sty[i][1], 10);
                break;
            }
            inlineStyles[inlineStyleKeys[sty[i][0]]] = sty[i][1];
          }
        }
      }
    }
    return inlineStyles;
  }
  function htmlToTextData(str) {
    result = str.replace(/(\S{1}<)/g, function(a) {
      return a.slice(0, 1) + " <";
    }).replace(/(>\S{1})/g, function(a) {
      return "> " + a.slice(-1);
    }).replace(/(<.*?>)/g, function(a) {
      return a.replace(" ", SPACE_CHAR);
    }).split(/\s/g);
    for (var i = 0; i < result.length; i++) {
      if (result[i].match(/<br>/)) {
        result[i] = { type: "html_break", html: true };
      } else if (result[i].match(/<\w+.*?>/)) {
        var s = result[i].replace(SPACE_CHAR, " ");
        var tag = s.match(/<(\w{1,}\d{0,})\b/)[1];
        var cls = s.match(/class="(.*?)"/);
        var sty = s.match(/style="(.*?)"/);
        var inlineStyles = {};
        if (sty) {
          inlineStyles = parseInlineStyles(sty[1]);
        }
        result[i] = { type: "html_open", html: true, text: s, tag, inlineStyles, cls: cls ? cls[1] : cls };
      } else if (result[i].match(/<\/\w+.*?>/)) {
        var s = result[i].replace(SPACE_CHAR, " ");
        var tag = s.match(/<\/(\w{1,}\d{0,})\b/)[1];
        result[i] = { type: "html_close", html: true, text: s, tag };
      } else {
        result[i] = { type: "word", text: result[i] };
      }
    }
    for (var i = 0; i < result.length - 2; i++) {
      if (result[i].t == "word" && result[i + 1].html && result[i + 2].t == "word" && result[i + 2].s.length == 1 && "!.:;?".indexOf(result[i + 2].s) != -1) {
        result[i].s = result[i].s + result[i + 2].s;
        result.splice(i + 2, 1);
      }
    }
    return result;
  }
  function textDataToCanvas(blocks, styles, cvs, scale, getDynamicHeight) {
    var applyStyle = function(s) {
      ctx.fillStyle = s.color;
      ctx.font = s.fontStyle + " " + s.fontWeight + " " + s.fontSize * scale + "px " + s.fontFace;
      SPACE_WIDTH = ctx.measureText(" ").width;
    };
    var getStyle = function(styleName) {
      return styles[styleName] || {};
    };
    var mergeStyles = function(styleHistoryObj, predefinedStyleObj, classRulesObj, inlineRulesObj) {
      var o = {};
      extend(o, styleHistoryObj, predefinedStyleObj, classRulesObj, inlineRulesObj);
      o._lineHeight = o.lineHeight == -1 ? o.fontSize * 1.15 : o.lineHeight;
      return o;
    };
    var styleHistory = [extend({}, styles.html)];
    var ctx = cvs.getContext("2d", { alpha: styleHistory[0].backgroundColor == "none" || styleHistory[0].backgroundColor == "transparent" ? true : false });
    if (styleHistory[0].backgroundColor != "none" && styleHistory[0].backgroundColor != "transparent") {
      ctx.fillStyle = styleHistory[0].backgroundColor;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    }
    var SPACE_WIDTH = 0;
    var scale = scale || 1;
    var boxWidth = cvs.width;
    var LH0 = 0.85;
    var LH1 = 0.15;
    var x = 0;
    var y = 100;
    var w = 0;
    var lines = [];
    var currentLine;
    var currentBlock = false;
    var textWidth = 0;
    function newLine() {
      currentLine = { lineHeight: styleHistory[0]._lineHeight, width: 0, blocks: [] };
      lines.push(currentLine);
      currentBlock = false;
      if (isNumeric(currentLine.lineHeight)) totalHeight += currentLine.lineHeight;
    }
    function newBlock(config2) {
      var found = currentLine.blocks.filter((n) => n.type == "text");
      currentBlock = extend({ width: 0, firstTextBlock: config2.type == "text" && found.length == 0 }, config2);
      currentLine.blocks.push(currentBlock);
    }
    newLine();
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      switch (block.type) {
        case "word":
          textWidth = ctx.measureText(block.text).width;
          if (currentLine.width + SPACE_WIDTH + textWidth > boxWidth) {
            newLine();
          }
          if (currentBlock.type !== "text") {
            newBlock({ type: "text", text: [block.text], width: textWidth });
          } else {
            currentBlock.text.push(block.text);
            currentBlock.width += SPACE_WIDTH + textWidth;
          }
          currentLine.width += SPACE_WIDTH + textWidth;
          break;
        case "html_open":
          styleHistory.unshift(mergeStyles(styleHistory[0], getStyle(block.tag), getStyle(block.cls), block.inlineStyles));
          applyStyle(styleHistory[0]);
          if (currentBlock.type == "style") {
            currentBlock.style = extend({}, styleHistory[0]);
          } else {
            newBlock({ type: "style", style: extend({}, styleHistory[0]) });
          }
          currentLine.lineHeight = styleHistory[0]._lineHeight;
          break;
        case "html_close":
          if (styleHistory[0].display == "block") {
            newLine();
          }
          styleHistory.shift();
          applyStyle(styleHistory[0]);
          if (currentBlock.type == "style") {
            currentBlock.style = extend({}, styleHistory[0]);
          } else {
            newBlock({ type: "style", style: extend({}, styleHistory[0]) });
          }
          currentLine.lineHeight = styleHistory[0]._lineHeight;
          break;
        case "html_break":
          newLine();
          break;
      }
    }
    var firstLine = true;
    var currentStyle = lines[0].blocks[0].style;
    var _x = 0;
    var _y = 0;
    var _y2 = 0;
    function returnInt(val) {
      newVal = parseInt(val);
      if (+newVal === newVal && !(newVal % 1)) {
        return newVal;
      } else {
        return 0;
      }
    }
    function calculateDynamicHeight(blockStyle) {
      totalHeight += returnInt(blockStyle.marginTop) + returnInt(blockStyle.marginBottom) + returnInt(blockStyle.paddingTop) + returnInt(blockStyle.paddingBottom);
    }
    for (var i = 0; i < lines.length; i++) {
      var l = lines[i];
      var startText = false;
      var textBlockCount = 0;
      for (var ix = 0; ix < l.blocks.length; ix++) {
        if (l.blocks[ix].type === "text") {
          textBlockCount++;
        }
      }
      for (var ii = 0; ii < l.blocks.length; ii++) {
        var b = l.blocks[ii];
        if (getDynamicHeight) {
          if (b.type === "style") calculateDynamicHeight(b.style);
        } else {
          switch (b.type) {
            case "style":
              applyStyle(b.style);
              currentStyle = b.style;
              calculateDynamicHeight(b.style);
              if (b.style.display !== "inline" || textBlockCount < 2) {
                _y += b.style.marginTop + _y2;
                _y2 = b.style.marginBottom;
              } else {
                _y2 = b.style.marginBottom;
              }
              break;
            case "text":
              if (!startText) {
                _y += l.lineHeight * LH0;
                if (currentStyle.textAlign == "center") {
                  _x = (boxWidth - l.width) * 0.5;
                  ctx.save();
                }
                startText = true;
              }
              ctx.fillText(b.text.join(" "), _x, _y);
              if (currentStyle.textDecoration == "underline") {
                var underscoreHeight = Math.max(1, currentStyle.fontSize * scale / 12);
                ctx.fillRect(_x, _y + Math.max(1.5, Math.ceil(underscoreHeight * 0.5)), b.width, underscoreHeight);
              }
              _x += b.width;
              break;
          }
        }
      }
      _x = 0;
      _y += l.lineHeight * LH1;
    }
    return totalHeight;
  }
  var DEFAULT_STYLES = {
    html: {
      fontSize: 12,
      fontFace: "Arial",
      fontWeight: "normal",
      fontStyle: "",
      color: "#000",
      lineHeight: -1,
      width: 500,
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
      maxWidth: 500,
      textAlign: "left",
      textDecoration: "none",
      display: "inline",
      backgroundColor: "none"
    },
    defaultStyle: {
      fontSize: 12,
      fontFace: "Arial",
      fontWeight: "normal",
      fontStyle: "",
      color: "#000",
      lineHeight: -1,
      width: 500,
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
      maxWidth: 500,
      textAlign: "left",
      textDecoration: "none",
      display: "inline"
    },
    b: {
      fontWeight: "bold",
      display: "inline"
    },
    strong: {
      fontWeight: "bold",
      display: "inline"
    },
    i: {
      fontStyle: "italic",
      display: "inline"
    },
    em: {
      fontStyle: "italic",
      display: "inline",
      marginBottom: 0,
      marginTop: 0
    },
    u: {
      textDecoration: "underline",
      display: "inline"
    },
    h1: {
      display: "block",
      fontWeight: "bold"
    },
    h2: {
      display: "block",
      fontWeight: "bold"
    },
    h3: {
      display: "block",
      fontWeight: "bold"
    },
    p: {
      display: "block"
    }
  };
  return {
    render,
    addStyles
  };
})();

// src/CanvasElementRenderer.js
function CanvasElementRenderer() {
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
        drawRoundedRect(ctx, this.__x, this.__y, this.__width, this.__height, this.borderRadius, this.fillStyle);
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
    var styles = {
      position: "fixed",
      visibility: this._visible ? "visible" : "hidden",
      opacity: String(this._alpha),
      top: this.__y.toFixed(3) + "px",
      left: this.__x.toFixed(3) + "px",
      width: this.__width.toFixed(3) + "px",
      height: this.__height.toFixed(3) + "px"
    };
    var style = this.div.style;
    var updated = [];
    for (var e in styles) {
      if (style[e] !== styles[e]) {
        style[e] = styles[e];
        updated.push(e);
      }
    }
  }
  if (restore === true) {
    ctx.restore();
  } else {
    if (this.blendMode !== false) {
      ctx.globalCompositeOperation = "source-over";
    }
    if (alpha === true) {
      ctx.globalAlpha = 1;
    }
    if (transform === true) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
}

// src/CanvasElement.js
function CanvasElement2(config) {
  var _super = new UIElement(
    Object.assign(
      {
        x: 0,
        y: 0,
        z: 0,
        width: 0,
        height: 0,
        scale: 1,
        alpha: 1,
        visible: true,
        rotation: 0,
        transformCenterX: 0.5,
        transformCenterY: 0.5,
        _x: 0,
        _y: 0,
        _z: 0,
        _width: 0,
        _height: 0,
        _scale: 1,
        _alpha: 1,
        _visible: true,
        _rotation: 0,
        __x: 0,
        __y: 0,
        __z: 0,
        __width: 0,
        __height: 0,
        __scale: 1,
        __visible: true,
        right: false,
        bottom: false,
        verticalAlign: false,
        onstage: false,
        _onstage: false,
        repeatX: false,
        repeatY: false,
        mouseEnabled: config.draggable ? true : false,
        smoothing: false,
        physics: null,
        vector: false,
        html: false,
        progress: 0,
        bitmapData: false,
        clip: false,
        imageLoaded: false,
        imageLoading: false,
        div: false,
        borderRadius: false,
        gradientFill: false,
        blendMode: false,
        zFactor: 1,
        render: CanvasElementRenderer
      },
      config
    )
  );
  if (_super.vector !== false) {
    _super.alwaysRender = true;
    _super.physics = _super.physics === null ? true : _super.physics;
    _super.vector = Object.assign({ x: 0, y: 0, z: 0 }, _super.vector || {});
    _super.friction = Object.assign({ x: 1, y: 1, z: 1 }, _super.friction || {});
  } else {
    _super.physics = false;
  }
  if (_super.image) {
    _super.imageLoading = false;
    _super.imageLoaded = false;
    if (_super.width === 0) {
      _super.autoSize = true;
    }
  } else {
    _super.image = false;
  }
  if (_super.bitmapData) {
    _super.image = true;
    _super.img = _super.bitmapData;
    _super.imageLoading = false;
    _super.imageLoaded = true;
    if (_super.autoSize === true) {
      _super.width = _super.bitmapData.width;
      _super.height = _super.bitmapData.height;
    }
  }
  if (_super.linearGradient) {
    _super.linearGradient.start = _super.linearGradient.start || {};
    _super.linearGradient.start.x = _super.linearGradient.start.x || 0;
    _super.linearGradient.start.y = _super.linearGradient.start.y || 0;
    _super.linearGradient.end = _super.linearGradient.end || {};
    _super.linearGradient.end.x = _super.linearGradient.end.x || 0;
    _super.linearGradient.end.y = _super.height || 0;
    if (!_super.linearGradient.start) {
      _super.linearGradient.start;
    }
    _super.bitmapData = document.createElement("canvas");
    _super.bitmapData.width = _super.width;
    _super.bitmapData.height = _super.height;
    var ctx = _super.bitmapData.getContext("2d");
    var g = _super.linearGradient;
    var grd = ctx.createLinearGradient(g.start.x, g.start.y, g.end.x, g.end.y);
    for (var i = 0; i < g.steps.length; i++) {
      grd.addColorStop(g.steps[i].at, g.steps[i].color);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, _super.width, _super.height);
  } else if (_super.radialGradient) {
    _super.bitmapData = document.createElement("canvas");
    _super.bitmapData.width = _super.width;
    _super.bitmapData.height = _super.height;
    var ctx = _super.bitmapData.getContext("2d");
    var g = _super.radialGradient;
    var grd = ctx.createRadialGradient(g.start.x, g.start.y, g.start.radius, g.end.x, g.end.y, g.end.radius);
    for (var i = 0; i < g.steps.length; i++) {
      grd.addColorStop(g.steps[i].at, g.steps[i].color);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, _super.width, _super.height);
  }
  if (_super.html) {
    _super.htmlLoaded = false;
    _super.bitmapData = false;
  }
  if (_super.plane && window.CanvasPlaneInit) {
    CanvasPlaneInit.call(_super);
  }
  _super.setImage = function(img) {
    _super.imageLoaded = false;
    _super.imageLoading = false;
    _super.image = img;
    _super.bitmapData = false;
  };
  _super.globalToLocal = function(inputDelta, offsetCamera) {
    var delta = Object.assign({}, inputDelta);
    if (offsetCamera) {
      var zF = 1 / offsetCamera.zFactor(_super.z - offsetCamera.z);
    } else {
      var zF = 1 / _super.zFactor;
    }
    var w = _super.root.width;
    var h = _super.root.height;
    var startLeft = -w * 0.5 * zF;
    var startTop = -h * 0.5 * zF;
    var offsetLeft, offsetTop, width, height;
    if ("x" in delta) {
      if (typeof delta.x === "string" && delta.x.indexOf("%") > -1) {
        delta.x = parseFloat(delta.x);
        offsetLeft = w * (delta.x / 100) * zF;
      } else {
        delta.x = parseFloat(delta.x);
        offsetLeft = delta.x * zF;
      }
      _super.x = startLeft + offsetLeft;
      if (delta.round === true) {
        _super.x = Math.round(_super.x);
      }
    }
    if (offsetCamera) {
      _super.x += offsetCamera.x;
    }
    if ("y" in delta) {
      if (typeof delta.y === "string" && delta.y.indexOf("%") > -1) {
        delta.y = parseFloat(delta.y);
        offsetTop = h * (delta.y / 100) * zF;
      } else {
        delta.y = parseFloat(delta.y);
        offsetTop = delta.y * zF;
      }
      _super.y = startTop + offsetTop;
      if (delta.round === true) {
        _super.y = Math.round(_super.y);
      }
    }
    if (offsetCamera) {
      _super.y += offsetCamera.y;
    }
    if ("height" in delta) {
      if (typeof delta.height === "string" && delta.height.indexOf("%") > -1) {
        delta.height = parseFloat(delta.height);
        height = h * (delta.height / 100) * zF;
      } else {
        delta.height = parseFloat(delta.height);
        height = delta.height * zF;
      }
      _super.height = height;
      if (delta.round === true) {
        _super.height = Math.round(_super.height);
      }
    }
    if ("width" in delta) {
      if (typeof delta.width === "string" && delta.width.indexOf("%") > -1) {
        delta.width = parseFloat(delta.width);
        width = w * (delta.width / 100) * zF;
      } else {
        delta.width = parseFloat(delta.width);
        width = delta.width * zF;
      }
      _super.width = width;
      if (delta.round === true) {
        _super.width = Math.round(_super.width);
      }
    }
  };
  return _super;
}
export {
  CanvasElement2 as CanvasElement,
  CanvasStage,
  UIEventTypes,
  clamp2 as clamp,
  rad,
  rand
};

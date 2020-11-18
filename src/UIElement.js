import { CanvasEvent } from './CanvasEvent';

var UIELEMENT_UNIQUEID = 0;

export function UIElement(props) {
  var self = this;

  this.id = '';
  this.___uniqueid = UIELEMENT_UNIQUEID++;
  // 3d position data
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
  // 3d position data including inherited values
  this._x = 0;
  this._y = 0;
  this._z = 0;
  this._width = 0;
  this._height = 0;
  this._scale = 1;
  this._visible = true;
  this._alpha = 1;
  this._rotation = 0;
  // draw rectangle
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

  //
  // START - ROOT SPECIFIC - not used for nodes
  //

  this.root = self;
  this.rootArray = [];

  function addRootNode(e) {
    self.rootArray.push(e);
    sortRootNodes();
  }

  function sortNodes(arr) {
    arr.sort(function (a, b) {
      return a._z < b._z ? -1 : a._z > b._z ? 1 : 0;
    });
  }

  var sortRootNodesTimeout = false;

  function sortRootNodes(instant) {
    if (instant === true) {
      self.root.rootArray.sort(function (a, b) {
        return a._z < b._z ? -1 : a._z > b._z ? 1 : a.___uniqueid > b.___uniqueid ? -1 : a.___uniqueid < b.___uniqueid ? 1 : 0;
      });
      sortRootNodesTimeout = false;
    } else {
      if (sortRootNodesTimeout === false) {
        sortRootNodesTimeout = setTimeout(function () {
          sortRootNodes(true);
        }, 1);
      }
    }
  }

  //
  // END - ROOT SPECIFIC
  //

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
    if (c.viewport === false) c.viewport = self.viewport;
    self.children.push(c);
    sortChildren();
    self.root.addRootNode(c);
    return c;
  }

  function removeChild(e) {
    var c = e.parent.children;
    if (!c) {
      // console.warn('parent has no children','self',e,'parent',e.parent)
      return;
    }
    var i = c.length;
    while (i--) {
      if (c[i] == e) {
        c.splice(i, 1);
        e.__remove = true; // remove from displayList (rootArray) happens in CanvasStage
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
    // need to toggle mouseEnabled
    return self;
  }

  function trigger(evt, bubble) {
    if (evt.className != 'UIEvent') {
      evt = new CanvasEvent(evt);
    }
    if (evt.currentTarget === false) {
      evt.currentTarget = self;
    }
    evt.target = self;
    //if(self.willTrigger(evt)){
    if (listeners[evt.type]) {
      var i = listeners[evt.type].length;
      while (i--) {
        listeners[evt.type][i].call(self, evt);
      }
    }

    if (evt.type === UIEventTypes.DOWN && self.draggable === true) {
      // && evt.currentTarget===self){
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

  function setProperty(props) {
    if (props) {
      for (var e in props) {
        self[e] = props[e];
      }
      //self.trigger({type:'change'});
      if (typeof self.root === 'object') {
        self.root.changed = true;
      }

      //edited
      if ('image' in props) {
        //if(self.id == "poster_slider_button1") console.log("1111112");
        if (self.img) {
          self.img.src = self.image;
        }
      }

      if ('width' in props || 'height' in props) {
        //self.trigger({type:'resize'});
      }

      if ('z' in props) {
        self.trigger({ type: 'zchange' });
      }

      if ('viewport' in props) {
        //console.log('set vp');
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

  this.update = function () {};
  this.render = function () {};
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

export function UIEvent(evt) {
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

export var UIEventTypes = {
  DRAG_START: 'drag_start',
  DRAG: 'drag',
  DRAG_EASE: 'drag_ease',
  DRAG_END: 'drag_end',
  WHEEL: 'wheel',
  MOVE: 'move',
  OVER: 'over',
  OUT: 'out',
  DOWN: 'down',
  UP: 'up',
  ENTER: 'enter',
  LEAVE: 'leave',
  ENTER_STAGE: 'enter_stage',
  LEAVE_STAGE: 'leave_stage',
  CLICK: 'click',
  REMOVED: 'removed',
  CHANGED: 'changed',
  UPDATED: 'updated',
  PROGRESS: 'progress',
};

export function UIMouse(config) {
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
  var hasTouch = 'ontouchstart' in window && !/hp-tablet/gi.test(navigator.appVersion);

  /*
	var CustomUIEvent = {
		DOWN:hasTouch ? 'touchstart' : 'mousedown',
		MOVE:hasTouch ? 'touchmove' : 'mousemove',
		UP:hasTouch ? 'touchend' : 'mouseup',
		LEAVE:hasTouch ? 'touchcancel' : 'mouseleave',
		WHEEL:'mousewheel'
	};
	*/
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
    };
    return EVENTS[str] || '';
  }

  function handleMouse(e) {
    e.preventDefault();
    fixMouseEvent(e);
    // var offset = $(_targ).offset();
    var rect = _targ.getBoundingClientRect();
    var offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };

    self.position.x = e.pageX - offset.left;
    self.position.y = e.pageY - offset.top;
    var EVENT = new CanvasEvent({ type: UIEventLookup(e.type), mouse: self, pageX: self.position.x, pageY: self.position.y });

    switch (EVENT.type) {
      case UIEventTypes.WHEEL:
        // console.log(e)
        EVENT.deltaFactor = e.originalEvent && e.originalEvent.deltaFactor ? e.originalEvent.deltaFactor : 1;
        EVENT.deltaX = 'deltaX' in e ? e.deltaX : e.originalEvent.deltaX;
        EVENT.deltaY = 'deltaY' in e ? e.deltaY : e.originalEvent.deltaY;
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

    // over/out event

    if (self.isDown === false) {
      var EVENT_OVER = new CanvasEvent({ type: UIEventTypes.OVER, mouse: self, pageX: self.position.x, pageY: self.position.y });
      var OVER_TARGET = getFirstHit(EVENT_OVER);

      if (OVER_TARGET !== null && LAST_OVER_TARGET !== OVER_TARGET) {
        if (LAST_OVER_TARGET !== false) {
          _targ.classList.remove('cursor-pointer');
          // $(_targ).removeClass();
          var EVENT_OUT = new CanvasEvent({ type: UIEventTypes.OUT, mouse: self, pageX: self.position.x, pageY: self.position.y });
          LAST_OVER_TARGET.trigger(EVENT_OUT);
        }
        if (OVER_TARGET.willTrigger(EVENT_OVER)) {
          OVER_TARGET.trigger(EVENT_OVER);
          _targ.classList.add('cursor-pointer');
          // $(_targ).addClass('cursor-pointer');
        }
        LAST_OVER_TARGET = OVER_TARGET;
      }
    }

    // default event
    var hit = getFirstHit(EVENT);
    hit = getDeepHit(hit, EVENT);
    hit.trigger(EVENT);

    if (hit.willTrigger({ type: UIEventTypes.CLICK })) {
      // $(_targ).addClass('cursor-pointer');
      _targ.classList.add('cursor-pointer');
    }

    // click event
    // note: click can be stoppe with a stopPropagation on the up event
    if (EVENT._stopPropagation === false && EVENT.type === UIEventTypes.UP && self.vector.maxLength < 3) {
      var EVENT_CLICK = new CanvasEvent({ type: UIEventTypes.CLICK, mouse: self, pageX: self.position.x, pageY: self.position.y });

      hit.trigger(EVENT_CLICK);

      // tracking
      if (self.onAfterClick !== false) {
        self.onAfterClick(hit);
      }
    }
  }

  function getFirstHit(e) {
    var hit = _root;
    for (var i = 0; i < _root.rootArray.length; i++) {
      var c = _root.rootArray[i];
      //if(c.mouseEnabled){// && c.willTrigger(e)){
      if (c.hitTest(e.pageX, e.pageY) && (c.viewport === false || c.viewport.hitTest(e.pageX, e.pageY))) {
        hit = c;
        break;
      }
      //}
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

  if (hasTouch) {
    _targ.addEventListener('touchstart', handleMouse);
    _targ.addEventListener('touchmove', handleMouse);
    _targ.addEventListener('touchend', handleMouse);
    _targ.addEventListener('touchcancel', handleMouse);
    // $(_targ).on('touchstart touchmove touchend touchcancel',handleMouse);
  } else {
    _targ.addEventListener('mousewheel', handleMouse);
    _targ.addEventListener('mousedown', handleMouse);
    _targ.addEventListener('mousemove', handleMouse);
    _targ.addEventListener('mouseup', handleMouse);
    _targ.addEventListener('mouseleave', handleMouse);
    // $(_targ).on('mousewheel mousedown mousemove mouseup mouseleave',handleMouse);
  }
}

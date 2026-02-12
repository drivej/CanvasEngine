"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasStage = CanvasStage;
const CanvasBounds_1 = require("./CanvasBounds");
const gsap_1 = require("gsap");
const CanvasCamera_1 = require("./CanvasCamera");
const UIElement_1 = require("./UIElement");
function CanvasStage(config) {
    var self = this;
    this.dragX = true;
    this.dragY = true;
    this.dragZ = true;
    this.userBounds = new CanvasBounds_1.CanvasBounds();
    this.cameraBounds = new CanvasBounds_1.CanvasBounds();
    this.maxWidth = Infinity;
    this.maxHeight = Infinity;
    this.dragFactor = 1;
    var TweenEngine = gsap_1.gsap;
    var _config = Object.assign({
        width: 100,
        height: 100,
        wheelZoom: true,
        mouseEnabledX: true,
        mouseEnabledY: true,
        mouseEnabledZ: true,
        fillStyle: '#FFF',
        fullscreen: true,
    }, config);
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
    this.camera = new CanvasCamera_1.CanvasCamera({ stage: this });
    var cam = this.camera;
    var cvs = (this.cvs = document.createElement('canvas'));
    var ctx = (this.ctx = cvs.getContext('2d', { alpha: true }));
    var win = {
        width: 0,
        height: 0,
    };
    var resizeTimeout;
    function updateWindowSize(instant) {
        if (instant !== true) {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function () {
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
    this.root = new UIElement_1.UIElement({
        root: true,
        id: 'stage',
        width: _config.width,
        height: _config.height,
        ctx: ctx,
        camera: self.camera,
        parent: false,
        changed: true,
    });
    this.mouse = _config.mouseEnabled !== false ? new UIElement_1.UIMouse({ target: cvs, root: this.root }) : false;
    var elementIdRef = {};
    function getVisibleElements() {
        return self.root.rootArray.filter(function (n) {
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
        e.trigger(UIElement_1.UIEventTypes.UPDATED, false);
        if (e.beforeUpdate)
            e.beforeUpdate.call(e);
        if (e.physics === true) {
            e.x += e.vector.x;
            e.y += e.vector.y;
            e.z += e.vector.z;
            e.vector.x *= e.friction.x;
            e.vector.y *= e.friction.y;
            e.vector.z *= e.friction.z;
        }
        if (e.position === 'fixed') {
            e._onstage = false;
            e._visible = e.visible;
            if (e._visible) {
                e.__x = e.right !== false ? e.root.width - e.width : e.x;
                e.__y = e.y;
                if (e.bottom !== false) {
                    e.__y = e.root.height - (e.height + e.bottom);
                }
                else if (e.verticalAlign !== false) {
                    switch (e.verticalAlign) {
                        case 'middle':
                            e.__y = (e.root.height - e.height) * 0.5;
                            break;
                        case 'bottom':
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
        }
        else {
            if (e.parent) {
                var p = e.parent;
                e._visible = p._visible ? e.visible : false;
                if (e.right !== false) {
                    e._x = p._x + p.width - (e.width + e.right);
                }
                else {
                    e._x = p._x + e.x;
                }
                e._y = p._y + e.y;
                e._z = p._z + e.z;
                e._rotation = p._rotation + e.rotation;
                e._scale = p._scale * e.scale;
                e._alpha = p._alpha * e.alpha;
                e.__z = e._z - cam.z;
                e._onstage = false;
                // e._onstage = true; // test
                if (e._visible === true && e.__z > 0) {
                    if (e.__lastZ !== e.__z) {
                        e.zFactor = cam.zFactor(e.__z);
                        e.__lastZ = e.__z;
                    }
                    var r = self.root;
                    e.__x = cam.offsetX + (e._x - cam.x) * e.zFactor;
                    if (e.__x < r.width || e.repeatX === true) {
                        e.__y = cam.offsetY + (e._y - cam.y) * e.zFactor;
                        // if(e.__y<r.height || e.repeatY===true){
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
                    // not the best but solves the issue of the plane disappearing before it's off the screen
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
                            bottom: e.__y + e.__height * 2,
                        };
                        e._onstage = rect.right > 0 && rect.bottom > 0 && rect.x < r.width && rect.y < r.height;
                    }
                    if (e._onstage === true && cam.fog.active === true) {
                        if (e.__z > cam.fog.start) {
                            if (e.__z < cam.fog.end) {
                                cam.fog.range = cam.fog.end - cam.fog.start;
                                e._alpha *= (cam.fog.end - e.__z) / cam.fog.range;
                            }
                            else {
                                e._alpha = 0;
                            }
                            //   console.log('e._alpha', e._alpha);
                        }
                    }
                }
            }
        }
        // handle linked div
        if (e.div !== false && e._onstage === false) {
            e.div.style.visibility = 'hidden';
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
        // refresh background
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        // ctx.globalAlpha = .3
        ctx.fillStyle = _config.fillStyle;
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        // traverse tree for inherited values
        updateTree(r);
        while (k--) {
            e = a[k];
            if (e.onstage !== e._onstage) {
                if (e._onstage && e.willTrigger({ type: UIElement_1.UIEventTypes.ENTER_STAGE })) {
                    e.trigger(UIElement_1.UIEventTypes.ENTER_STAGE);
                }
                else if (e.willTrigger({ type: UIElement_1.UIEventTypes.LEAVE_STAGE })) {
                    e.trigger(UIElement_1.UIEventTypes.LEAVE_STAGE);
                }
            }
            e.onstage = e._onstage;
            if (e.onstage) {
                if (e.willTrigger({ type: UIElement_1.UIEventTypes.PROGRESS })) {
                    var p = (e.__y + e.height) / (e.root.height + e.height);
                    if (p != e.progress) {
                        e.progress = p;
                        e.trigger(UIElement_1.UIEventTypes.PROGRESS);
                    }
                }
                if (e.smoothing === false) {
                    e.__x = (e.__x + 0.5) | 0;
                    e.__y = (e.__y + 0.5) | 0;
                    e.__width = (e.__width + 0.5) | 0;
                    e.__height = (e.__height + 0.5) | 0;
                }
                e._render();
            }
            if (e.__remove === true) {
                remove.unshift(k);
                e.trigger(UIElement_1.UIEventTypes.REMOVED);
            }
        }
        if (remove.length > 0) {
            k = remove.length;
            while (k--) {
                a.splice(remove[k], 1);
            }
        }
    }
    this.startRender = function () {
        TweenEngine.ticker.add(render);
    };
    this.stopRender = function () {
        TweenEngine.ticker.remove(render);
        render();
    };
    this.root.on('zchange', function (e) {
        this.sortRootNodes();
    });
    this.root.dragTarget = false;
    if (this.mouse) {
        this.root.on(UIElement_1.UIEventTypes.DOWN, function (e) {
            this.mouseData = {
                down: {
                    x: self.camera.x,
                    y: self.camera.y,
                },
            };
        });
        this.root.on(UIElement_1.UIEventTypes.DRAG, function (e) {
            var dragCamera = false;
            var t = this.dragTarget;
            if (this.dragTarget !== this && this.dragTarget !== false) {
                var doDrag = false;
                if (t.smartDrag) {
                    if (self.dragY !== false && Math.abs(e.mouse.vector.x) < Math.abs(e.mouse.vector.y)) {
                        self.camera.moveTo(self.userBounds.clamp({ y: this.mouseData.down.y - e.mouse.vector.y }));
                    }
                    else {
                        doDrag = true;
                    }
                }
                else {
                    doDrag = true;
                }
                if (doDrag) {
                    var position = {
                        x: t.mouseData.down.x + e.mouse.vector.x * (1 / t.zFactor),
                        y: t.mouseData.down.y + e.mouse.vector.y * (1 / t.zFactor),
                    };
                    if (t.dragBounds) {
                        if (t.dragBounds === 'parent') {
                            t.dragBounds = {
                                minX: Math.min(0, t.parent.width - t.width),
                                maxX: Math.max(0, t.parent.width - t.width),
                                minY: Math.min(0, t.parent.height - t.height),
                                maxY: Math.max(0, t.parent.height - t.height),
                            };
                        }
                        position.x = clamp(position.x, t.dragBounds.minX, t.dragBounds.maxX);
                        position.y = clamp(position.y, t.dragBounds.minY, t.dragBounds.maxY);
                    }
                    TweenEngine.to(t, {
                        duration: 0.3,
                        x: position.x,
                        y: position.y,
                        onUpdate: function () {
                            t.trigger(UIElement_1.UIEventTypes.DRAG_EASE);
                        },
                        onComplete: function () {
                            t.trigger(UIElement_1.UIEventTypes.DRAG_END);
                        },
                    });
                    //TweenEngine.set(t,{x:position.x, y:position.y});
                }
            }
            else {
                dragCamera = true;
            }
            if (dragCamera === true) {
                self.camera.moveTo(self.userBounds.clamp({
                    x: this.mouseData.down.x - e.mouse.vector.x * self.dragFactor,
                    y: this.mouseData.down.y - e.mouse.vector.y * self.dragFactor,
                }));
            }
        });
        this.root.on(UIElement_1.UIEventTypes.UP, function (e) {
            this.lastDragTarget = this.dragTarget;
            if (this.dragTarget) {
                this.dragTarget.trigger(UIElement_1.UIEventTypes.DRAG_END);
            }
            this.dragTarget = false;
        });
        this.root.on(UIElement_1.UIEventTypes.LEAVE, function (e) {
            this.lastDragTarget = this.dragTarget;
            if (this.dragTarget) {
                this.dragTarget.trigger(UIElement_1.UIEventTypes.DRAG_END);
            }
            this.dragTarget = false;
        });
        this.root.on(UIElement_1.UIEventTypes.WHEEL, function (e) {
            if (e.mouse.isDown && this.dragTarget !== this && this.dragTarget !== false) {
                this.dragTarget.setProperty({ z: this.dragTarget.z + e.deltaY * e.deltaFactor * 0.5 });
            }
            else {
                //zooming effect
                if (_config.wheelZoom && self.dragZ !== false) {
                    //console.log('z delta',(e.deltaY*e.deltaFactor*1))
                    self.camera.moveTo(self.userBounds.clamp({ z: self.camera.z + e.deltaY * e.deltaFactor * 1 }));
                }
                //moving up and down
                else if (self.dragY !== false) {
                    self.camera.moveTo(self.userBounds.clamp({ y: self.camera.y - e.deltaY * e.deltaFactor * 2 }));
                }
            }
        });
    }
    this.setSize = function (w, h) {
        var _w = Math.min(self.maxWidth, w);
        var _h = Math.min(self.maxHeight, h);
        cvs.width = _w;
        cvs.height = _h;
        self.camera.offsetX = Math.round(_w * 0.5);
        self.camera.offsetY = Math.round(_h * 0.5);
        self.root.width = _w;
        self.root.height = _h;
        if (_w < w) {
            self.cvs.style.left = '50%';
            self.cvs.style.marginLeft = Math.round(-_w * 0.5) + 'px';
        }
        else {
            self.cvs.style.left = '';
            self.cvs.style.marginLeft = '';
        }
    };
    //
    // import from json data
    //
    this.allImages = [];
    this.preloadImages = [];
    this.nonPreloadImages = [];
    this.importData = function (data) {
        insertElement(data, self);
        setTimeout(function () {
            self.root.sortRootNodes();
        }, 1);
    };
    var insertElement = function (c, p) {
        // console.log('insertElement',c);
        if (p == null) {
            p = self;
        }
        var id = '';
        if (!c.id && c.image) {
            id = c.image.split('/').pop().split('.')[0];
        }
        if (c.image) {
            if (c.preload) {
                self.preloadImages.push(c.image);
            }
            else {
                self.nonPreloadImages.push(c.image);
            }
            self.allImages.push(c.image);
        }
        // this is generally the case with our framework
        if (window.assetsDirectory && c.image && c.image.indexOf(assetsDirectory) == -1 && c.image.indexOf('data:image') !== 0) {
            c.image = assetsDirectory + c.image;
        }
        p = p.addChild(new CanvasElement(Object.assign({ id: id, smoothing: true }, c, { children: [] })));
        // add events from string references
        for (var e in UIElement_1.UIEventTypes) {
            var evt = UIElement_1.UIEventTypes[e];
            if (c[evt]) {
                if (CanvasEventHandlers[c[evt]]) {
                    p['__' + evt] = c[evt];
                    p.on(evt, CanvasEventHandlers[c[evt]]);
                }
                else if (typeof c[evt] === 'function') {
                    p['__' + evt] = 'INLINE';
                    p.on(evt, c[evt]);
                }
            }
        }
        // why is update event different than all the others??
        evt = 'update';
        if (c[evt]) {
            if (CanvasEventHandlers[c[evt]]) {
                p['__' + evt] = c[evt];
                p.update = CanvasEventHandlers[c[evt]];
            }
            else if (typeof c[evt] === 'function') {
                p.update = c[evt];
            }
        }
        // add children
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
    //this.setUserBounds = setUserBounds;
    this.render = render;
    this.setFillStyle = setFillStyle;
    this.setSize(_config.width, _config.height);
    updateWindowSize(true);
    window.addEventListener('resize', updateWindowSize);
    this.startRender();
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasElement = CanvasElement;
const CanvasElementRenderer_1 = require("./CanvasElementRenderer");
const UIElement_1 = require("./UIElement");
function CanvasElement(config) {
    var _super = new UIElement_1.UIElement(Object.assign({
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
        render: CanvasElementRenderer_1.CanvasElementRenderer,
    }, config));
    if (_super.vector !== false) {
        _super.alwaysRender = true;
        _super.physics = _super.physics === null ? true : _super.physics;
        _super.vector = Object.assign({ x: 0, y: 0, z: 0 }, _super.vector || {});
        _super.friction = Object.assign({ x: 1, y: 1, z: 1 }, _super.friction || {});
    }
    else {
        _super.physics = false;
    }
    if (_super.image) {
        _super.imageLoading = false;
        _super.imageLoaded = false;
        if (_super.width === 0) {
            _super.autoSize = true;
        }
    }
    else {
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
        // normalize object
        _super.linearGradient.start = _super.linearGradient.start || {};
        _super.linearGradient.start.x = _super.linearGradient.start.x || 0;
        _super.linearGradient.start.y = _super.linearGradient.start.y || 0;
        _super.linearGradient.end = _super.linearGradient.end || {};
        _super.linearGradient.end.x = _super.linearGradient.end.x || 0;
        _super.linearGradient.end.y = _super.height || 0;
        if (!_super.linearGradient.start) {
            _super.linearGradient.start;
        }
        // {start:{x:0, y:700}, end:{x:0, y:0}, steps:[{at:0, color:'#DEE8EB'},{at:.8, color:'#DEE8EB'},{at:1, color:'#FFF'}]},
        _super.bitmapData = document.createElement('canvas');
        _super.bitmapData.width = _super.width;
        _super.bitmapData.height = _super.height;
        var ctx = _super.bitmapData.getContext('2d');
        var g = _super.linearGradient;
        var grd = ctx.createLinearGradient(g.start.x, g.start.y, g.end.x, g.end.y);
        for (var i = 0; i < g.steps.length; i++) {
            grd.addColorStop(g.steps[i].at, g.steps[i].color);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, _super.width, _super.height);
    }
    else if (_super.radialGradient) {
        // {start:{x:0, y:700, radius:10}, end:{x:0, y:0, radius:100}, steps:[{at:0, color:'#DEE8EB'},{at:.8, color:'#DEE8EB'},{at:1, color:'#FFF'}]},
        _super.bitmapData = document.createElement('canvas');
        _super.bitmapData.width = _super.width;
        _super.bitmapData.height = _super.height;
        var ctx = _super.bitmapData.getContext('2d');
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
        //_super.render = CanvasTextRenderer;
    }
    if (_super.plane && window.CanvasPlaneInit) {
        CanvasPlaneInit.call(_super);
    }
    // convenience function to update image src
    _super.setImage = function (img) {
        _super.imageLoaded = false;
        _super.imageLoading = false;
        _super.image = img;
        _super.bitmapData = false;
    };
    _super.globalToLocal = function (inputDelta, offsetCamera) {
        var delta = Object.assign({}, inputDelta);
        // offsetCamera = Object.assign({x:0, y:0, z:0},offsetCamera || {})
        if (offsetCamera) {
            var zF = 1 / offsetCamera.zFactor(_super.z - offsetCamera.z);
        }
        else {
            var zF = 1 / _super.zFactor;
        }
        var w = _super.root.width;
        var h = _super.root.height;
        var startLeft = -w * 0.5 * zF;
        var startTop = -h * 0.5 * zF;
        var offsetLeft, offsetTop, width, height;
        if ('x' in delta) {
            if (typeof delta.x === 'string' && delta.x.indexOf('%') > -1) {
                delta.x = parseFloat(delta.x);
                offsetLeft = w * (delta.x / 100) * zF;
            }
            else {
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
        if ('y' in delta) {
            if (typeof delta.y === 'string' && delta.y.indexOf('%') > -1) {
                delta.y = parseFloat(delta.y);
                offsetTop = h * (delta.y / 100) * zF;
            }
            else {
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
        if ('height' in delta) {
            if (typeof delta.height === 'string' && delta.height.indexOf('%') > -1) {
                delta.height = parseFloat(delta.height);
                height = h * (delta.height / 100) * zF;
            }
            else {
                delta.height = parseFloat(delta.height);
                height = delta.height * zF;
            }
            _super.height = height;
            if (delta.round === true) {
                _super.height = Math.round(_super.height);
            }
        }
        if ('width' in delta) {
            if (typeof delta.width === 'string' && delta.width.indexOf('%') > -1) {
                delta.width = parseFloat(delta.width);
                width = w * (delta.width / 100) * zF;
            }
            else {
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

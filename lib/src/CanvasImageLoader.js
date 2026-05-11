"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasImageLoader = CanvasImageLoader;
const LoaderMax_1 = require("./LoaderMax");
function CanvasImageLoader() {
    if (this.imageLoaded !== true) {
        if (this.imageLoading === false) {
            if (this.image.indexOf('data:image') === 0) {
                // import encoded image
                var ref = this;
                var img = new Image();
                img.onload = function () {
                    if (!this.complete) {
                        console.log('INCOMPLETE LOAD');
                    }
                    handleLoadCanvasImage([{ img: this }], ref);
                };
                img.src = this.image;
            }
            else {
                var img = LoaderMax_1.LoaderMax.getImage(this.image);
                if (img) {
                    handleLoadCanvasImage([img], this);
                }
                else {
                    LoaderMax_1.LoaderMax.load({
                        images: this.image,
                        onComplete: handleLoadCanvasImage,
                        onCompleteParams: [this],
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
    //imgs[0].img.crossOrigin = "Anonymous";
    if (ref.autoSize === true || ref.width === 0 || ref.height === 0) {
        ref.width = imgs[0].width;
        ref.height = imgs[0].height;
    }
    //setTimeout(function(){
    ref.bitmapData = imgs[0].img;
    //},1);
}

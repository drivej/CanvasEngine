'use strict';

// import { CanvasTextRenderer } from './CanvasTextRenderer';

// export function CanvasImageLoader() {
//   if (this.imageLoaded !== true) {
//     if (this.imageLoading === false) {
//       if (this.image.indexOf('data:image') === 0) {
//         // import encoded image
//         var ref = this;
//         var img = new Image();
//         img.onload = function () {
//           if (!this.complete) {
//             console.log('INCOMPLETE LOAD');
//           }
//           handleLoadCanvasImage([{ img: this }], ref);
//         };
//         img.src = this.image;
//       } else {
//         var img = LoaderMax.getImage(this.image);
//         if (img) {
//           handleLoadCanvasImage([img], this);
//         } else {
//           LoaderMax.load({
//             images: this.image,
//             onComplete: handleLoadCanvasImage,
//             onCompleteParams: [this],
//           });
//         }
//       }
//       this.imageLoading = true;
//     }
//   }
// }

// function handleLoadCanvasImage(imgs, ref) {
//   ref.imageLoading = false;
//   ref.imageLoaded = true;
//   //imgs[0].img.crossOrigin = "Anonymous";
//   if (ref.autoSize === true || ref.width === 0 || ref.height === 0) {
//     ref.width = imgs[0].width;
//     ref.height = imgs[0].height;
//   }
//   //setTimeout(function(){
//   ref.bitmapData = imgs[0].img;
//   //},1);
// }

export const rad = Math.PI / 180;
export const _rad = 180 / Math.PI;

// var LoaderMax = (function () {
//   var cache = {};
//   var queue = [];
//   var STATE = {
//     IDLE: 0,
//     LOADING: 0,
//     LOADED: 1,
//   };

//   function load(config) {
//     if (!Array.isArray(config.images)) {
//       config.images = [config.images];
//     }
//     if (!Array.isArray(config.onCompleteParams)) {
//       config.onCompleteParams = [];
//     }
//     if (typeof config.onComplete !== 'function') {
//       config.onComplete = function () {};
//     }
//     // remove empty images
//     config.images = config.images.filter(function (e) {
//       return String(e).length > 0;
//     });
//     for (var i = 0; i < config.images.length; i++) {
//       var img = String(config.images[i]);
//       if (config.pattern) {
//         img = config.pattern.replace('%IMAGE%', img);
//       }
//       if (config.root) {
//         img = config.root + img;
//       }
//       config.images[i] = img;
//       loadImage(img);
//     }
//     queue.unshift(config);
//     checkQueue();
//   }

//   function getLoadedImages() {
//     var a = [];
//     for (var e in cache) {
//       a.push(e);
//     }
//     return a;
//   }

//   function getImage(src) {
//     if (isCached(src)) {
//       return cache[src];
//     }
//     return false;
//   }

//   function isCached(src) {
//     return src in cache;
//   }

//   function isLoaded(src) {
//     return cache[src] && cache[src].state == STATE.LOADED;
//   }

//   function loadImage(src) {
//     if (!isCached(src)) {
//       var img = new Image();
//       img.addEventListener('load', handleLoadImage, false);
//       img.setAttribute('orig_src', src);
//       cache[src] = { src: src, img: img, state: STATE.LOADING };
//       img.src = src;
//     } else {
//       checkQueue();
//     }
//   }

//   function handleLoadImage() {
//     var src = this.getAttribute('orig_src');
//     if (cache[src]) {
//       cache[src].state = STATE.LOADED;
//     }
//     checkQueue();
//   }

//   function checkQueue() {
//     var i = queue.length;
//     while (i--) {
//       var loaded = true;
//       var imgs = [];
//       for (var ii = 0; ii < queue[i].images.length; ii++) {
//         if (cache[queue[i].images[ii]].state == STATE.LOADING) {
//           loaded = false;
//           break;
//         } else {
//           var o = cache[queue[i].images[ii]];
//           o.width = o.img.width;
//           o.height = o.img.height;
//           o.squareWidth = Math.min(o.width, o.height);
//           o.squareX = (o.width - o.squareWidth) * 0.5;
//           o.squareY = (o.height - o.squareWidth) * 0.5;
//           imgs.push(o);
//         }
//       }
//       if (loaded) {
//         var q = queue.splice(i, 1);
//         q[0].onComplete.apply(this, [imgs].concat(q[0].onCompleteParams || []));
//       }
//     }
//   }

//   return {
//     load: load,
//     getLoadedImages: getLoadedImages,
//     getImage: getImage,
//   };
// })();

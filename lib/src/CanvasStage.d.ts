/**
 * @param {Object} config - The configuration object.
 * @param {number} config.width - The width of the element.
 * @param {number} config.height - The height of the element.
 * @param {boolean} config.wheelZoom - Whether wheel zoom is enabled.
 * @param {boolean} config.mouseEnabledX - Enable mouse interaction on X axis.
 * @param {boolean} config.mouseEnabledY - Enable mouse interaction on Y axis.
 * @param {boolean} config.mouseEnabledZ - Enable mouse interaction on Z axis.
 * @param {string} config.fillStyle - The CSS color for the fill style.
 * @param {boolean} config.fullscreen - Whether to enable fullscreen mode.
 */
export class CanvasStage {
    constructor(config: any);
    dragX: boolean;
    dragY: boolean;
    dragZ: boolean;
    userBounds: CanvasBounds;
    cameraBounds: CanvasBounds;
    maxWidth: any;
    maxHeight: any;
    dragFactor: number;
    camera: CanvasCamera;
    cvs: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    root: UIElement;
    mouse: boolean | UIMouse;
    startRender: () => void;
    stopRender: () => void;
    setSize: (w: any, h: any) => void;
    allImages: any[];
    preloadImages: any[];
    nonPreloadImages: any[];
    importData: (data: any) => void;
    getElementById: (id: any) => any;
    getVisibleElements: () => any[];
    addChild: (c: any) => any;
    on: (evt: any, func: any) => UIElement;
    trigger: (evt: any, bubble: any) => void;
    setProperty: (props: any) => void;
    render: () => void;
    setFillStyle: (f: any) => void;
}
import { CanvasBounds } from './CanvasBounds';
import { CanvasCamera } from './CanvasCamera';
import { UIElement } from './UIElement';
import { UIMouse } from './UIElement';

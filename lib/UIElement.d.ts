export function UIElement(props: any): void;
export class UIElement {
    constructor(props: any);
    id: string;
    ___uniqueid: number;
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    scale: number;
    visible: boolean;
    alpha: number;
    rotation: number;
    rotationX: number;
    rotationY: number;
    _x: number;
    _y: number;
    _z: number;
    _width: number;
    _height: number;
    _scale: number;
    _visible: boolean;
    _alpha: number;
    _rotation: number;
    __x: number;
    __y: number;
    __z: number;
    __width: number;
    __height: number;
    viewport: any;
    mouseEnabled: boolean;
    smoothing: boolean;
    onstage: boolean;
    parent: boolean;
    children: any[];
    parentChain: any[];
    __remove: boolean;
    root: this;
    rootArray: any[];
    update: () => void;
    render: () => void;
    _render: () => void;
    trigger: (evt: any, bubble: any) => void;
    willTrigger: (evt: any) => any;
    on: (evt: any, func: any) => this;
    off: (evt: any, func: any) => this;
    setProperty: (props: any) => void;
    addChild: (c: any) => any;
    removeChild: (e: any) => void;
    remove: () => void;
    hitTest: (x: any, y: any) => boolean;
    getElementById: (id: any) => any;
    addRootNode: ((e: any) => void) | undefined;
    sortRootNodes: ((instant: any) => void) | undefined;
}
export function UIEvent(evt: any): void;
export class UIEvent {
    constructor(evt: any);
    className: string;
    currentTarget: boolean;
    _stopPropagation: boolean;
    stopPropagation: () => void;
}
export function UIMouse(config: any): void;
export class UIMouse {
    constructor(config: any);
    currentTarget: boolean;
    isDown: boolean;
    position: {
        target: null;
        x: number;
        y: number;
    };
    down: {
        target: null;
        x: number;
        y: number;
    };
    move: {
        target: null;
        x: number;
        y: number;
    };
    up: {
        target: null;
        x: number;
        y: number;
    };
    vector: {
        x: number;
        y: number;
    };
    data: {};
    onAfterClick: boolean;
    config: any;
}
export namespace UIEventTypes {
    let DRAG_START: string;
    let DRAG: string;
    let DRAG_EASE: string;
    let DRAG_END: string;
    let WHEEL: string;
    let MOVE: string;
    let OVER: string;
    let OUT: string;
    let DOWN: string;
    let UP: string;
    let ENTER: string;
    let LEAVE: string;
    let ENTER_STAGE: string;
    let LEAVE_STAGE: string;
    let CLICK: string;
    let REMOVED: string;
    let CHANGED: string;
    let UPDATED: string;
    let PROGRESS: string;
}

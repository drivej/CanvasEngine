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
    viewport: false | UIElement;
    mouseEnabled: boolean;
    smoothing: boolean;
    onstage: boolean;
    parent: boolean;
    children: any[];
    parentChain: any[];
    __remove: boolean;
    root: UIElement;
    rootArray: any[];
    update: () => void;
    render: () => void;
    _render: () => void;
    trigger: (evt: any, bubble: any) => void;
    willTrigger: (evt: any) => boolean;
    on: (evt: any, func: any) => UIElement;
    off: (evt: any, func: any) => UIElement;
    setProperty: (props: any) => void;
    addChild: (c: any) => any;
    removeChild: (e: any) => void;
    remove: () => void;
    hitTest: (x: any, y: any) => boolean;
    getElementById: (id: any) => any;
    addRootNode: (e: any) => void;
    sortRootNodes: (instant: any) => void;
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
        target: any;
        x: number;
        y: number;
    };
    down: {
        target: any;
        x: number;
        y: number;
    };
    move: {
        target: any;
        x: number;
        y: number;
    };
    up: {
        target: any;
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
    const DRAG_START: string;
    const DRAG: string;
    const DRAG_EASE: string;
    const DRAG_END: string;
    const WHEEL: string;
    const MOVE: string;
    const OVER: string;
    const OUT: string;
    const DOWN: string;
    const UP: string;
    const ENTER: string;
    const LEAVE: string;
    const ENTER_STAGE: string;
    const LEAVE_STAGE: string;
    const CLICK: string;
    const REMOVED: string;
    const CHANGED: string;
    const UPDATED: string;
    const PROGRESS: string;
}

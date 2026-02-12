export function CanvasCamera(config: any): void;
export class CanvasCamera {
    constructor(config: any);
    x: number;
    y: number;
    z: number;
    offsetX: number;
    offsetY: number;
    focalLength: number;
    focalPower: number;
    fov: number;
    fog: {
        start: number;
        end: number;
        range: number;
    };
    moveTo: (loc: any, duration: any, ease: any) => void;
    moveToElement: (el: any, zOffset: any, duration: any, ease: any) => void;
    zFactor: (z: any) => number;
    onChange: () => void;
}

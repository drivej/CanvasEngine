export class CanvasBounds {
    constructor(config: any);
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
    set(config: any): void;
    clamp(p: any): any;
}

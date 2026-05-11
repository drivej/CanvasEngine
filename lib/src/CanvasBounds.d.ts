export class CanvasBounds {
    /**
     * @param {any} config
     */
    constructor(config: any);
    /** @type {number} */
    minX: number;
    /** @type {number} */
    maxX: number;
    /** @type {number} */
    minY: number;
    /** @type {number} */
    maxY: number;
    /** @type {number} */
    minZ: number;
    /** @type {number} */
    maxZ: number;
    /**
     * @type {(o: any) => void}
     */
    set: (o: any) => void;
    /**
     * @type {(p: any) => any}
     */
    clamp: (p: any) => any;
}

export function CanvasEvent(evt: any): void;
export class CanvasEvent {
    constructor(evt: any);
    className: string;
    currentTarget: boolean;
    _stopPropagation: boolean;
    stopPropagation: () => void;
}

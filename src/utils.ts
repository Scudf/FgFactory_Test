import { Vector2 } from "three";

export function _handlePage(event: MouseEvent | TouchEvent): Vector2 {
    let x = 0;
    let y = 0;

    const mEvent = event as MouseEvent;
    if (mEvent.clientX && mEvent) {
        x = mEvent.pageX;
        y = mEvent.pageY;
    } else {
        const tEvent = event as TouchEvent;
        x = tEvent.targetTouches[0].pageX;
        y = tEvent.targetTouches[0].pageY;
    }

    return new Vector2(x, y);
}

export function _handleClient(event: MouseEvent | TouchEvent): Vector2 {
    let x = 0;
    let y = 0;

    const mEvent = event as MouseEvent;
    if (mEvent.clientX && mEvent) {
        x = mEvent.clientX;
        y = mEvent.clientY;
    } else {
        const tEvent = event as TouchEvent;
        x = tEvent.targetTouches[0].clientX;
        y = tEvent.targetTouches[0].clientY;
    }

    return new Vector2(x, y);
}

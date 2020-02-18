import { Vector2 } from "three";

import * as utils from "../utils";

export class ScrollingButtonWrapper {
    protected _buttonWrapper: HTMLElement = null;
    protected _refButton: HTMLElement = null;
    protected _lastPressedButton: HTMLElement = null;
    
    private _isDown: boolean = false;
    private _startPos: Vector2 = new Vector2(0, 0);
    private _scrollOffset: Vector2 = new Vector2(0, 0);
    private _scrollCoeff: Vector2 = new Vector2(1, 1);

    public constructor(buttonWrapperName: string, refButtonName: string, scrollCoeff: Vector2 = new Vector2(1, 1)) {
        this._buttonWrapper = document.querySelector(buttonWrapperName);
        this._refButton = this._buttonWrapper.querySelector(refButtonName);
        
        this._scrollCoeff = scrollCoeff;
    }

    public getWrapper(): HTMLElement {
        return this._buttonWrapper;
    }

    public clenup(): void {
        for (let i = this._buttonWrapper.children.length - 1; i >= 0; i -= 1) {
            this._buttonWrapper.children[i].remove();
        }
    }

    public initScroll(xRule?: () => number, yRule?: () => number): void {
        this._buttonWrapper.addEventListener("mouseleave", () => this._isDown = false);
        this._buttonWrapper.addEventListener("mouseup", () => this._isDown = false);
        this._buttonWrapper.addEventListener("touchcancel", () => this._isDown = false);
        this._buttonWrapper.addEventListener("touchend", () => this._isDown = false);
        this._buttonWrapper.addEventListener("mousedown", (event: MouseEvent) => this._onDown(event));
        this._buttonWrapper.addEventListener("touchstart", (event: TouchEvent) => this._onDown(event));
        this._buttonWrapper.addEventListener("mousemove", (event: MouseEvent) => this._onMove(event, xRule, yRule));
        this._buttonWrapper.addEventListener("touchmove", (event: TouchEvent) => this._onMove(event, xRule, yRule));
    }

    private _onDown(event: MouseEvent | TouchEvent): void {
        this._isDown = true;

        const vec = utils._handlePage(event);
        this._startPos.x = vec.x - this._buttonWrapper.offsetLeft;
        this._startPos.y = vec.y - this._buttonWrapper.offsetTop;
        this._scrollOffset.x = this._buttonWrapper.scrollLeft;
        this._scrollOffset.y = this._buttonWrapper.scrollTop;
    }

    private _onMove(event: MouseEvent | TouchEvent, xRule?: () => number, yRule?: () => number): void {
        if (!this._isDown) {
            return;
        }

        event.preventDefault();

        const vec = utils._handlePage(event);
        const x = vec.x - this._buttonWrapper.offsetLeft;
        const y = vec.y - this._buttonWrapper.offsetTop;
        const walkX = (x - this._startPos.x) * this._scrollCoeff.x;
        const walkY = (y - this._startPos.y) * this._scrollCoeff.y;
        this._buttonWrapper.scrollLeft = xRule ? xRule() : (this._scrollOffset.x - walkX);
        this._buttonWrapper.scrollTop = yRule ? yRule() : (this._scrollOffset.y - walkY);
    }
}

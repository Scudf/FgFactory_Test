import { Vector2 } from "three";

import { GlobalConfig } from "../globalConfig";
import { ECategories } from "../player/playerBody";

import { ScrollingButtonWrapper } from "./scrollingButtonWrapper";

export class LeftButtonWrapper extends ScrollingButtonWrapper{
    public constructor(buttonWrapperName: string, refButtonName: string) {
        super(buttonWrapperName, refButtonName, new Vector2(0, 1));
    }

    public setPressedButton(pressedButton: HTMLElement): void {
        if (this._lastPressedButton) {
            const classList = this._lastPressedButton.classList;
            classList.remove(`${classList.item(0)}--selected`);
        }

        pressedButton.classList.add(`${pressedButton.classList.item(0)}--selected`);
        this._lastPressedButton = pressedButton;
    }

    public initLeftButtons(callback: (category: ECategories) => void = () => {}): void {
        for (let i = 0; i < GlobalConfig.categories.length; i += 1) {
            const txt = new Text(GlobalConfig.categories[i]);
            const newBtn = this._refButton.cloneNode() as HTMLElement;

            if (i === 0) {
                this.setPressedButton(newBtn);
            }

            newBtn.style.left += `${(GlobalConfig.categories.length - i - 2) * 10}%`;
            newBtn.appendChild(txt);
            this._buttonWrapper.appendChild(newBtn);
            newBtn.addEventListener("mouseup", () => {
                callback(i);
                this.setPressedButton(newBtn);
            });
        }

        this._refButton.remove();
        this._buttonWrapper.scrollLeft = this._buttonWrapper.scrollWidth - this._buttonWrapper.clientWidth;
    }
}

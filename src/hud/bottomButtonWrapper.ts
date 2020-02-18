import { Vector2 } from "three";

import { ExtendedScene } from "../extendedScene";
import { ECategories, EPartType, GirlClothesNames, PlayerClothesNames, PlayerGender } from "../player/playerBody";
import { TennisPlayer } from "../player/tennisPlayer";
import * as g_resources from "../resources";

import { ScrollingButtonWrapper } from "./scrollingButtonWrapper";

export namespace BottomButtonStates {
    export const n_common = "button-bottom--common";
    export const n_premium = "button-bottom--premium";
    export const n_selected = "button-bottom--selected";
}

export interface ILastPressedBtn {
    button: HTMLElement;
    class: string;
}

export class BottomButtonWrapper extends ScrollingButtonWrapper {
    private _lastPressedBtnInfo: ILastPressedBtn = null;
    private _activeButtonsId: number[] = [];
    private _lastBtnId: number = 0;

    public constructor(buttonWrapperName: string, refButtonName: string) {
        super(buttonWrapperName, refButtonName, new Vector2(1, 0));
    }

    public setPressedButton(pressedButton: HTMLElement): void {
        if (this._lastPressedBtnInfo && this._lastPressedBtnInfo.button) {
            const classList = this._lastPressedBtnInfo.button.classList;
            classList.remove(`${classList.item(0)}--selected`);

            if (this._lastPressedBtnInfo.class.length > 0) {
                classList.add(this._lastPressedBtnInfo.class);
            }
        }

        let className = "";

        for (let i = pressedButton.classList.length - 1; i > 0; i -= 1) {
            const item = pressedButton.classList.item(i);

            switch (item) {
                case BottomButtonStates.n_common:
                case BottomButtonStates.n_premium: className = item;  break;
                default: break;
            }

            pressedButton.classList.remove(pressedButton.classList.item(i));
        }

        pressedButton.classList.add(`${pressedButton.classList.item(0)}--selected`);
        
        this._lastPressedBtnInfo = {
            button: pressedButton,
            class: className
        };
    }

    public updateBottomButtons(cleanup: boolean, partType: EPartType, category: ECategories, resPool2d: any, onBtnClickCB: (btnId: number) => void): void {
        if (cleanup) {
            this.clenup();
            this._lastBtnId = 0;
        }

        let actualClassName = "";
        let anotherClassName = "";

        if (partType === EPartType.COMMON) {
            actualClassName = BottomButtonStates.n_common;
            anotherClassName = BottomButtonStates.n_premium;
        } else {
            actualClassName = BottomButtonStates.n_premium;
            anotherClassName = BottomButtonStates.n_common;
        }

        this._refButton.classList.remove(actualClassName);
        this._refButton.classList.remove(anotherClassName);
        this._refButton.classList.add(actualClassName);

        this._buttonWrapper.appendChild(this._refButton);

        let counter = 0;
        let path = resPool2d[counter.toString()];

        while (path) {
            const btnId = this._lastBtnId + counter;
            const resId = counter;

            const img = new Image();
            img.src = path;

            const height = this._refButton.offsetHeight;
            const width = this._refButton.offsetWidth;

            img.onload = () => {
                const scaleByHeight = height / img.naturalHeight;
                const scaleByWidth = width / img.naturalWidth;
                const scale = Math.min(scaleByHeight, scaleByWidth) / 1.5;

                img.style.height = `${img.naturalHeight * scale}px`;
                img.style.width = `${img.naturalWidth * scale}px`;
            };

            const newBtn = this._refButton.cloneNode() as HTMLElement;

            if (this._activeButtonsId[category] === btnId) {
                this.setPressedButton(newBtn);
            }

            newBtn.appendChild(img);
            this._buttonWrapper.appendChild(newBtn);
            newBtn.addEventListener("mouseup", () => {
                onBtnClickCB(resId);
                this.setPressedButton(newBtn);
                this._activeButtonsId[category] = btnId;
            });

            counter += 1;
            path = resPool2d[counter.toString()];
        }

        this._lastBtnId = counter;
        this._refButton.remove();
    }

    public updateBottomButtonsCategory(category: ECategories): void {
        switch (category) {
            case ECategories.SHIRT: {
                this.updateBottomButtons(true, EPartType.COMMON, category, g_resources.common_2d_shirts, (btnId) => {
                    const scene = ExtendedScene.getRunningScene();
                    const player = scene ? scene.getObjectByName(TennisPlayer.playerName).userData as TennisPlayer : null;

                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_02`).visible = false;
                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_01`).visible = true;
                    player.getBody().changeTexture(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_01`, g_resources.common_3d_shirts[btnId]);
                });

                this.updateBottomButtons(false, EPartType.PREMIUM, category, g_resources.premium_2d_shirts, (btnId) => {
                    const scene = ExtendedScene.getRunningScene();
                    const player = scene ? scene.getObjectByName(TennisPlayer.playerName).userData as TennisPlayer : null;

                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_01`).visible = false;
                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_02`).visible = true;
                    player.getBody().changeTexture(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_02`, g_resources.premium_3d_shirts[btnId]);
                });

                break;
            }
            case ECategories.SHORT: {
                this.updateBottomButtons(true, EPartType.PREMIUM, category, g_resources.premium_2d_shorts, (btnId) => {
                    const scene = ExtendedScene.getRunningScene();
                    const player = scene ? scene.getObjectByName(TennisPlayer.playerName).userData as TennisPlayer : null;

                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${GirlClothesNames.n_skirt}_01`).visible = false;
                    player.getBody().getPartByName(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shorts}_01`).visible = true;
                    player.getBody().changeTexture(`${PlayerGender.n_girl}_${PlayerClothesNames.n_shorts}_01`, g_resources.premium_3d_shorts[btnId]);
                });

                break;
            }
            default: this.clenup(); break;
        }
    }
}

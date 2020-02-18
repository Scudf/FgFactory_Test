import { ExtendedScene } from "../extendedScene";
import { ECategories, GirldBodyPartsNames, PlayerBodyPartsNames, PlayerGender } from "../player/playerBody";
import { TennisPlayer } from "../player/tennisPlayer";

import { BottomButtonWrapper } from "./bottomButtonWrapper";
import { LeftButtonWrapper } from "./leftButtonWrapper";

export class GameHud {
    private _leftButtonWrapper: LeftButtonWrapper = null;
    private _bottonButtonWrapper: BottomButtonWrapper = null;
    private _inputRange: HTMLInputElement = null;

    public constructor() {
        this.initSlider();
        this._inputRange.style.opacity = "0";

        this._leftButtonWrapper = new LeftButtonWrapper(".button-left-wrapper", ".button-left");
        this._leftButtonWrapper.initScroll(() => {
            const wrapper = this._leftButtonWrapper.getWrapper();
            const maxScrollTop = wrapper.scrollHeight - wrapper.clientHeight;
            const coeff = maxScrollTop !== 0 ? wrapper.scrollTop / maxScrollTop : 0;
            const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;

            return maxScrollLeft * (1 - coeff);
        });

        this._bottonButtonWrapper = new BottomButtonWrapper(".button-bottom-wrapper", ".button-bottom");
        this._bottonButtonWrapper.initScroll();

        this._leftButtonWrapper.initLeftButtons((category: ECategories) => {
            this._bottonButtonWrapper.updateBottomButtonsCategory(category);
            
            if (category === ECategories.HAIR_COLOR) {
                this._inputRange.style.opacity = "1";
            } else {
                this._inputRange.style.opacity = "0";
            }
        });

        this._bottonButtonWrapper.updateBottomButtonsCategory(ECategories.SHIRT);
    }

    public initSlider(): void {
        this._inputRange = document.getElementsByClassName("range")[0] as HTMLInputElement;
        this._inputRange.addEventListener("input", (event: InputEvent) => {
            if (this._inputRange.style.opacity === "0") {
                return;
            }
            
            const scene = ExtendedScene.getRunningScene();
            const player = scene ? scene.getObjectByName(TennisPlayer.playerName).userData as TennisPlayer : null;
            const val = +(event.target as HTMLInputElement).value;

            player.getBody().changeTextureColor(`${PlayerGender.n_girl}_${GirldBodyPartsNames.n_hair_cut}_01`, this.getColorByPercent(val));
            player.getBody().changeTextureColor(`${PlayerGender.n_girl}_${PlayerBodyPartsNames.n_eyebrow}_01`, this.getColorByPercent(val));
        
            if (val > 20) {
                this._inputRange.classList.add("dark-brown");
            }
            if (val > 40) {
                this._inputRange.classList.add("brown");
            }
            if (val > 60) {
                this._inputRange.classList.add("light-brown");
            }
            if (val > 80) {
                this._inputRange.classList.add("yellow");
            }
            if (val === 100) {
                this._inputRange.classList.add("ligth-yellow");
            }
        
            if (val < 20) {
                this._inputRange.classList.remove("dark-brown");
            }
            if (val < 40) {
                this._inputRange.classList.remove("brown");
            }
            if (val < 60) {
                this._inputRange.classList.remove("light-brown");
            }
            if (val < 80) {
                this._inputRange.classList.remove("yellow");
            }
            if (val < 100) {
                this._inputRange.classList.remove("ligth-yellow");
            }
        });
    }

    public getColorByPercent(value: number): string {
        if (value >= 0 && value < 18) {
            return "#252525";
        }
        if (value >= 18 && value < 34) {
            return "#4f1b02";
        }
        if (value >= 34 && value < 50) {
            return "#662404";
        }
        if (value >= 50 && value < 66) {
            return "#f15c13";
        }
        if (value >= 66 && value < 82) {
            return "#eff34e";
        }
        if (value >= 82 && value <= 100) {
            return "#e1df80";
        }
        
        return "#ffffff";
    }
}

import { AnimationMixer, MOUSE, Object3D, TextureLoader, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { ExtendedScene } from "./extendedScene";
import { PlayerBody, PlayerGender } from "./playerBody";
import { IPartsManager } from "./iPartsManager";
import { GlobalConfig } from "./globalConfig";

export namespace TennisPlayerGender {
    export const n_girl = "grl";
    export const n_boy = "by";
}

export class TennisPlayer implements IPartsManager<Object3D> {
    public static getTennisPlayerGenderByPlayer(value: string): string {
        switch (value) {
            case PlayerGender.n_boy: return TennisPlayerGender.n_boy;
            case PlayerGender.n_girl: return TennisPlayerGender.n_girl;
            default: return value;
        }
    }

    public static getPlayerGenderByTennisPlayer(value: string): string {
        switch (value) {
            case TennisPlayerGender.n_boy: return PlayerGender.n_boy;
            case TennisPlayerGender.n_girl: return PlayerGender.n_girl;
            default: return value;
        }
    }

    public static getConfigByGender(value: string): string[] {
        switch (value) {
            case PlayerGender.n_boy:;
            case TennisPlayerGender.n_boy: return GlobalConfig.g_boyConfig;
            case PlayerGender.n_girl:;
            case TennisPlayerGender.n_girl: return GlobalConfig.g_girlConfig;
            default: return null;
        }
    }

    private _core: GLTF = null;
    private _body: PlayerBody = null;
    private _racket: Object3D = null;
    private _tennisBall: Object3D = null;

    private _mixer: AnimationMixer = null;

    private mouseX: number = 0;
    private mouseDelta: number = 0;
    private allowMove: boolean = false;

    public constructor(gltf: GLTF, gender: string, loader: TextureLoader) {
        this._core = gltf;

        this.setVisibleForAllParts(false);
        this._body = new PlayerBody(this.getPartByName(gender));
        this._body.getCore().visible = true;
        this._racket = this.getPartByName("Racket");
        this._tennisBall = this.getPartByName("Tennis_ball");
        this._racket.visible = true;

        const config = TennisPlayer.getConfigByGender(gender);
        this._body.setLoader(loader);
        this._body.unhideParts(config);

        //playerBody.changeTexture(`${PlayerBodyPartsNames.n_shorts}01`, require("../assets/3D/textures/Tennis_Girl_Textures/Girl_premium/Premium_shorts/Girl_Short_2D_View01.png"));

        document.addEventListener("mousemove", this.onDocumentMouseMove, false);
        document.addEventListener("mousedown", this.onDocumentMouseDown, false);
        document.addEventListener("mouseup", this.onDocumentMouseUp, false);
    }

    public getCore(): GLTF {
        return this._core;
    }

    public getParent(): ExtendedScene {
        return this._core.userData as ExtendedScene;
    }

    public getBody(): PlayerBody {
        return this._body;
    }

    public getRacket(): Object3D {
        return this._racket;
    }

    public getTennisBall(): Object3D {
        return this._tennisBall;
    }

    public getPartByName(name: string): Object3D {
        return this._core.scene.getObjectByName(name);
    }

    public playAnimation(animName: string): void {
        const scene = this.getParent();

        if (!this._mixer) {
            this._mixer = scene.getMixerByRootOrCreate(this._core.scene);
            scene.addMixer(this._mixer);
        } else {
            this._mixer.stopAllAction();
        }

        const animation = this._core.animations.filter((value) => value.name === animName)[0];
        const action = this._mixer.clipAction(animation);
        action.play();
    }

    public setVisibleForAllParts(value: boolean): void {
        for (const child of this._core.scene.children) {
            child.visible = value;
        }
    }

    public unhideParts(partsNames: string[]): void {
        for (const partName of partsNames) {
            this.getPartByName(partName).visible = true;
        }
    }

    private onDocumentMouseMove(event: MouseEvent): void {
        if (!this.allowMove) {
            return;
        }

        event.preventDefault();
        const newValue = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseDelta = this.mouseX === 0 ? 0 : this.mouseX - newValue;
        this.mouseX = newValue;

        const coef = !isNaN(this.mouseDelta * 10) ? this.mouseDelta * 10 : 0;
        const obj = ExtendedScene.getRunningScene().getObjectByName("TennisPlayer");

        if (obj) {
            obj.rotateOnAxis(new Vector3(0, 1, 0), -coef);
        }
    }

    private onDocumentMouseDown(event: MouseEvent): void {
        if (event.button === MOUSE.LEFT) {
            this.allowMove = true;
        }
    }

    private onDocumentMouseUp(event: MouseEvent): void {
        if (event.button === MOUSE.LEFT) {
            this.allowMove = false;
            this.mouseX = 0;
        }
    }
}

import { AnimationMixer, MOUSE, Object3D, TextureLoader } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { ExtendedScene } from "./extendedScene";
import { GlobalConfig } from "./globalConfig";
import { IPartsManager } from "./iPartsManager";
import { PlayerBody, PlayerGender } from "./playerBody";

export namespace TennisPlayerGender {
    export const n_girl = "grl";
    export const n_boy = "by";
}

export namespace TennisPlayerAnimationsNames {
    export const n_gameplay_idle = "gameplay_idle";
    export const n_gameplay_tired_idle = "gameplay_tired_idle";
    export const n_hit_backhand_double = "hit_backhand_double";
    export const n_hit_backhand_single = "hit_backhand_single";
    export const n_hit_dropshot_backhand = "hit_dropshot_backhand";
    export const n_hit_dropshot_forehand = "hit_dropshot_forehand";
    export const n_hit_forehand = "hit_forehand";
    export const n_hit_lob_backhand_double_hands = "hit_lob_backhand_double_hands";
    export const n_hit_lob_backhand_single_hands = "hit_lob_backhand_single_hands";
    export const n_hit_lob_forehand = "hit_lob_forehand";
    export const n_lose_type_1 = "lose_type_1";
    export const n_lose_type_2 = "lose_type_2";
    export const n_lose_type_3 = "lose_type_3";
    export const n_main_menu_idle_type_1 = "main_menu_idle_type_1";
    export const n_main_menu_idle_type_2 = "main_menu_idle_type_2";
    export const n_main_menu_idle_type_3 = "main_menu_idle_type_3";
    export const n_run_backward = "run_backward";
    export const n_run_forward = "run_forward";
    export const n_run_left = "run_left";
    export const n_run_right = "run_right";
    export const n_serve = "serve";
    export const n_sit_down = "sit_down";
    export const n_sitting_idle_break = "sitting_idle_break";
    export const n_smash = "smash";
    export const n_stand_up = "stand_up";
    export const n_steps_side_to_side = "steps_side_to_side";
    export const n_volley_backhand = "volley_backhand";
    export const n_volley_forehand = "volley_forehand";
    export const n_walk_to_rest = "walk_to_rest";
    export const n_win_type_1 = "win_type_1";
    export const n_win_type_2 = "win_type_2";
    export const n_win_type_3 = "win_type_3";
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
            case PlayerGender.n_boy:
            case TennisPlayerGender.n_boy: return GlobalConfig.g_boyConfig;
            case PlayerGender.n_girl:
            case TennisPlayerGender.n_girl: return GlobalConfig.g_girlConfig;
            default: return null;
        }
    }

    private _core: GLTF = null;
    private _body: PlayerBody = null;
    private _racket: Object3D = null;
    private _tennisBall: Object3D = null;

    private _mixer: AnimationMixer = null;

    public constructor(gltf: GLTF, gender: string, loader: TextureLoader) {
        this._core = gltf;

        this.setVisibleForAllParts(false);
        this._body = new PlayerBody(this.getPartByName(gender));
        this._body.getCore().visible = true;
        this._racket = this.getPartByName("Racket");
        this._tennisBall = this.getPartByName("Tennis_ball");
        this._tennisBall.visible = true;
        this._racket.visible = true;

        const config = TennisPlayer.getConfigByGender(gender);
        this._body.setLoader(loader);
        this._body.unhideParts(config);

        //playerBody.changeTexture(`${PlayerBodyPartsNames.n_shorts}01`, require("../assets/3D/textures/Tennis_Girl_Textures/Girl_premium/Premium_shorts/Girl_Short_2D_View01.png"));
    }

    public getCore(): GLTF {
        return this._core;
    }

    public getParent(): ExtendedScene {
        return this._core.scene.parent as ExtendedScene;
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
}

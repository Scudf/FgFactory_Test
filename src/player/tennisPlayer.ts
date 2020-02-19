import { AnimationMixer, MathUtils, MeshBasicMaterial, MeshStandardMaterial, Object3D, Raycaster, SkinnedMesh, TextureLoader, Vector2 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

import { ExtendedScene } from "../extendedScene";
import { GlobalConfig } from "../globalConfig";
import { IPartsManager } from "../iPartsManager";
import * as utils from "../utils";

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

    public static readonly playerName: string = "TennisPlayer";

    private _core: GLTF = null;
    private _body: PlayerBody = null;
    private _racket: Object3D = null;
    private _tennisBall: Object3D = null;

    private _mixer: AnimationMixer = null;

    private _allowMove: boolean = false;
    private _mouseDelta: number = 0;
    private _mouseX: number = 0;
    private _mouse: Vector2 = new Vector2(0, 0);
    private _raycaster: Raycaster = new Raycaster();

    private _tempValue: number = 0;

    public constructor(gltf: GLTF, gender: string, loader: TextureLoader) {
        this._core = gltf;
        
        this.setVisibleForAllParts(false);
        this._body = new PlayerBody(this.getPartByName(gender));
        this._body.getCore().visible = true;
        this._racket = this.getPartByName("Racket");
        this._tennisBall = this.getPartByName("Tennis_ball");
        this._racket.visible = true;
        this.resetMaterial();

        const config = TennisPlayer.getConfigByGender(gender);
        this._body.setLoader(loader);
        this._body.unhideParts(config);

        const touchZone = document.getElementById("touch-zone");
        touchZone.addEventListener("mousedown", this._onDown.bind(this), false);
        touchZone.addEventListener("touchstart", this._onDown.bind(this), false);
        touchZone.addEventListener("mousemove", this._onMove.bind(this), false);
        touchZone.addEventListener("touchmove", this._onMove.bind(this), false);
        touchZone.addEventListener("mouseup", this._onUp.bind(this), false);
        touchZone.addEventListener("touchend", this._onUp.bind(this), false);
        touchZone.addEventListener("dblclick", this._onDoubleClick.bind(this), false);
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

    public resetPartMaterial(part: SkinnedMesh): void {
        const oldMaterial =  part.material as MeshStandardMaterial;
        const material = new MeshBasicMaterial({
            color: oldMaterial.color,
            opacity: oldMaterial.opacity,
            map: oldMaterial.map,
            aoMap: oldMaterial.aoMap,
            aoMapIntensity: oldMaterial.aoMapIntensity,
            alphaMap: oldMaterial.alphaMap,
            envMap: oldMaterial.envMap,
            refractionRatio: oldMaterial.refractionRatio,
            wireframe: oldMaterial.wireframe,
            wireframeLinewidth: oldMaterial.wireframeLinewidth,
            skinning: oldMaterial.skinning,
            morphTargets: oldMaterial.morphTargets
        });

        part.material = material;
    }
    public resetMaterial(): void {
        this.resetPartMaterial(this._racket as SkinnedMesh);
        this.resetPartMaterial(this._tennisBall as SkinnedMesh);
    }

    public playAnimation(animName: string): void {
        this._tennisBall.visible = animName === GlobalConfig.animationsPool[1];
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

    private _getMousePos(event: MouseEvent): Vector2 {
        return new Vector2(this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1, this._mouse.y = (event.clientY / window.innerHeight) * 2 - 1);
    }

    private _isIntersected(mousePos: Vector2): boolean {
        this._raycaster.setFromCamera(mousePos, this.getParent().getCamera());
        const intersects = this._raycaster.intersectObjects(this.getBody().getCore().children);

        if (intersects.length) {
            return true;
        }

        return false;
    }

    private _onDown(event: MouseEvent | TouchEvent): void {
        const vec = utils._handleClient(event);
        this._mouse.x = (vec.x / window.innerWidth) * 2 - 1;
        this._mouse.y = (vec.y / window.innerHeight) * 2 - 1;
        this._raycaster.setFromCamera(this._mouse, this.getParent().getCamera());
        const intersects = this._raycaster.intersectObjects(this.getBody().getCore().children);

        if (intersects.length) {
            this._allowMove = true;
        }
    }

    private _onMove(event: MouseEvent | TouchEvent): void {
        if (!this._allowMove) {
            return;
        }

        event.preventDefault();
        const newValue = (utils._handleClient(event).x / window.innerWidth) * 2 - 1;
        this._mouseDelta = this._mouseX === 0 ? 0 : this._mouseX - newValue;
        this._mouseX = newValue;

        const acceleration = GlobalConfig.rotationAcceleration;
        const coef = !isNaN(this._mouseDelta * acceleration) ? this._mouseDelta * acceleration : 0;
        this._core.scene.rotateY(-coef);
    }

    private _onUp(): void {
        this._allowMove = false;
        this._mouseX = 0;
        this._core.scene.rotation.set(0, 0, 0);
    }

    private _onDoubleClick(event: MouseEvent): void {
        if (!this._isIntersected(this._getMousePos(event))) {
            return;
        }

        const value = this._tempValue;

        while (value === this._tempValue) {
            this._tempValue = MathUtils.randInt(0, GlobalConfig.animationsPool.length - 1);
        }

        this.playAnimation(GlobalConfig.animationsPool[this._tempValue]);
    }
}

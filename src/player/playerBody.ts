import { Color, MeshStandardMaterial, Object3D, SkinnedMesh, TextureLoader } from "three";

import { IPartsManager } from "../iPartsManager";

export namespace PlayerGender {
    export const n_boy = "Boy";
    export const n_girl = "Girl";
}

export namespace PlayerBodyPartsNames {
    export const n_body = "Body";
    export const n_eyebrow = "Eyebrow";
    export const n_eyeballs = "Eyes";
    export const n_mole = "Mole";
    export const n_teeth = "Teeth";
}

export namespace GirldBodyPartsNames {
    export const n_chest = "Сhest";
    export const n_ears = "ears";
    export const n_eyelashes = "Eyelashes";
    export const n_eyes_base = "eyes";
    export const n_hair_cut = "Hair_Cut";
    export const n_head_base = "head_base";
    export const n_lips = "lips";
    export const n_nose = "nose";
}

export namespace BoyBodyPartsNames {
    export const n_ears = "Ears";
    export const n_eyes_base = "Head_base_eyes";
    export const n_hair_cut = "Hair";
    export const n_head_base = "Head_base";
    export const n_lips = "Lips";
    export const n_nose = "Nose";
}

export namespace PlayerClothesNames {
    export const n_band = "Band";
    export const n_earring = "Earring";
    export const n_hat = "Hat";
    export const n_headband = "Headband";
    export const n_shirt = "Shirt";
    export const n_shorts = "Shorts";
    export const n_shoes = "Shoes";
    export const n_socks = "Socks";
    export const n_watch = "Watch";
}

export namespace GirlClothesNames {
    export const n_bikini_zone = "bikini_zone";
    export const n_skirt = "Skirt";
}

export namespace BoyClothesNames {
    export const n_earring = "Earring";
    export const n_hat = "hat";
    export const n_shorts_long = "Shorts_long";
}

export enum ECategories {
    SHIRT,
    SHORT,
    HAIR_COLOR
}

export enum EPartType {
    COMMON,
    PREMIUM
}

export class PlayerBody implements IPartsManager<SkinnedMesh> {
    private _core: Object3D = null;
    private _textureLoader: TextureLoader = null;

    public constructor(core: Object3D, hideAll: boolean = true) {
        this._core = core;

        if (hideAll) {
            this.setVisibleForAllParts(!hideAll);
        }
    }

    public getCore(): Object3D {
        return this._core;
    }

    public setLoader(textureLoader: TextureLoader): void {
        this._textureLoader = textureLoader;
    }

    public getPartByName(name: string): SkinnedMesh {
        return this._core.getObjectByName(name) as SkinnedMesh;
    }

    public setVisibleForAllParts(value: boolean): void {
        for (const child of this._core.children) {
            child.visible = value;
        }
    }

    public unhideParts(partsNames: string[]): void {
        for (const partName of partsNames) {
            this.getPartByName(partName).visible = true;
        }
    }

    public changeTextureColor(elementName: string, color: Color | number | string): void {
        const element = this.getPartByName(`${elementName}`);
        let material: MeshStandardMaterial = null;

        if (element.material as MeshStandardMaterial) {
            material = element.material as MeshStandardMaterial;
            material.emissive.set(new Color(color));
        }
    }

    public changeTexture(elementName: string, fullpath: string): void {
        const element = this.getPartByName(`${elementName}`);
        let material: MeshStandardMaterial = null;

        if (element.material as MeshStandardMaterial) {
            material = element.material as MeshStandardMaterial;
        }

        if (!material || !this._textureLoader) {
            return;
        }

        this._textureLoader.load(fullpath, (texture) => {
            material.map = texture;
            material.needsUpdate = true;
        });
    }
}

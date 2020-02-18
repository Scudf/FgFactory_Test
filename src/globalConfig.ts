import { Vector3 } from "three";

import { ISceneParams } from "./extendedScene";
import { BoyBodyPartsNames, BoyClothesNames, ECategories, GirlClothesNames, GirldBodyPartsNames, PlayerBodyPartsNames, PlayerClothesNames, PlayerGender } from "./player/playerBody";
import { TennisPlayerAnimationsNames } from "./player/tennisPlayer";

export namespace GlobalConfig {
    export const initialPlayerPosition = new Vector3(0, -100, -50);
    export const initialArrowsPos = new Vector3(25, -87, 10);
    export const initialPlatformAngle = -95;
    export const elementsSize = 50;
    export const rotationAcceleration = 5;

    export const sceneParams: ISceneParams = {
        cameraParams: {
            fov: 45,
            near: 0.1,
            far: 1000,
            position: new Vector3(0, 0, 300)
        },
        ambLightParams: {
            color: 0xffffff,
            intensity: 0.4
        },
        dirLightParams: {
            color: 0xffffff,
            intensity: 1
        },
        backgroundMusicParams: {
            volume: 0.5,
            lopped: true
        }
    };

    export const g_girlConfig = [
        `${PlayerGender.n_girl}_${PlayerBodyPartsNames.n_body}`,
        `${PlayerGender.n_girl}_${PlayerBodyPartsNames.n_teeth}`,
        `${PlayerGender.n_girl}_${PlayerBodyPartsNames.n_eyebrow}_01`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_head_base}`,
        `${PlayerGender.n_girl}_${PlayerBodyPartsNames.n_eyeballs}`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_eyes_base}_1`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_ears}_1`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_lips}_1`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_nose}_1`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_eyelashes}_1`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_hair_cut}_01`,
        `${PlayerGender.n_girl}_${GirldBodyPartsNames.n_chest}`,
        `${PlayerGender.n_girl}_${GirlClothesNames.n_skirt}_01`,
        `${PlayerGender.n_girl}_${PlayerClothesNames.n_shirt}_01`,
        `${PlayerGender.n_girl}_${PlayerClothesNames.n_socks}`,
        `${PlayerGender.n_girl}_${PlayerClothesNames.n_shoes}_01`,
    ];

    export const g_boyConfig = [
        `${PlayerGender.n_boy}_${PlayerBodyPartsNames.n_body}`,
        `${PlayerGender.n_boy}_${PlayerBodyPartsNames.n_teeth}`,
        `${PlayerGender.n_boy}_${PlayerBodyPartsNames.n_eyebrow}_1`,
        `${PlayerGender.n_boy}_${BoyBodyPartsNames.n_head_base}`,
        `${PlayerGender.n_boy}_${PlayerBodyPartsNames.n_eyeballs}`,
        `${PlayerGender.n_boy}_${BoyBodyPartsNames.n_ears}_1`,
        `${PlayerGender.n_boy}_${BoyBodyPartsNames.n_lips}_1`,
        `${PlayerGender.n_boy}_${BoyBodyPartsNames.n_nose}_1`,
        `${PlayerGender.n_boy}_${BoyBodyPartsNames.n_hair_cut}_01`,
        `${PlayerGender.n_boy}_${BoyClothesNames.n_shorts_long}_01`,
        `${PlayerGender.n_boy}_${PlayerClothesNames.n_shirt}_01`,
        `${PlayerGender.n_boy}_${PlayerClothesNames.n_socks}_01`,
        `${PlayerGender.n_boy}_${PlayerClothesNames.n_shoes}_01`,
    ];

    export const animationsPool = [
        TennisPlayerAnimationsNames.n_main_menu_idle_type_2,
        TennisPlayerAnimationsNames.n_main_menu_idle_type_3,
        TennisPlayerAnimationsNames.n_gameplay_idle,
        TennisPlayerAnimationsNames.n_steps_side_to_side
    ];

    export const categories = [];
    categories[ECategories.SHIRT] = "Shirts";
    categories[ECategories.SHORT] = "Shorts";
    categories[ECategories.HAIR_COLOR] = "Hair Color";
    categories[3] = "Scroll Test";
    categories[4] = "Scroll Test";
    categories[5] = "Scroll Test";
}

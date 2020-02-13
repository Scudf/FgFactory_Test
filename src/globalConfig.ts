import { PlayerBodyPartsNames, PlayerGender, PlayerClothesNames, GirldBodyPartsNames, GirlClothesNames, BoyBodyPartsNames, BoyClothesNames } from "./playerBody";

export namespace GlobalConfig {
    export const g_cameraFov: number = 45;
    export const g_cameraNear: number = 0.1;
    export const g_cameraFar: number = 1000;

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
}

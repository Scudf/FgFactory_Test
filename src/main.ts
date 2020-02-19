import * as THREE from "three";
// tslint:disable-next-line:no-duplicate-imports
import { CircleGeometry, MathUtils, Mesh, PlaneGeometry } from "three";

import { ExtendedScene } from "./extendedScene";
import { GlobalConfig } from "./globalConfig";
// tslint:disable-next-line:no-import-side-effect
import "./main.css";
import { TennisPlayer, TennisPlayerGender } from "./player/tennisPlayer";
// tslint:disable-next-line:ordered-imports
import { GameHud } from "./hud/gameHud";

window.THREE = THREE;

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        scene: THREE.Scene;
    }
}

class Main {
    public constructor() {
        this.init();
    }

    public init(): void {
        const gameHud = new GameHud();
        const scene = new ExtendedScene(GlobalConfig.sceneParams);
        scene.name = "MainScene";
        window.scene = scene;

        const size = GlobalConfig.elementsSize;
        const playerPos = GlobalConfig.initialPlayerPosition;
        scene.addGltfObject(require("../assets/3D/GLTF_Tennis_Player/Main_characters_all_anims.gltf"), (gltf) => {
            gltf.scene.position.set(playerPos.x, playerPos.y, playerPos.z);
            gltf.scene.name = TennisPlayer.playerName;
            const tennisPlayer = new TennisPlayer(gltf, TennisPlayerGender.n_girl, scene.getTextureLoader());
            gltf.scene.userData = tennisPlayer;
            tennisPlayer.playAnimation("main_menu_idle_type_2");
        });

        scene.addTexture(require("../assets/2D/char_platform.png"), (material) => {
            const circleGeometry = new CircleGeometry(size, size / 2);
            const circle = new Mesh(circleGeometry, material);
            circle.name = "CharPlatform";
            circle.position.set(playerPos.x, playerPos.y, playerPos.z);
            circle.rotateX(MathUtils.degToRad(GlobalConfig.initialPlatformAngle));

            return circle;
        });

        const elementsPos = GlobalConfig.initialArrowsPos;
        scene.addTexture(require("../assets/2D/arrow_right.png"), (material) => {
            const planeGeometry = new PlaneGeometry(size, size / 2);
            const plane = new Mesh(planeGeometry, material);
            plane.name = "ArrowRight";
            plane.position.set(elementsPos.x, elementsPos.y, elementsPos.z);

            return plane;
        });

        scene.addTexture(require("../assets/2D/arrow_left.png"), (material) => {
            const planeGeometry = new PlaneGeometry(size, size / 2);
            const plane = new Mesh(planeGeometry, material);
            plane.name = "ArrowLeft";
            plane.position.set(-elementsPos.x, elementsPos.y, elementsPos.z);

            return plane;
        });

        window.onresize = () => {
            const camera = scene.getCamera();
            scene.getRenderer().setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
    }
}

new Main();

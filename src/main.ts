import "./main.css";
import * as THREE from "three";
import { AnimationMixer, CircleGeometry, MathUtils, Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GlobalConfig } from "./globalConfig";
import { ExtendedScene, ISceneParams } from "./extendedScene";
import { TennisPlayer, TennisPlayerGender } from "./tennisPlayer";


window.THREE = THREE;

declare global {
    interface Window {
        scene: THREE.Scene;
    }
}

class Main {
    private static scene: ExtendedScene = null;
    private static player: GLTF = null;

    public constructor() {
        const sceneParams: ISceneParams = {
            cameraParams: {
                fov: GlobalConfig.g_cameraFov,
                near: GlobalConfig.g_cameraNear,
                far: GlobalConfig.g_cameraFar,
                position: new Vector3(0, 0, 300)
            },
            ambLightParams: {
                color: 0xffffff,
                intensity: 0.4
            },
            dirLightParams: {
                color: 0xffffff,
                intensity: 1
            }
        }

        const loader = new TextureLoader();
        const scene = new ExtendedScene(sceneParams);
        Main.scene = scene;
        window.scene = scene;
        scene.addGltfObject(require("../assets/3D/GLTF_Tennis_Player/Main_characters_all_anims.gltf"), (gltf) => {
            gltf.scene.position.set(0, -100, 0);
            gltf.scene.name = "TennisPlayer";
            Main.player = gltf;
            const tennisPlayer = new TennisPlayer(gltf, TennisPlayerGender.n_girl, loader);
            tennisPlayer.playAnimation("main_menu_idle_type_1");
        });

        
        const arrowRight = loader.load(require("../assets/2D/arrow_right.png"));
        const arrowLeft = loader.load(require("../assets/2D/arrow_left.png"));
        loader.load(require("../assets/2D/char_platform.png"), (texture) => {
            const material = new MeshBasicMaterial({
                map: texture,
                transparent: true
            });

            const circleGeometry = new CircleGeometry(50, 50);
            const circle = new Mesh(circleGeometry, material);

            circle.position.set(0, -100, 0);
            circle.rotateX(MathUtils.degToRad(-95));
            scene.add(circle);
            const r = new Mesh(new PlaneGeometry(50, 25), new MeshBasicMaterial({
                map: arrowRight,
                transparent: true
            }));
            r.position.set(28, -87, 50);
            scene.add(r);
            const l = new Mesh(new PlaneGeometry(50, 25), new MeshBasicMaterial({
                map: arrowLeft,
                transparent: true
            }));
            l.position.set(-28, -87, 50);
            scene.add(l);
        });

        document.addEventListener("dblclick", this.onDocumentDoubleClick, false);
    }

    private onDocumentDoubleClick(): void {
        if (Main.player) {
            const mixer = new AnimationMixer(Main.player.scene);
            Main.scene.clearMixers();
            Main.scene.addMixer(mixer);
            const animation = Main.player.animations[MathUtils.randInt(0, Main.player.animations.length - 1)];
            const action = mixer.clipAction(animation);
            action.play();
        }
    }
}

new Main();

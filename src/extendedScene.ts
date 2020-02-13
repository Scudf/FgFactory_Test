import { AmbientLight, AnimationMixer, Audio, AudioListener, AudioLoader, Clock, Color, DirectionalLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer, Object3D } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface ISceneParams {
    cameraParams: ICameraParams;
    ambLightParams: ILightParams;
    dirLightParams: ILightParams;
}

export interface ICameraParams {
    fov: number;
    near: number;
    far: number;
    position: Vector3;
}

export interface ILightParams {
    color: string | number | Color;
    intensity: number;
}

export class ExtendedScene extends Scene {
    private static runningScene: ExtendedScene = null;

    private _clock: Clock = new Clock();
    private _camera: PerspectiveCamera = null;
    private _renderer: WebGLRenderer = null;
    private _animationMixers: AnimationMixer[] = [];
    private _gltfLoader: GLTFLoader = null;

    private _ambientLight: AmbientLight = null;
    private _directionalLight: DirectionalLight = null;

    public static getRunningScene(): ExtendedScene {
        return this ? ExtendedScene.runningScene : null;
    }

    public constructor(sceneParams: ISceneParams) {
        super();

        this._camera = new PerspectiveCamera(sceneParams.cameraParams.fov, window.innerWidth / window.innerHeight, sceneParams.cameraParams.near, sceneParams.cameraParams.far);
        this._camera.position.set(sceneParams.cameraParams.position.x, sceneParams.cameraParams.position.y, sceneParams.cameraParams.position.z);

        this._renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        this._gltfLoader = new GLTFLoader();

        window.onresize = () => {
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
        };

        const ambientLight = new AmbientLight(sceneParams.ambLightParams.color, sceneParams.ambLightParams.intensity);
        const directionalLight = new DirectionalLight(sceneParams.dirLightParams.color, sceneParams.dirLightParams.intensity);
        this._directionalLight = directionalLight;
        ambientLight.name = "AmbientLight";
        directionalLight.name = "DirectionalLight";
        this.add(ambientLight);
        this.add(directionalLight);

        const listener = new AudioListener();
        this._camera.add(listener);

        const sound = new Audio(listener);
        const audioLoader = new AudioLoader();
        audioLoader.load(require("../assets/sounds/Main_menu_musics_1.ogg"), (buffer) => {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            //sound.play();
        });

        ExtendedScene.runningScene = this;
    }

    public dispose(): void {
        this._clock = null;
        this._camera = null;
        this._renderer = null;
        this._animationMixers = [];
        this._gltfLoader = null;

        super.dispose();
    }

    public getMixerByRootOrCreate(root: Object3D): AnimationMixer {
        for (const mixer of this._animationMixers) {
            if (mixer.getRoot() === root) {
                return mixer;
            }
        }

        return new AnimationMixer(root);
    }

    public addMixer(mixer: AnimationMixer, keepUnique: boolean = true): void {
        for (const idx in this._animationMixers) {
            if (this._animationMixers[idx].getRoot() === mixer.getRoot() && keepUnique) {
                return;
            }
        }

        this._animationMixers.push(mixer);
    }

    public clearMixers(): void {
        this._animationMixers = [];
    }

    public addGltfObject(path: string, callback: (gltf: GLTF) => void): void {
        this._gltfLoader.load(path,
            (gltf) => {
                gltf.userData = this;
                this.add(gltf.scene);
                this._directionalLight.position.set(gltf.scene.position.x, gltf.scene.position.y + 100, gltf.scene.position.z + 200);
                this._directionalLight.target = gltf.scene;

                requestAnimationFrame(() => this.animate());
                console.log("Loaded model");

                callback(gltf);
            },
            undefined,
            (error) => console.error("Failed to load model", error)
        );
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        for (const mixer of this._animationMixers) {
            mixer.update(this._clock.getDelta());
        }

        this._renderer.render(this, this._camera);
    }
}

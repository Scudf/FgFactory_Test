import { AmbientLight, AnimationMixer, Audio, AudioListener, AudioLoader, Clock, Color, DirectionalLight, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, Scene, Texture, TextureLoader, Vector3, WebGLRenderer } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface ISceneParams {
    cameraParams: ICameraParams;
    ambLightParams: ILightParams;
    dirLightParams: ILightParams;
    backgroundMusicParams: IBackgroundMusicParams;
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

export interface IBackgroundMusicParams {
    volume: number;
    lopped: boolean;
}

export class ExtendedScene extends Scene {
    public static getRunningScene(): ExtendedScene {
        return ExtendedScene ? ExtendedScene.runningScene : null;
    }

    private static runningScene: ExtendedScene = null;

    private _clock: Clock = new Clock();
    private _audioListener: AudioListener = new AudioListener();
    private _gltfLoader: GLTFLoader = new GLTFLoader();
    private _textureLoader: TextureLoader = new TextureLoader();

    private _renderer: WebGLRenderer = null;
    private _camera: PerspectiveCamera = null;
    private _ambientLight: AmbientLight = null;
    private _directionalLight: DirectionalLight = null;

    private _animationMixers: AnimationMixer[] = [];

    public constructor(sceneParams: ISceneParams) {
        super();

        this.initRenderer();
        this.initCamera(sceneParams.cameraParams);
        this.initLight(sceneParams.ambLightParams, sceneParams.dirLightParams);
        this.initBackgroundMusic(sceneParams.backgroundMusicParams);

        ExtendedScene.runningScene = this;
    }

    public dispose(): void {
        this._clock = null;
        this._audioListener = null;
        this._gltfLoader = null;

        this._renderer = null;
        this._camera = null;
        this._ambientLight = null;
        this._directionalLight = null;

        this._animationMixers = [];

        super.dispose();
    }

    public getTextureLoader(): TextureLoader {
        return this._textureLoader;
    }

    public getRenderer(): WebGLRenderer {
        return this._renderer;
    }

    public getCamera(): PerspectiveCamera {
        return this._camera;
    }

    public initRenderer(): void {
        this._renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);
    }

    public initCamera(cameraParams: ICameraParams): void {
        this._camera = new PerspectiveCamera(cameraParams.fov, window.innerWidth / window.innerHeight, cameraParams.near, cameraParams.far);
        this._camera.position.set(cameraParams.position.x, cameraParams.position.y, cameraParams.position.z);
        this._camera.add(this._audioListener);
    }

    public initLight(ambLightParams: ILightParams, dirLightParams: ILightParams): void {
        this._ambientLight = new AmbientLight(ambLightParams.color, ambLightParams.intensity);
        this._directionalLight = new DirectionalLight(dirLightParams.color, dirLightParams.intensity);
        this._ambientLight.name = "AmbientLight";
        this._directionalLight.name = "DirectionalLight";
        this.add(this._ambientLight);
        this.add(this._directionalLight);
    }

    public initBackgroundMusic(backgroundMusicParams: IBackgroundMusicParams): void {
        const sound = new Audio(this._audioListener);
        const audioLoader = new AudioLoader();

        audioLoader.load(require("../assets/sounds/Main_menu_musics_1.ogg"), (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(backgroundMusicParams.volume);
            sound.setLoop(backgroundMusicParams.lopped);
            sound.play();
        });
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
        for (const aMixer of this._animationMixers) {
            if (aMixer.getRoot() === mixer.getRoot() && keepUnique) {
                return;
            }
        }

        this._animationMixers.push(mixer);
    }

    public clearMixers(): void {
        this._animationMixers = [];
    }

    public retargetLight(target: Object3D, position: Vector3): void {
        this._directionalLight.target = target;
        this._directionalLight.position.set(position.x, position.y, position.z);
    }

    public addGltfObject(path: string, callback: (gltf: GLTF) => void): void {
        this._gltfLoader.load(path, (gltf) => {
            this.add(gltf.scene);

            requestAnimationFrame(() => this.animate());
            callback(gltf);

            console.log("Loaded model");
        },
            undefined,
            (error) => console.error("Failed to load model", error)
        );
    }

    public addTexture(path: string, callback: (texture: MeshBasicMaterial) => Mesh): Texture {
        return this._textureLoader.load(path, (texture) => {
            const material = new MeshBasicMaterial({
                map: texture,
                transparent: true
            });

            this.add(callback(material));
        });
    }

    private animate(): void {
        requestAnimationFrame(() => this.animate());

        for (const mixer of this._animationMixers) {
            mixer.update(this._clock.getDelta());
        }

        this._renderer.render(this, this._camera);
    }
}

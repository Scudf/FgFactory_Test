import * as THREE from "three";
// tslint:disable-next-line:no-duplicate-imports
import { CircleGeometry, MathUtils, Mesh, MOUSE, PlaneGeometry, Vector3 } from "three";

import { ExtendedScene } from "./extendedScene";
import { GlobalConfig } from "./globalConfig";
import { TennisPlayer, TennisPlayerGender } from "./tennisPlayer";

window.THREE = THREE;

declare global {
    // tslint:disable-next-line:interface-name
    interface Window {
        scene: THREE.Scene;
    }
}

class Main {
    public static readonly playerName: string = "TennisPlayer";

    private _allowMove: boolean = false;
    private _mouseDelta: number = 0;
    private _mouseX: number = 0;

    private _tempValue: number = 0;

    public constructor() {
        const scene = new ExtendedScene(GlobalConfig.sceneParams);
        scene.name = "MainScene";
        window.scene = scene;

        const size = GlobalConfig.elementsSize;
        const playerPos = GlobalConfig.initialPlayerPosition;
        scene.addGltfObject(require("../assets/3D/GLTF_Tennis_Player/Main_characters_all_anims.gltf"), (gltf) => {
            gltf.scene.position.set(playerPos.x, playerPos.y, playerPos.z);
            gltf.scene.name = "TennisPlayer";
            const tennisPlayer = new TennisPlayer(gltf, TennisPlayerGender.n_girl, scene.getTextureLoader());
            gltf.scene.userData = tennisPlayer;
            tennisPlayer.playAnimation("main_menu_idle_type_1");
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

        document.addEventListener("mousedown", this._onDocumentMouseDown, false);
        document.addEventListener("mouseup", this._onDocumentMouseUp, false);
        document.addEventListener("mousemove", this._onDocumentMouseMove, false);
        document.addEventListener("dblclick", this._onDocumentDoubleClick, false);
    }

    private _onDocumentMouseDown(event: MouseEvent): void {
        if (event.button === MOUSE.LEFT) {
            this._allowMove = true;
        }
    }

    private _onDocumentMouseUp(event: MouseEvent): void {
        if (event.button === MOUSE.LEFT) {
            this._allowMove = false;
            this._mouseX = 0;
        }
    }

    private _onDocumentMouseMove(event: MouseEvent): void {
        if (!this._allowMove) {
            return;
        }

        event.preventDefault();
        const newValue = (event.clientX / window.innerWidth) * 2 - 1;
        this._mouseDelta = this._mouseX === 0 ? 0 : this._mouseX - newValue;
        this._mouseX = newValue;

        const acceleration = GlobalConfig.rotationAcceleration;
        const coef = !isNaN(this._mouseDelta * acceleration) ? this._mouseDelta * acceleration : 0;
        const player = ExtendedScene.getRunningScene().getObjectByName(Main.playerName);

        if (player) {
            player.rotateOnAxis(new Vector3(0, 1, 0), -coef);
        }
    }

    private _onDocumentDoubleClick(): void {
        const scene = ExtendedScene.getRunningScene();
        const player = scene ? scene.getObjectByName(Main.playerName).userData as TennisPlayer : null;

        const value = this._tempValue;

        while (value === this._tempValue) {
            this._tempValue = MathUtils.randInt(0, GlobalConfig.animationsPool.length - 1);
        }

        if (player) {
            player.playAnimation(GlobalConfig.animationsPool[this._tempValue]);
        }
    }
}

new Main();

/*const EVENTS_INTERVAL   = 500,    // интервал реакции на события
      SWIPE_SENSITIVITY = 0.33;   // чувствительность свайпов (0.33 == треть высоты элемента)

document.addEventListener('DOMContentLoaded', () => {
  let elem = document.querySelector('.smooth-scroll');
  initSmoothScrollEl(elem);
});

function initSmoothScrollEl(el) {
  el.blocksContainer = el.querySelector('.smooth-scroll_container');
  el.scrollPosY   = 0;
  el.scrollPosInc = el.clientHeight;
  el.touchStartY  = 0;
  el.timeTransEnd = 0;
  // выполняет прокрутку в зависимости от знака direction: >0 - вверх, <0 - вниз
  el.doScroll = function (direction) {
    if (!this.readyForScroll || !direction || Date.now() - this.timeTransEnd < EVENTS_INTERVAL)
      return;
    direction = Math.sign(direction);
    let newScrollPosY = this.scrollPosY + direction * this.scrollPosInc,
        maxScrollPosY = this.blocksContainer.scrollHeight - this.clientHeight;
    this.readyForScroll = !(newScrollPosY <= 0 && newScrollPosY >= -maxScrollPosY);
    if (!this.readyForScroll) {
      this.scrollPosY = newScrollPosY;
      this.blocksContainer.style.transform = `translateY(${newScrollPosY}px)`;
    }
  };
  // реакция на колесико мыши
  el.addEventListener('wheel', function (e) {
    e.preventDefault();
    this.doScroll(e.wheelDelta || -e.deltaY);
  });
  // реакция на свайпы
  el.addEventListener('touchstart', function (e) {
    e.preventDefault();
    this.touchStartY = e.changedTouches[0].screenY;
  });
  el.addEventListener('touchend', function (e) {
    e.preventDefault();
    let touchEndY = e.changedTouches[0].screenY,
        delta = touchEndY - this.touchStartY;
    if (Math.abs(delta) > SWIPE_SENSITIVITY * this.clientHeight)
      this.doScroll(delta);
  });
  // запоминаем время и ставим флаг готовности к прокрутке, когда переход завершится
  el.addEventListener('transitionend', function () {
    this.readyForScroll = true;
    this.timeTransEnd   = Date.now();
  });
  el.readyForScroll = true;
}*/

import './main.css'
import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, AnimationMixer, Object3D, Clock } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const clock: Clock = new Clock();
const scene = new Scene()
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 300)

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true
})

let mixer: AnimationMixer = null;
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.onresize = _ => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
}

const controls = new OrbitControls(camera, renderer.domElement)

const ambientLight = new AmbientLight(-1, 2)
scene.add(ambientLight)

const loader = new GLTFLoader()
let saucer: Object3D
loader.load(require("../assets/3D/Main_characters_all_anims.gltf"),
  gltf => {
    saucer = gltf.scene
    saucer.position.set(0, -200, 0)
    scene.add(saucer)

    mixer = new AnimationMixer(gltf.scene);
    const animation = gltf.animations.filter((value) => value.name === "main_menu_idle_type_1")[0];
		const action = mixer.clipAction(animation);
    action.play();
    
    requestAnimationFrame(animate)
    console.log('Loaded flying saucer')
  },
  undefined,
  err => console.error('Failed to load flying saucer model', err)
)

function animate(time: number) {
  requestAnimationFrame(animate)

  if (mixer) {
    mixer.update(clock.getDelta());
  }

  controls.update()
  renderer.render(scene, camera)
}

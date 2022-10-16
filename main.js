import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import "./styles.css";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const orbitControl = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.CubeTextureLoader()
  .setPath("./assets/")
  .load([
    "purplenebula_ft.png",
    "purplenebula_bk.png",
    "purplenebula_up.png",
    "purplenebula_dn.png",
    "purplenebula_rt.png",
    "purplenebula_lf.png",
  ]);

const pass = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(pass);

const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2,
  10,
  0.1
);
composer.addPass(bloom);

const pLight = new THREE.PointLight({ color: 0x404040 });
scene.add(pLight);

const marsNormalMap = new THREE.TextureLoader().load(
  "./assets/Mars-Normal.jpg"
);
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 32),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load("./assets/Mars.jpg"),
    normalMap: new THREE.TextureLoader().load("./assets/Mars-Normal.jpg"),
  })
);
scene.add(mars);

camera.position.set(-10, 30, 30);
orbitControl.update();

const clock = new THREE.Clock();
let time = 0;
const radius = 75;

renderer.setAnimationLoop(() => {
  time = clock.getElapsedTime() * 0.1 * Math.PI;
  pLight.position.set(
    Math.cos(time + Math.PI * 1) * radius,
    Math.sin(time + Math.PI * 1) * radius,
    0
  );
  renderer.render(scene, camera);
});

const animate = () => {
  composer.render();
  requestAnimationFrame(animate);
};

animate();

document.body.appendChild(renderer.domElement);

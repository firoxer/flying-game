import * as THREE from 'three';

import { generateEntities } from './entities/generate';

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

function addCamera(scene: THREE.Scene): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, 0, 0.1, 10000);
  scene.add(camera);
  return camera;
}

function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setClearColor('hsl(0, 0%, 95%)');
  renderer.shadowMap.enabled = true;

  return renderer;
}

function addFog(scene: THREE.Scene): void {
  scene.fog = new THREE.Fog('hsl(0, 0%, 95%)', 100, 200);
}

function addAmbientLighting(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight('hsl(0, 0%, 100%)', 0.3);
  scene.add(ambientLight);
}

function addAirplaneLighting(scene: THREE.Scene): THREE.DirectionalLight {
  const directionalLight = new THREE.DirectionalLight('hsl(0, 0%, 100%)', 0.7);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.radius = 10;
  scene.add(directionalLight);

  directionalLight.target = entities.airplane.object;
  scene.add(directionalLight.target);

  return directionalLight;
}

const scene = new THREE.Scene();

const entities = generateEntities();
scene.add(...Object.values(entities).map(({ object }) => object));

const camera = addCamera(scene);
camera.position.copy(entities.airplane.object.position);

const renderer = createRenderer(canvas);

addFog(scene);
addAmbientLighting(scene);
const airplaneLighting = addAirplaneLighting(scene);

const refitViewport = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // No need to go denser than 2
};

window.addEventListener('resize', refitViewport);
refitViewport();

const clock = new THREE.Clock();
let previousElapsedTime = clock.getElapsedTime();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const elapsedTimeDelta = elapsedTime - previousElapsedTime;
  previousElapsedTime = elapsedTime;

  entities.airplane.update(elapsedTime);

  camera.quaternion.slerp(
    entities.airplane.object.quaternion,
    elapsedTimeDelta * 3
  );
  camera.position.lerp(
    entities.airplane.object.position
      .clone()
      .add(new THREE.Vector3(0, 2, 10).applyQuaternion(camera.quaternion)),
    elapsedTimeDelta * 3
  );

  airplaneLighting.position
    .copy(entities.airplane.object.position)
    .add(new THREE.Vector3(1, 3, 2));

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

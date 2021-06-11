import * as THREE from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

import { generateEntities } from './entities/generate';

const settings = {
  debugCameraEnabled: false,
  hemisphereLightColorAbove: new THREE.Color('hsl(220, 30%, 90%)').getHex(),
  hemisphereLightColorBelow: new THREE.Color('hsl(0, 0%, 70%)').getHex(),
};

const gui = new dat.GUI();

const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 0, 0.1, 10000);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(new THREE.Color(settings.hemisphereLightColorAbove));
renderer.outputEncoding = THREE.sRGBEncoding;

const updateCamera = () => {
  if (settings.debugCameraEnabled) {
    camera.far = 10000;
    camera.position.set(3000, 5000, 3000);
    camera.lookAt(0, 0, 0);
  } else {
    camera.far = 2000;
    camera.position.y = 150;
    camera.position.z = 10;
  }

  camera.updateProjectionMatrix();
};
gui.add(settings, 'debugCameraEnabled').onChange(updateCamera);

const entities = generateEntities();
scene.add(entities.airplane.object, entities.ground.object);

// Fog

scene.fog = new THREE.Fog(settings.hemisphereLightColorAbove, 400, 500);

// Lighting

const hemisphereLight = new THREE.HemisphereLight(
  settings.hemisphereLightColorAbove,
  settings.hemisphereLightColorBelow,
  0.5
);
scene.add(hemisphereLight);

const updateHemisphereLightColorAbove = () => {
  const color = new THREE.Color(settings.hemisphereLightColorAbove);
  hemisphereLight.color = color;
  renderer.setClearColor(color);
};
gui
  .addColor(settings, 'hemisphereLightColorAbove')
  .onChange(updateHemisphereLightColorAbove);

const updateHemisphereLightColorBelow = () => {
  hemisphereLight.groundColor = new THREE.Color(
    settings.hemisphereLightColorBelow
  );
};
gui
  .addColor(settings, 'hemisphereLightColorBelow')
  .onChange(updateHemisphereLightColorBelow);

const pointLight = new THREE.PointLight(
  settings.hemisphereLightColorAbove,
  0.5
);
pointLight.position.set(1000, 1000, 1000);
scene.add(pointLight);

//

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

  if (!settings.debugCameraEnabled) {
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
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

import * as THREE from 'three';

import config from '../../config';
import fbm from '../../fbm';
import { range } from '../../utils';
import { Entity } from '../Entity';

function generateGradientMap(steps: number): THREE.DataTexture {
  const colors = new Uint8Array(steps);
  for (const index of range(steps)) {
    colors[index] = (index / colors.length) * 256;
  }

  const gradientMap = new THREE.DataTexture(
    colors,
    colors.length,
    1,
    THREE.LuminanceFormat
  );
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;

  return gradientMap;
}

export function generateGround(): Entity {
  const geometry = new THREE.PlaneBufferGeometry(
    config.ground.width,
    config.ground.depth,
    config.ground.width / config.ground.resolution,
    config.ground.depth / config.ground.resolution
  );

  const positions = geometry.attributes.position?.array as Float32Array;
  for (const index of range(0, positions.length / 3 - 1)) {
    const x = Math.floor(
      index / (config.ground.width / config.ground.resolution + 1)
    );
    const y = index % (config.ground.width / config.ground.resolution + 1);
    positions[index * 3 + 2] =
      fbm(x, y, { iterations: 8, scale: 1 / 16 }) * 256;
  }

  geometry.computeVertexNormals();

  const ground = new THREE.Mesh(
    geometry,
    new THREE.MeshToonMaterial({
      color: new THREE.Color('hsl(0, 0%, 100%)'),
      gradientMap: generateGradientMap(32),
    })
  );
  ground.rotation.x = Math.PI * 1.5;
  ground.position.set(0, 0, 0);
  ground.receiveShadow = true;

  return { object: ground };
}

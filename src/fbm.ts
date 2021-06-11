import * as THREE from 'three';

import { range } from './utils';

const multiplier = new THREE.Vector2(14.5, 2.7);
function random(x: number, y: number): number {
  const z = Math.sin(new THREE.Vector2(x, y).dot(multiplier)) * 3232.5335;
  return z - Math.floor(z);
}

function morgan3dNoise(x: number, y: number): number {
  const xInteger = Math.floor(x);
  const yInteger = Math.floor(y);
  const xFractional = x - xInteger;
  const yFractional = y - yInteger;

  const a = random(xInteger, yInteger);
  const b = random(xInteger + 1, yInteger);
  const c = random(xInteger, yInteger + 1);
  const d = random(xInteger + 1, yInteger + 1);

  const xU = xFractional * xFractional * (3 - 2 * xFractional);
  const yU = yFractional * yFractional * (3 - 2 * yFractional);

  return (
    THREE.MathUtils.lerp(a, b, xU) +
    (c - a) * yU * (1.0 - xU) +
    (d - b) * xU * yU
  );
}

export default function fbm(
  x: number,
  y: number,
  options: {
    amplitude: number;
    iterations: number;
    scale: number;
    turbulenceEnabled: boolean;
  }
) {
  let value = 0;
  let amplitude = options.amplitude;
  const noise = options.turbulenceEnabled
    ? (x: number, y: number): number =>
        amplitude *
        Math.abs(morgan3dNoise(x * options.scale, y * options.scale) * 2 - 1)
    : (x: number, y: number): number =>
        amplitude * morgan3dNoise(x * options.scale, y * options.scale);
  for (const _ of range(options.iterations)) {
    value += noise(x, y);
    x *= 2;
    y *= 2;
    amplitude *= 0.5;
  }

  return value;
}

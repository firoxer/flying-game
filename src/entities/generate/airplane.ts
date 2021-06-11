import * as THREE from 'three';

import { UpdateableEntity } from '../Entity';

export function generateAirplane(): UpdateableEntity {
  const airplane = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color('hsl(0, 0%, 100%)'),
    metalness: 0.3,
    roughness: 0.4,
  });

  const mainFuselage = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 3.5),
    material
  );
  mainFuselage.position.set(0, 0, 0.25);
  airplane.add(mainFuselage);

  const sternFuselage = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 1.5),
    material
  );
  sternFuselage.position.set(0, 0, 2.25);
  airplane.add(sternFuselage);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2.5), material);
  cabin.position.set(0, 0, 0);
  airplane.add(cabin);

  const leftWheel = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.5, 0.5),
    material
  );
  leftWheel.position.set(-0.5, -0.5, 0);
  airplane.add(leftWheel);

  const rightWheel = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.5, 0.5),
    material
  );
  rightWheel.position.set(0.5, -0.5, 0);
  airplane.add(rightWheel);

  const propellerMount = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.25),
    material
  );
  propellerMount.position.set(0, 0, -1.625);
  airplane.add(propellerMount);

  const propeller = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.2, 0.125),
    material
  );
  propeller.position.set(0, 0, -1.625);
  airplane.add(propeller);

  const wings = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.2, 1.25), material);
  wings.position.set(0, 0.5, 0);
  airplane.add(wings);

  const horizontalStabilizer = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.125, 0.75),
    material
  );
  horizontalStabilizer.position.set(0, 0, 2.875);
  airplane.add(horizontalStabilizer);

  const verticalStabilizer = new THREE.Mesh(
    new THREE.BoxGeometry(0.125, 1, 0.5),
    material
  );
  verticalStabilizer.position.set(0, 0.5, 3);
  airplane.add(verticalStabilizer);

  airplane.rotation.set(Math.PI * 0.05, 0, 0);
  airplane.position.set(0, 200, 0);

  const update = (elapsedTime: number): void => {
    propeller.rotation.set(0, 0, elapsedTime * 20);
    airplane.position.z = -elapsedTime * 5;
    airplane.rotation.z = Math.sin(elapsedTime) * 0.25;
    airplane.position.x = Math.sin(elapsedTime) * 1;
  };

  return { object: airplane, update };
}

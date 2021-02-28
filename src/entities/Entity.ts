import * as THREE from 'three';

export interface Entity {
  object: THREE.Object3D;
}

export interface UpdateableEntity extends Entity {
  update: (elapsedTime: number) => void;
}

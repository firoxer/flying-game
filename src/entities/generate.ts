import { generateAirplane } from './generate/airplane';
import { generateGround } from './generate/ground';

export function generateEntities() {
  return { airplane: generateAirplane(), ground: generateGround() };
}

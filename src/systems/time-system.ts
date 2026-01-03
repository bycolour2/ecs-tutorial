import { getSingleton } from '../lib/singleton-utils';
import { TimeSingleton } from '../singletons';
import { World } from '../types';

export function timeSystem(world: World, dtMs: number) {
  const time = getSingleton(world, TimeSingleton);

  time.nowMs += dtMs;
  time.tick += 1;
}

import { getSingleton } from '~/lib/singleton-utils';
import { TimeSingleton } from '~/singletons';
import { World } from '~/types';

export function timeSystem(world: World, deltaMs: number) {
  const time = getSingleton(world, TimeSingleton);

  time.nowMs += deltaMs;
  time.tick += 1;
}

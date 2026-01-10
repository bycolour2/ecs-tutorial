import { registerSingleton } from '~/lib/singleton-utils';
import { TimeSingleton } from '~/singletons';
import { World } from '~/types';

export function registerSingletons(world: World) {
  registerSingleton(world, TimeSingleton);
}

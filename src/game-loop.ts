import { getSingleton } from './lib/singleton-utils';
import { TimeSingleton } from './singletons';
import { productionSystem, timeSystem } from './systems';
import { World } from './types';

export const TICK_MS = 100;
export const MAX_TICKS_PER_CALL = 10_000;

export function tick(world: World, deltaMs: number) {
  timeSystem(world, deltaMs);
  productionSystem(world, deltaMs);
}

export function simulate(world: World, realDtMs: number) {
  const time = getSingleton(world, TimeSingleton);
  let ticks = 0;

  time.accumulatorMs += realDtMs;

  while (time.accumulatorMs >= TICK_MS) {
    tick(world, TICK_MS);
    time.accumulatorMs -= TICK_MS;

    ticks++;
    if (ticks > MAX_TICKS_PER_CALL) {
      time.accumulatorMs = 0;
      break;
    }
  }
}

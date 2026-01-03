import { PositionComponent, VelocityComponent } from '../components';
import { query } from '../lib/component-utils';
import { World } from '../types';

export function movementSystem(world: World, delta: number) {
  for (const [, pos, vel] of query(world, PositionComponent, VelocityComponent)) {
    if (!pos || !vel) continue;

    pos.x += vel.dx * delta;
    pos.y += vel.dy * delta;
  }
}

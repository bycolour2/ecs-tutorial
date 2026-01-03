import { HealthComponent, PositionComponent } from '../components';
import { query, removeAllComponents } from '../lib/component-utils';
import { World } from '../types';

export function deathSystem(world: World) {
  for (const [entity, health, position] of query(world, HealthComponent, PositionComponent)) {
    if (!health || !position) continue;

    if (health.value > 0) continue;

    removeAllComponents(world, entity);
  }
}

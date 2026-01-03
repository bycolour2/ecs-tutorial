import { DamageComponent, HealthComponent } from '../components';
import { query, removeComponent } from '../lib/component-utils';
import { World } from '../types';

export function damageSystem(world: World) {
  for (const [entity, health, damage] of query(world, HealthComponent, DamageComponent)) {
    if (!health || !damage) continue;

    health.value -= damage.amount;

    // remove the damage from the entity
    removeComponent(world, entity, DamageComponent);
  }
}

import { ProductionComponent, RESOURCES_PRECISION, ResourceComponent } from '../components';
import { World } from '../types';

export function productionSystem(world: World, dt: number) {
  for (const [, production] of ProductionComponent.store) {
    const resource = ResourceComponent.store.get(production.target);
    if (!resource) continue;

    const delta = Math.round(production.ratePerSecond * (dt / 1000) * RESOURCES_PRECISION);

    resource.amount += delta;
  }
}

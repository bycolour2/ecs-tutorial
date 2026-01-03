import { ProductionComponent, ResourceComponent } from '../components';
import { World } from '../types';

export function productionSystem(world: World, dt: number) {
  for (const [, production] of ProductionComponent.store) {
    const resource = ResourceComponent.store.get(production.target);
    if (!resource) continue;

    resource.amount += production.ratePerSecond * (dt / 1000);
  }
}

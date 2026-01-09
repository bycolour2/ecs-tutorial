import {
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
} from '../components';
import { query } from '../lib/component-utils';
import { getProductionMultiplier } from '../lib/selectors';
import { World } from '../types';

export function productionSystem(world: World, deltaMs: number) {
  const generators = query(world, ResourceGeneratorComponent, OwnedByComponent);
  const resources = query(world, ResourceComponent, OwnedByComponent);

  for (const [, gen, genOwner] of generators) {
    const multiplier = getProductionMultiplier(world, genOwner.user, gen.resource);

    for (const [, res, resOwner] of resources) {
      // разные пользователи — пропускаем
      if (genOwner.user !== resOwner.user) continue;

      // другой тип ресурса — пропускаем
      if (res.type !== gen.resource) continue;

      const produced = (gen.ratePerSecond * multiplier * deltaMs * RESOURCES_PRECISION) / 1000;

      res.amount += produced;

      if (res.cap !== undefined) {
        const cap = res.cap * RESOURCES_PRECISION;
        if (res.amount > cap) res.amount = cap;
      }
    }
  }
}

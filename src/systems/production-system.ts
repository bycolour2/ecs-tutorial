import { query } from '~/lib/query';
import {
  ExtractionStationComponent,
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
} from '../components';
import { getProductionMultiplier } from '../lib/selectors';
import { World } from '~/types';

// export function productionSystem(world: World, deltaMs: number) {
//   const generators = query(world, ResourceGeneratorComponent, OwnedByComponent);
//   const resources = query(world, ResourceComponent, OwnedByComponent);

//   for (const [, gen, genOwner] of generators) {
//     const multiplier = getProductionMultiplier(world, genOwner.owner, gen.resource);

//     for (const [, res, resOwner] of resources) {
//       // разные пользователи — пропускаем
//       if (genOwner.owner !== resOwner.owner) continue;

//       // другой тип ресурса — пропускаем
//       if (res.type !== gen.resource) continue;

//       const produced = (gen.baseRate * multiplier * deltaMs * RESOURCES_PRECISION) / 1000;

//       res.amount += produced;

//       if (res.cap !== undefined) {
//         const cap = res.cap * RESOURCES_PRECISION;
//         if (res.amount > cap) res.amount = cap;
//       }
//     }
//   }
// }

export function productionSystem(world: World, deltaMs: number) {
  for (const [, station, generator, ownedBy] of query(
    world,
    ExtractionStationComponent,
    ResourceGeneratorComponent,
    OwnedByComponent,
  )) {
    if (!station.built) continue;

    for (const [, resource, resourceOwner] of query(world, ResourceComponent, OwnedByComponent)) {
      if (resourceOwner.owner !== ownedBy.owner) continue;
      if (resource.type !== generator.resource) continue;

      resource.amount += generator.baseRate * station.level * deltaMs;
    }
  }
}

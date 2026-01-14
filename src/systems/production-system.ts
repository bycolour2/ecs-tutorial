import { query } from '~/lib/query';
import {
  ExtractionStationComponent,
  OwnedByComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
} from '../components';
import { World } from '~/types';

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

import {
  ExtractionStationComponent,
  OwnedByComponent,
  ResourceComponent,
  ResourceType,
} from '~/components';
import { query } from '~/lib/query';
import { World } from '~/types';

const BUILD_COST = {
  ore: 20,
};

export function buildStationSystem(world: World, resourceType: ResourceType) {
  for (const [, station, ownedBy] of query(world, ExtractionStationComponent, OwnedByComponent)) {
    if (station.resource !== resourceType) continue;
    if (station.built) continue;

    for (const [, resource, resourceOwner] of query(world, ResourceComponent, OwnedByComponent)) {
      if (resourceOwner.owner !== ownedBy.owner) continue;
      if (resource.type !== 'ore') continue;
      if (resource.amount < BUILD_COST.ore) return;

      resource.amount -= BUILD_COST.ore;
      station.built = true;
      return;
    }
  }
}

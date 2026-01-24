import {
  BuildStationEventComponent,
  ExtractionStationComponent,
  OwnedByComponent,
  ResourceComponent,
} from '~/components';
import { query } from '~/lib/query';
import { removeEntity } from '~/lib/world-utils';
import { World } from '~/types';

const BUILD_COST = {
  ore: 20,
};

export function startBuildStationSystem(world: World) {
  for (const [eventEntity, event] of query(world, BuildStationEventComponent)) {
    let built = false;

    // Find unbuilt station of the requested type owned by the user
    for (const [, station, ownedBy] of query(world, ExtractionStationComponent, OwnedByComponent)) {
      if (station.resource !== event.stationType) continue;
      if (station.built) continue;
      if (ownedBy.owner !== event.user) continue;

      // Check if user has enough ore
      for (const [, resource, resourceOwner] of query(world, ResourceComponent, OwnedByComponent)) {
        if (resourceOwner.owner !== event.user) continue;
        if (resource.type !== 'ore') continue;

        if (resource.amount >= BUILD_COST.ore) {
          // Deduct cost and build station
          resource.amount -= BUILD_COST.ore;
          station.built = true;
          built = true;
        }
        break; // Found user's ore resource
      }

      if (built) break; // Successfully built
    }

    // Event is consumed
    removeEntity(world, eventEntity);
  }
}

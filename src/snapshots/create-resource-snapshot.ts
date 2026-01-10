import { OwnedByComponent, ResourceComponent } from '~/components';
import { query } from '~/lib/query';
import { Entity, World } from '~/types';

export function getPlayerResources(world: World, player: Entity) {
  const result: Record<string, number> = {};

  for (const [, resource, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
    if (ownedBy.owner !== player) continue;

    result[resource.type] = resource.amount;
  }

  return result;
}

import {
  ExpeditionComponent,
  ExpeditionProgressComponent,
  ExpeditionRewardComponent,
  OwnedByComponent,
  ResourceComponent,
} from '~/components';
import { query } from '~/lib/query';
import { removeEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function expeditionProgressSystem(world: World, deltaMs: number) {
  for (const [entity, expedition, progress, reward, ownedBy] of query(
    world,
    ExpeditionComponent,
    ExpeditionProgressComponent,
    ExpeditionRewardComponent,
    OwnedByComponent,
  )) {
    progress.progress += deltaMs;

    if (progress.progress < expedition.duration) continue;

    for (const [, resource, resOwner] of query(world, ResourceComponent, OwnedByComponent)) {
      if (resOwner.owner !== ownedBy.owner) continue;
      if (resource.type !== reward.resource) continue;

      resource.amount += reward.amount;
    }

    removeEntity(world, entity);
  }
}

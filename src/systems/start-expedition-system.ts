import {
  ExpeditionComponent,
  ExpeditionProgressComponent,
  ExpeditionRewardComponent,
  OwnedByComponent,
  ExpeditionStartEventComponent,
} from '~/components';
import { query } from '~/lib/query';
import { addComponent, createEntity, removeEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function startExpeditionSystem(world: World) {
  for (const [entity, event] of query(world, ExpeditionStartEventComponent)) {
    const expedition = createEntity();

    const duration = event.target === 'crystal' ? 60_000 : 120_000;

    addComponent(world, expedition, ExpeditionComponent, {
      target: event.target,
      duration,
    });

    addComponent(world, expedition, ExpeditionProgressComponent, {
      progress: 0,
    });

    addComponent(world, expedition, ExpeditionRewardComponent, {
      resource: event.target,
      amount: 1,
    });

    addComponent(world, expedition, OwnedByComponent, {
      owner: event.user,
    });

    removeEntity(world, entity); // событие одноразовое
  }
}

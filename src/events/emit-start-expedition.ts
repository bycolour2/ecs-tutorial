import { ExpeditionStartEventComponent } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { Entity, World } from '~/types';

export function emitStartExpedition(world: World, user: Entity, target: 'crystal' | 'artifact') {
  const eventEntity = createEntity();

  addComponent(world, ExpeditionStartEventComponent, eventEntity, {
    user,
    target,
  });
}

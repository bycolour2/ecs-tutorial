import { BaseResourceType, BuildStationEventComponent } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { Entity, World } from '~/types';

export function emitBuildStation(world: World, user: Entity, stationType: BaseResourceType) {
  const eventEntity = createEntity();

  addComponent(world, BuildStationEventComponent, eventEntity, {
    user,
    stationType,
  });
}

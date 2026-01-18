import { OwnedByComponent, ResourceComponent, ResourceType } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { Entity, World } from '~/types';

const BASE_RESOURCES: Array<{ type: ResourceType; amount: number; cap?: number }> = [
  { type: 'ore', amount: 0, cap: 100 },
  { type: 'energy', amount: 0, cap: 50 },
  { type: 'food', amount: 0, cap: 50 },
  { type: 'money', amount: 0 },
  { type: 'crystal', amount: 0, cap: 10 },
  { type: 'artifact', amount: 0, cap: 10 },
];

export function createUserResources(world: World, user: Entity) {
  for (const res of BASE_RESOURCES) {
    const resourceEntity = createEntity();

    addComponent(world, ResourceComponent, resourceEntity, {
      type: res.type,
      amount: res.amount,
      cap: res.cap,
    });

    addComponent(world, OwnedByComponent, resourceEntity, { owner: user });
  }
}

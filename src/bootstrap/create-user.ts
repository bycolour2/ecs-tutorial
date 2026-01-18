import { UserComponent } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function createUser(world: World) {
  const userEntity = createEntity();

  addComponent(world, UserComponent, userEntity, {
    id: `User-${crypto.randomUUID()}`,
    name: 'User',
  });

  return userEntity;
}

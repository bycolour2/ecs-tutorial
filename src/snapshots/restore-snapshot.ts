import { Component, World, WorldSnapshot } from '~/types';
import { resetEntityId, createEntity } from '../lib/world-utils';

export function restoreSnapshot(snapshot: WorldSnapshot): World {
  const world: World = {
    components: new Map(),
    singletons: new Map(),
  };

  let maxEntityId = 0;

  // Restore all components
  for (const componentData of snapshot.components) {
    const component: Component<unknown> = {
      name: componentData.name,
      store: new Map(),
    };

    for (const [entityKey, value] of Object.entries(componentData.data)) {
      const entityId = parseInt(entityKey, 10);
      component.store.set(entityId, value);

      // Отслеживаем максимальный entity ID
      if (entityId > maxEntityId) {
        maxEntityId = entityId;
      }
    }

    world.components.set(componentData.name, component);
  }

  // Restore all singletons
  for (const [name, value] of Object.entries(snapshot.singletons)) {
    world.singletons.set(name, value);
  }

  // Сбрасываем глобальный счетчик entity ID
  resetEntityId();

  // Создаем entity до нужного ID, чтобы синхронизировать счетчик
  for (let i = 1; i <= maxEntityId; i++) {
    createEntity();
  }

  return world;
}

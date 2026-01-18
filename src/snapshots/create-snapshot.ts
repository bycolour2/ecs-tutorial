import { Component, World, WorldSnapshot } from '~/types';

export function createSnapshot(world: World): WorldSnapshot {
  const snapshot: WorldSnapshot = {
    components: [],
    singletons: {},
  };

  // Serialize all components
  for (const [name, component] of world.components.entries()) {
    const componentData: Record<number, unknown> = {};
    for (const [entity, data] of component.store.entries()) {
      componentData[entity] = data;
    }
    snapshot.components.push({
      name,
      data: componentData,
    });
  }

  // Serialize all singletons
  for (const [name, value] of world.singletons.entries()) {
    snapshot.singletons[name] = value;
  }

  return snapshot;
}

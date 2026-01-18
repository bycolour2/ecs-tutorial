import { Component, Entity, World } from '~/types';

let nextEntityId = 1;

export function createEntity(): Entity {
  return nextEntityId++;
}

export function createWorld(components?: Component<any>[]): World {
  if (!components) {
    return {
      components: new Map(),
      singletons: new Map(),
    };
  }

  return {
    components: new Map(components.map((component) => [component.name, component])),
    singletons: new Map(),
  };
}

export function addComponent<T>(world: World, entity: Entity, component: Component<T>, value: T) {
  component.store.set(entity, value);
}

export function removeComponent<T>(world: World, entity: Entity, component: Component<T>) {
  component.store.delete(entity);
}

export function removeEntity(world: World, entity: Entity) {
  for (const component of world.components.values()) {
    component.store.delete(entity);
  }
}

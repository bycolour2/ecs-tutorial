import { Component, Entity, World } from '~/types';

export function createComponent<T>(name: string): Component<T> {
  return {
    name,
    store: new Map(),
  };
}

export function registerComponent<T>(world: World, component: Component<T>) {
  world.components.set(component.name, component);
}

export function getComponent<T>(world: World, component: Component<T>): Map<Entity, T> {
  return world.components.get(component.name)!.store;
}

export function removeAllComponents(world: World, entity: Entity) {
  for (const [, component] of world.components) {
    component.store.delete(entity);
  }
}

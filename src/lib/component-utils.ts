import { Component, Entity, World } from '../types';

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

export function addComponent<T>(world: World, entity: Entity, component: Component<T>, value: T) {
  component.store.set(entity, value);
}

export function removeComponent<T>(world: World, entity: Entity, component: Component<T>) {
  component.store.delete(entity);
}

export function removeAllComponents(world: World, entity: Entity) {
  for (const [, component] of world.components) {
    component.store.delete(entity);
  }
}

export function query<C1, C2>(
  world: World,
  c1: Component<C1>,
  c2: Component<C2>,
): Array<[Entity, C1, C2]> {
  const result: Array<[Entity, C1, C2]> = [];

  for (const [entity, value1] of c1.store) {
    const value2 = c2.store.get(entity);
    if (!value2) continue;

    result.push([entity, value1, value2]);
  }

  return result;
}

export function query3<C1, C2, C3>(
  world: World,
  c1: Component<C1>,
  c2: Component<C2>,
  c3: Component<C3>,
): Array<[Entity, C1, C2, C3]> {
  const result: Array<[Entity, C1, C2, C3]> = [];

  for (const [entity, value1] of c1.store) {
    const value2 = c2.store.get(entity);
    if (!value2) continue;
    const value3 = c3.store.get(entity);
    if (!value3) continue;

    result.push([entity, value1, value2, value3]);
  }

  return result;
}

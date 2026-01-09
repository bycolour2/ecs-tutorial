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

export type QueryResult<Cs extends readonly Component<any>[]> = {
  [K in keyof Cs]: Cs[K] extends Component<infer T> ? T : never;
};

export function query<Cs extends readonly Component<any>[]>(
  world: World,
  ...components: Cs
): Array<[Entity, ...QueryResult<Cs>]> {
  if (components.length === 0) return [];

  // 1. Берём компонент с минимальным store
  let primary = components[0];

  for (let i = 1; i < components.length; i++) {
    if (components[i].store.size < primary.store.size) {
      primary = components[i];
    }
  }

  const result: Array<[Entity, ...QueryResult<Cs>]> = [];

  // 2. Итерируемся по минимальному
  for (const [entity, primaryValue] of primary.store) {
    const values: any[] = [primaryValue];
    let matched = true;

    for (const component of components) {
      if (component === primary) continue;

      const value = component.store.get(entity);
      if (value === undefined) {
        matched = false;
        break;
      }

      values.push(value);
    }

    if (!matched) continue;

    result.push([entity, ...values] as unknown as [Entity, ...QueryResult<Cs>]);
  }

  return result;
}

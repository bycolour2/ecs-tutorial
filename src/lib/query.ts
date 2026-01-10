import { Component, Entity, World } from '~/types';

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

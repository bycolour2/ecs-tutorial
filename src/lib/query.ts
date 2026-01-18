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

export function queryByComponentValue<
  Cs extends readonly Component<any>[],
  Index extends number = never,
>(
  world: World,
  ...args: [
    ...components: Cs,
    filter: {
      componentIndex: Index;
      predicate: (value: Cs[Index] extends Component<infer T> ? T : never) => boolean;
    },
  ]
): Array<[Entity, ...QueryResult<Cs>]> {
  const { componentIndex, predicate } = args[args.length - 1] as any;
  const components = args.slice(0, -1) as unknown as Cs;

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

    // 3. Применяем фильтр
    const filterValue = values[componentIndex];
    if (filterValue !== undefined && predicate(filterValue)) {
      result.push([entity, ...values] as unknown as [Entity, ...QueryResult<Cs>]);
    }
  }

  return result;
}

export function queryFirstN<Cs extends readonly Component<any>[]>(
  world: World,
  ...args: [...components: Cs, n: number]
): Array<[Entity, ...QueryResult<Cs>]> {
  const n = args[args.length - 1] as number;
  const components = args.slice(0, -1) as unknown as Cs;

  if (components.length === 0) return [];
  if (n <= 0) return [];

  // 1. Берём компонент с минимальным store
  let primary = components[0];

  for (let i = 1; i < components.length; i++) {
    if (components[i].store.size < primary.store.size) {
      primary = components[i];
    }
  }

  const result: Array<[Entity, ...QueryResult<Cs>]> = [];
  let count = 0;

  // 2. Итерируемся по минимальному, но не более N результатов
  for (const [entity, primaryValue] of primary.store) {
    if (count >= n) break;

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
    count++;
  }

  return result;
}

export function queryWithout<
  Cs extends readonly Component<any>[],
  WCs extends readonly Component<any>[],
>(world: World, ...args: [...components: Cs, without: WCs]): Array<[Entity, ...QueryResult<Cs>]> {
  const without = args[args.length - 1] as WCs;
  const components = args.slice(0, -1) as unknown as Cs;

  if (components.length === 0) return [];
  if (without.length === 0) return query(world, ...components);

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

    // Проверяем наличие всех required компонентов
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

    // 3. Проверяем отсутствие исключаемых компонентов
    let hasWithout = false;
    for (const withoutComponent of without) {
      if (withoutComponent.store.has(entity)) {
        hasWithout = true;
        break;
      }
    }

    if (hasWithout) continue;

    result.push([entity, ...values] as unknown as [Entity, ...QueryResult<Cs>]);
  }

  return result;
}

export function queryAny<Cs extends readonly Component<any>[]>(
  world: World,
  ...components: Cs
): Array<[Entity, Cs[number] extends Component<infer T> ? T : never]> {
  if (components.length === 0) return [];

  const result: Array<[Entity, Cs[number] extends Component<infer T> ? T : never]> = [];
  const seenEntities = new Set<Entity>();

  // Итерируемся по каждому компоненту
  for (const component of components) {
    for (const [entity, value] of component.store) {
      if (seenEntities.has(entity)) continue;

      seenEntities.add(entity);
      result.push([entity, value] as [Entity, Cs[number] extends Component<infer T> ? T : never]);
    }
  }

  return result;
}

export function hasComponent<T>(world: World, component: Component<T>, entity: Entity): boolean {
  const store = world.components.get(component.name);
  if (!store) return false;
  return store.store.has(entity);
}

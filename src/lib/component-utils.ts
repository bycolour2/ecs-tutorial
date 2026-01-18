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

export function getComponentValue<T>(
  world: World,
  component: Component<T>,
  entity: Entity,
): T | undefined {
  const store = getComponent(world, component);
  return store.get(entity);
}

export function removeAllComponents(world: World, entity: Entity) {
  for (const [, component] of world.components) {
    component.store.delete(entity);
  }
}

/**
 * Очищает все компоненты в мире.
 * Полезно для тестов и replay детерминизма.
 */
export function clearAllComponents(world: World) {
  for (const [, component] of world.components) {
    component.store.clear();
  }
}

/**
 * Очищает все компоненты в мире.
 * Это та же функция, что и clearAllComponents, но с более описательным именем.
 */
export function clearComponentStores(world: World) {
  for (const component of world.components.values()) {
    component.store.clear();
  }
}

/**
 * Сбрасывает все компоненты, которые были зарегистрированы.
 * Это полезно для очистки состояния между тестами.
 */
export function resetAllRegisteredComponents() {
  // Эта функция не может очистить все компоненты напрямую,
  // так как компоненты создаются как глобальные константы.
  // Вместо этого рекомендуется использовать clearAllComponents(world)
  // или создать новые компоненты для каждого мира.
  console.warn('resetAllRegisteredComponents: Components are created as global constants and cannot be reset directly. Use clearAllComponents(world) instead.');
}

/**
 * Сбрасывает все зарегистрированные компоненты по их именам.
 * Полезно для детерминизма при replay.
 */
export function clearComponentStores(world: World) {
  for (const component of world.components.values()) {
    component.store.clear();
  }
}

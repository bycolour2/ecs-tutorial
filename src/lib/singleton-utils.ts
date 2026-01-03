import { Singleton, World } from '../types';

export function registerSingleton<T>(world: World, singleton: Singleton<T>) {
  world.singletons.set(singleton.name, structuredClone(singleton.initial));
}

export function getSingleton<T>(world: World, singleton: Singleton<T>): T {
  const value = world.singletons.get(singleton.name);

  if (!value) {
    throw new Error(`Singleton ${singleton.name} not registered`);
  }

  return value as T;
}

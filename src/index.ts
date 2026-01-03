import { ProductionComponent, ResourceComponent } from './components';
import { simulate } from './game-loop';
import { addComponent, registerComponent } from './lib/component-utils';
import { getSingleton, registerSingleton } from './lib/singleton-utils';
import { TimeSingleton } from './singletons';
import { Component, Entity, World } from './types';

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

const world = createWorld();

registerComponent(world, ResourceComponent);
registerComponent(world, ProductionComponent);
registerSingleton(world, TimeSingleton);

const entity = createEntity();
const resourceEntity = createEntity();

addComponent(world, resourceEntity, ResourceComponent, {
  amount: 0,
});

addComponent(world, entity, ProductionComponent, {
  ratePerSecond: 2,
  target: resourceEntity,
});

console.log(
  getSingleton(world, TimeSingleton),
  ProductionComponent.store.get(entity),
  ResourceComponent.store.get(resourceEntity),
);

simulate(world, 250);
console.log(
  getSingleton(world, TimeSingleton),
  ProductionComponent.store.get(entity),
  ResourceComponent.store.get(resourceEntity),
);

simulate(world, 750);
console.log(
  getSingleton(world, TimeSingleton),
  ProductionComponent.store.get(entity),
  ResourceComponent.store.get(resourceEntity),
);

simulate(world, 5000);
console.log(
  getSingleton(world, TimeSingleton),
  ProductionComponent.store.get(entity),
  ResourceComponent.store.get(resourceEntity),
);

simulate(world, 1000 * 60 * 60 * 24);
console.log(
  getSingleton(world, TimeSingleton),
  ProductionComponent.store.get(entity),
  ResourceComponent.store.get(resourceEntity),
);

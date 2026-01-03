import {
  DamageComponent,
  HealthComponent,
  PositionComponent,
  VelocityComponent,
} from './components';
import { addComponent } from './lib/component-utils';
import { Component, Entity, World } from './types';

let nextEntityId = 1;

// createEntity creates a new entity
export function createEntity(): Entity {
  return nextEntityId++;
}

export function createWorld(components: Component<any>[]): World {
  return {
    components: new Map(components.map((component) => [component.name, component])),
    singletons: new Map(),
  };
}

const world = createWorld([PositionComponent, VelocityComponent, HealthComponent, DamageComponent]);

const player = createEntity();

addComponent(world, player, PositionComponent, { x: 0, y: 0 });
addComponent(world, player, VelocityComponent, { dx: 10, dy: 0 });
addComponent(world, player, HealthComponent, { value: 100, max: 100 });
addComponent(world, player, DamageComponent, { amount: 10 });
// console.dir(world, { depth: null });

// removeAllComponents(world, player);

// addHealth(world, player, { value: 100, max: 100 });
// addDamage(world, player, { amount: 10 });

// console.log('before movement', getComponent(world, PositionComponent).get(player));
// { x: 0, y: 0 }

// movementSystem(world, 1);

// console.log('after movement', getComponent(world, PositionComponent).get(player));
// { x: 10, y: 0 }

// console.log('before damage', getComponent(world, HealthComponent).get(player));
// { value: 100, max: 100 }

// damageSystem(world);
// addComponent(world, player, DamageComponent, { amount: 100 });
// damageSystem(world);
// deathSystem(world);

// console.log('after damage', getComponent(world, HealthComponent).get(player));
// { value: 90, max: 100 }

console.dir(world, { depth: null });

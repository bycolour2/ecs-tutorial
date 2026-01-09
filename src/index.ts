import {
  ModifierComponent,
  OwnedByComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  UserComponent,
} from './components';
import { simulate } from './game-loop';
import { addComponent, registerComponent } from './lib/component-utils';
import { logWorldState } from './lib/logger';
import { registerSingleton } from './lib/singleton-utils';
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
registerComponent(world, ResourceGeneratorComponent);
registerComponent(world, ModifierComponent);
registerSingleton(world, TimeSingleton);

const userEntity = createEntity();
addComponent(world, userEntity, UserComponent, { id: 'player-1' });

const goldEntity = createEntity();
addComponent(world, goldEntity, ResourceComponent, {
  type: 'gold',
  amount: 0,
  cap: 5000,
});
addComponent(world, goldEntity, OwnedByComponent, { user: userEntity });

const minerEntity = createEntity();
addComponent(world, minerEntity, ResourceGeneratorComponent, {
  resource: 'gold',
  ratePerSecond: 5,
});
addComponent(world, minerEntity, OwnedByComponent, { user: userEntity });

const woodEntity = createEntity();
addComponent(world, woodEntity, ResourceComponent, {
  type: 'wood',
  amount: 0,
  cap: 2000,
});
addComponent(world, woodEntity, OwnedByComponent, { user: userEntity });

const sawmillEntity = createEntity();
addComponent(world, sawmillEntity, ResourceGeneratorComponent, {
  resource: 'wood',
  ratePerSecond: 2,
});
addComponent(world, sawmillEntity, OwnedByComponent, { user: userEntity });

const goldBoostEntity = createEntity();
addComponent(world, goldBoostEntity, ModifierComponent, {
  stat: 'production',
  resource: 'gold',
  value: 1.0,
});
addComponent(world, goldBoostEntity, OwnedByComponent, { user: userEntity });

const globalBoostEntity = createEntity();
addComponent(world, globalBoostEntity, ModifierComponent, {
  stat: 'production',
  value: 0.5,
});
addComponent(world, globalBoostEntity, OwnedByComponent, { user: userEntity });

// ---- Game simulation
logWorldState(world);

simulate(world, 2000);

logWorldState(world);

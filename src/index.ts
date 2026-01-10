import {
  CostComponent,
  LimitComponent,
  ModifierComponent,
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
  UpgradeComponent,
  UserComponent,
} from './components';
import { simulate } from './game-loop';
import { addComponent, registerComponent } from './lib/component-utils';
import { logWorldState } from './lib/logger';
import { registerSingleton } from './lib/singleton-utils';
import { TimeSingleton } from './singletons';
import { purchaseUpgrade } from './systems';
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
registerComponent(world, UserComponent);
registerComponent(world, OwnedByComponent);
registerComponent(world, ResourceGeneratorComponent);
registerComponent(world, ModifierComponent);
registerComponent(world, CostComponent);
registerComponent(world, LimitComponent);
registerComponent(world, UpgradeComponent);

registerSingleton(world, TimeSingleton);

// const userEntity = createEntity();
// addComponent(world, userEntity, UserComponent, { id: 'player-1' });

// const goldEntity = createEntity();
// addComponent(world, goldEntity, ResourceComponent, {
//   type: 'food',
//   amount: 0,
//   cap: 5000,
// });
// addComponent(world, goldEntity, OwnedByComponent, { user: userEntity });

// const minerEntity = createEntity();
// addComponent(world, minerEntity, ResourceGeneratorComponent, {
//   resource: 'gold',
//   ratePerSecond: 5,
// });
// addComponent(world, minerEntity, OwnedByComponent, { user: userEntity });

// const woodEntity = createEntity();
// addComponent(world, woodEntity, ResourceComponent, {
//   type: 'ore',
//   amount: 0,
//   cap: 2000,
// });
// addComponent(world, woodEntity, OwnedByComponent, { user: userEntity });

// const sawmillEntity = createEntity();
// addComponent(world, sawmillEntity, ResourceGeneratorComponent, {
//   resource: 'wood',
//   ratePerSecond: 2,
// });
// addComponent(world, sawmillEntity, OwnedByComponent, { user: userEntity });

// const goldUpgradeEntity = createEntity();
// addComponent(world, goldUpgradeEntity, UpgradeComponent, {
//   id: 'gold-upgrade-1',
// });
// addComponent(world, goldUpgradeEntity, ModifierComponent, {
//   stat: 'production',
//   resource: 'gold',
//   value: 0.5,
// });
// addComponent(world, goldUpgradeEntity, CostComponent, {
//   resource: 'gold',
//   base: 100 * RESOURCES_PRECISION,
//   growth: 1.5,
// });
// addComponent(world, goldUpgradeEntity, LimitComponent, {
//   max: 2,
// });

// ---- Game simulation
logWorldState(world);

simulate(world, 20000);

logWorldState(world);

// purchaseUpgrade(world, userEntity, goldUpgradeEntity);
simulate(world, 2000);

logWorldState(world);

// simulate(world, 30000);

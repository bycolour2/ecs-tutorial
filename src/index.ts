import {
  createExtractionStations,
  createMerchant,
  createUpgrades,
  createUser,
  createUserResources,
  registerComponents,
  registerSingletons,
} from '~/bootstrap';
import { ResourceComponent } from '~/components';
import { emitStartExpedition } from '~/events';
import { simulate } from '~/game-loop';
import { getComponent } from '~/lib/component-utils';
import { createChangesLogger } from '~/lib/logger';
import { createWorld } from '~/lib/world-utils';
import { getPlayerResources } from '~/snapshots';
import { buildStationSystem, purchaseUpgradeSystem, sellResourceSystem } from '~/systems';

const world = createWorld();

registerComponents(world);
registerSingletons(world);

const user = createUser(world);
createUserResources(world, user);
createExtractionStations(world, user);
createMerchant(world);
createUpgrades(world);

const logChanges = createChangesLogger(world);

// временно мутируем ресурсы вручную
for (const [, res] of getComponent(world, ResourceComponent) ?? []) {
  if (res.type === 'ore') res.amount = 100;
}

logChanges(world);

buildStationSystem(world, 'ore');

logChanges(world);

simulate(world, 10_000);

logChanges(world);

sellResourceSystem(world, user, 'ore', 20);

logChanges(world);

purchaseUpgradeSystem(world, user, 'ore_station_level_2');

logChanges(world);

simulate(world, 10_000);

logChanges(world);

simulate(world, 50_000);

logChanges(world);

simulate(world, 10_000);

logChanges(world);

emitStartExpedition(world, user, 'crystal');

logChanges(world);

simulate(world, 20_000);

logChanges(world);

simulate(world, 40_000);

logChanges(world);

console.log(getPlayerResources(world, user));

// const userEntity = createEntity();
// addComponent(world, UserComponent, userEntity, { id: 'player-1' });

// const goldEntity = createEntity();
// addComponent(world, ResourceComponent, goldEntity, {
//   type: 'food',
//   amount: 0,
//   cap: 5000,
// });
// addComponent(world, OwnedByComponent, goldEntity, { user: userEntity });

// const minerEntity = createEntity();
// addComponent(world, ResourceGeneratorComponent, minerEntity, {
//   resource: 'gold',
//   ratePerSecond: 5,
// });
// addComponent(world, OwnedByComponent, minerEntity, { user: userEntity });

// const woodEntity = createEntity();
// addComponent(world, ResourceComponent, woodEntity, {
//   type: 'ore',
//   amount: 0,
//   cap: 2000,
// });
// addComponent(world, OwnedByComponent, woodEntity, { user: userEntity });

// const sawmillEntity = createEntity();
// addComponent(world, ResourceGeneratorComponent, sawmillEntity, {
//   resource: 'wood',
//   ratePerSecond: 2,
// });
// addComponent(world, OwnedByComponent, sawmillEntity, { user: userEntity });

// const goldUpgradeEntity = createEntity();
// addComponent(world, UpgradeComponent, goldUpgradeEntity, {
//   id: 'gold-upgrade-1',
// });
// addComponent(world, ModifierComponent, goldUpgradeEntity, {
//   stat: 'production',
//   resource: 'gold',
//   value: 0.5,
// });
// addComponent(world, CostComponent, goldUpgradeEntity, {
//   resource: 'gold',
//   base: 100 * RESOURCES_PRECISION,
//   growth: 1.5,
// });
// addComponent(world, LimitComponent, goldUpgradeEntity, {
//   max: 2,
// });

// ---- Game simulation
// logWorldState(world);

// simulate(world, 20000);

// logWorldState(world);

// purchaseUpgrade(world, userEntity, goldUpgradeEntity);
// simulate(world, 2000);

// logWorldState(world);

// simulate(world, 30000);

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
import { getComponent } from '~/lib/component-utils';
import { createChangesLogger } from '~/lib/logger';
import { createWorld } from '~/lib/world-utils';
import { getPlayerResources } from '~/snapshots';
import {
  buildStationSystem,
  productionSystem,
  purchaseUpgradeSystem,
  resourceClampSystem,
  sellResourceSystem,
  upgradeProgressSystem,
} from '~/systems';

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

productionSystem(world, 10000);

logChanges(world);

sellResourceSystem(world, user, 'ore', 20);

logChanges(world);

resourceClampSystem(world);

purchaseUpgradeSystem(world, user, 'ore_station_level_2');

logChanges(world);

upgradeProgressSystem(world, 10000);

logChanges(world);

upgradeProgressSystem(world, 50000);

logChanges(world);

productionSystem(world, 10000);

logChanges(world);
console.log(getPlayerResources(world, user));

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
// logWorldState(world);

// simulate(world, 20000);

// logWorldState(world);

// purchaseUpgrade(world, userEntity, goldUpgradeEntity);
// simulate(world, 2000);

// logWorldState(world);

// simulate(world, 30000);

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
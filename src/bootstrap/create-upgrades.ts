import { UpgradeDefinitionComponent, UpgradeStateComponent } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function createUpgrades(world: World) {
  const upgradeEntity = createEntity();

  addComponent(world, upgradeEntity, UpgradeDefinitionComponent, {
    id: 'ore_station_level_2',
    cost: {
      ore: 50,
      money: 20,
    },
    duration: 30,
  });

  addComponent(world, upgradeEntity, UpgradeStateComponent, {
    state: 'available',
  });
}

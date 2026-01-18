import {
  ModifierComponent,
  ProvidedByUpgradeComponent,
  UpgradeDefinitionComponent,
  UpgradeStateComponent,
} from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function createUpgrades(world: World) {
  const upgradeEntity = createEntity();

  addComponent(world, UpgradeDefinitionComponent, upgradeEntity, {
    id: 'ore_station_level_2',
    cost: {
      ore: 50,
      money: 20,
    },
    duration: 30,
  });

  addComponent(world, UpgradeStateComponent, upgradeEntity, {
    state: 'available',
  });

  const modifierEntity = createEntity();

  addComponent(world, ModifierComponent, modifierEntity, {
    target: 'generator_rate',
    resource: 'ore',
    value: 1,
  });

  addComponent(world, ProvidedByUpgradeComponent, modifierEntity, {
    source: upgradeEntity,
  });
}

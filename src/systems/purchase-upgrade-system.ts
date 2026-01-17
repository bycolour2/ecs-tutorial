import {
  OwnedByComponent,
  ResourceComponent,
  UpgradeDefinitionComponent,
  UpgradeProgressComponent,
  UpgradeStateComponent,
} from '~/components';
import { Entity, World } from '~/types';
import { addComponent } from '~/lib/world-utils';
import { query } from '~/lib/query';

export function purchaseUpgradeSystem(world: World, user: Entity, upgradeId: string) {
  for (const [entity, upgrade, state] of query(
    world,
    UpgradeDefinitionComponent,
    UpgradeStateComponent,
  )) {
    if (upgrade.id !== upgradeId) continue;
    if (state.state !== 'available') continue;

    // проверяем, достаточно ли ресурсов
    for (const [resourceType, cost] of Object.entries(upgrade.cost)) {
      let available = 0;

      for (const [, resource, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
        if (ownedBy.owner !== user) continue;
        if (resource.type === resourceType) {
          available = resource.amount;
          break;
        }
      }

      if (available < cost) return;
    }

    // списываем ресурсы
    for (const [type, cost] of Object.entries(upgrade.cost)) {
      for (const [, resource, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
        if (ownedBy.owner !== user) continue;
        if (resource.type === type) {
          resource.amount -= cost;
        }
      }
    }

    state.state = 'inProgress';

    addComponent(world, entity, UpgradeProgressComponent, {
      progress: 0,
    });

    return;
  }
}

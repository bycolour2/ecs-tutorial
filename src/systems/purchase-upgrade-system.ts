import { createEntity } from '..';
import {
  CostComponent,
  LimitComponent,
  ModifierComponent,
  OwnedByComponent,
  ResourceComponent,
  UpgradeComponent,
  getUpgradeCost,
} from '../components';
import { addComponent, query } from '../lib/component-utils';
import { countAppliedUpgrades } from '../lib/selectors';
import { Entity, World } from '../types';

export function purchaseUpgrade(world: World, user: Entity, blueprint: Entity): boolean {
  const upgrade = UpgradeComponent.store.get(blueprint)!;
  const cost = CostComponent.store.get(blueprint)!;
  const limit = LimitComponent.store.get(blueprint);

  const level = countAppliedUpgrades(world, user, upgrade.id);

  // лимит
  if (limit && level >= limit.max) {
    return false;
  }

  const price = getUpgradeCost(cost, level);

  // ищем ресурс пользователя
  const resources = query(world, ResourceComponent, OwnedByComponent);

  const resourceEntry = resources.find(
    ([, res, owner]) => owner.user === user && res.type === cost.resource,
  );

  if (!resourceEntry) return false;

  const [, resource] = resourceEntry;

  // недостаточно ресурсов
  if (resource.amount < price) {
    return false;
  }

  // списываем
  resource.amount -= price;

  // применяем апгрейд → создаём сущность модификатора
  const modifier = ModifierComponent.store.get(blueprint)!;

  const appliedEntity = createEntity();

  addComponent(world, appliedEntity, ModifierComponent, modifier);
  addComponent(world, appliedEntity, OwnedByComponent, { user });
  addComponent(world, appliedEntity, UpgradeComponent, { id: upgrade.id });

  return true;
}

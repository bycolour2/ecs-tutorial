import {
  CostComponent,
  LimitComponent,
  ModifierComponent,
  OwnedByComponent,
  ResourceComponent,
  UpgradeComponent,
  getUpgradeCost,
} from '../components';
import { getComponentValue } from '../lib/component-utils';
import { countAppliedUpgrades } from '../lib/selectors';
import { Entity, World } from '~/types';
import { addComponent, createEntity } from '~/lib/world-utils';
import { query } from '~/lib/query';

export function purchaseUpgrade(world: World, user: Entity, blueprint: Entity): boolean {
  const upgrade = getComponentValue(world, UpgradeComponent, blueprint);
  const cost = getComponentValue(world, CostComponent, blueprint);
  const limit = getComponentValue(world, LimitComponent, blueprint);

  if (!upgrade || !cost) {
    return false;
  }

  const level = countAppliedUpgrades(world, user, upgrade.id);

  // лимит
  if (limit && level >= limit.max) {
    return false;
  }

  const price = getUpgradeCost(cost, level);

  // ищем ресурс пользователя
  const resources = query(world, ResourceComponent, OwnedByComponent);

  const resourceEntry = resources.find(
    ([, res, owner]) => owner.owner === user && res.type === cost.resource,
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
  const modifier = getComponentValue(world, ModifierComponent, blueprint);

  if (!modifier) {
    return false;
  }

  const appliedEntity = createEntity();

  addComponent(world, appliedEntity, ModifierComponent, modifier);
  addComponent(world, appliedEntity, OwnedByComponent, { owner: user });
  addComponent(world, appliedEntity, UpgradeComponent, { id: upgrade.id });

  return true;
}

import { createEntity } from '..';
import {
  CostComponent,
  ModifierComponent,
  OwnedByComponent,
  ResourceComponent,
} from '../components';
import { addComponent, query } from '../lib/component-utils';
import { World } from '../types';

export function purchaseUpgradeSystem(world: World, user: number, upgradeEntity: number): boolean {
  const cost = CostComponent.store.get(upgradeEntity);
  if (!cost) return false;

  // ищем ресурс пользователя
  const resources = query(world, ResourceComponent, OwnedByComponent);

  const resourceEntry = resources.find(
    ([, res, owner]) => owner.user === user && res.type === cost.resource,
  );

  if (!resourceEntry) return false;

  const [, resource] = resourceEntry;

  // недостаточно ресурсов
  if (resource.amount < cost.amount) {
    return false;
  }

  // списываем
  resource.amount -= cost.amount;

  // применяем апгрейд → создаём сущность модификатора
  const modifier = ModifierComponent.store.get(upgradeEntity)!;

  const appliedEntity = createEntity();

  addComponent(world, appliedEntity, ModifierComponent, modifier);
  addComponent(world, appliedEntity, OwnedByComponent, { user });

  return true;
}

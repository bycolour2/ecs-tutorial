import {
  CostComponent,
  ModifierComponent,
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
  UpgradeComponent,
  getUpgradeCost,
} from '../components';
import { World } from '../types';
import { query } from './component-utils';

export function selectUserResources(world: World, user: number) {
  const resources = query(world, ResourceComponent, OwnedByComponent);

  return resources
    .filter(([, , owner]) => owner.user === user)
    .map(([, res]) => ({
      type: res.type,
      value: res.amount / RESOURCES_PRECISION,
    }));
}

export function selectUserGenerators(world: World, user: number) {
  const gens = query(world, ResourceGeneratorComponent, OwnedByComponent);

  return gens
    .filter(([, , owner]) => owner.user === user)
    .map(([, gen]) => ({
      resource: gen.resource,
      ratePerSecond: gen.ratePerSecond,
    }));
}

export function getProductionMultiplier(world: World, user: number, resource: string) {
  const modifiers = query(world, ModifierComponent, OwnedByComponent);

  let bonus = 0;

  for (const [, mod, owner] of modifiers) {
    if (owner.user !== user) continue;
    if (mod.stat !== 'production') continue;
    if (mod.resource && mod.resource !== resource) continue;

    bonus += mod.value;
  }

  return Math.max(0, 1 + bonus);
}

export function selectUserUpgrades(world: World, user: number) {
  const mods = query(world, ModifierComponent, OwnedByComponent);

  return mods
    .filter(([, , owner]) => owner.user === user)
    .map(([, mod]) => ({
      stat: mod.stat,
      resource: mod.resource ?? 'all',
      multiplier: mod.value,
    }));
}

export function selectAvailableUpgrades(world: World, user: number) {
  const blueprints = query(world, UpgradeComponent, ModifierComponent, CostComponent);

  return blueprints.map(([, upgrade, mod, cost]) => {
    const applied = countAppliedUpgrades(world, user, upgrade.id);

    const level = applied + 1;
    const price = getUpgradeCost(cost, level);

    return {
      id: upgrade.id,
      effect: mod,
      level: applied,
      nextCost: price / RESOURCES_PRECISION,
    };
  });
}

export function countAppliedUpgrades(world: World, user: number, upgradeId: string) {
  const applied = query(world, ModifierComponent, OwnedByComponent, UpgradeComponent);

  return applied.filter(([, , owner, upgrade]) => owner.user === user && upgrade.id === upgradeId)
    .length;
}

import {
  CostComponent,
  ModifierComponent,
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
  UpgradeComponent,
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

  let multiplier = 1;

  for (const [, mod, owner] of modifiers) {
    if (owner.user !== user) continue;
    if (mod.stat !== 'production') continue;
    if (mod.resource && mod.resource !== resource) continue;

    multiplier *= mod.multiplier;
  }

  return multiplier;
}

export function selectUserUpgrades(world: World, user: number) {
  const mods = query(world, ModifierComponent, OwnedByComponent);

  return mods
    .filter(([, , owner]) => owner.user === user)
    .map(([, mod]) => ({
      stat: mod.stat,
      resource: mod.resource ?? 'all',
      multiplier: mod.multiplier,
    }));
}

export function selectAvailableUpgrades(world: World) {
  const upgrades = query(world, UpgradeComponent, ModifierComponent, CostComponent);

  return upgrades.map(([, upg, mod, cost]) => ({
    id: upg.id,
    effect: mod,
    cost: {
      resource: cost.resource,
      amount: cost.amount / RESOURCES_PRECISION,
    },
  }));
}

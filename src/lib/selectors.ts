import {
  OwnedByComponent,
  RESOURCES_PRECISION,
  ResourceComponent,
  ResourceGeneratorComponent,
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

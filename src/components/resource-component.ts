import { createComponent } from '~/lib/component-utils';

export const RESOURCES_PRECISION = 1000;

export type ResourceType = 'ore' | 'energy' | 'food' | 'money' | 'crystal' | 'artifact';

export type Resource = {
  type: ResourceType;
  amount: number;
  cap?: number;
};

export const ResourceComponent = createComponent<Resource>('Resource');

export function displayResource(resource: Resource) {
  return resource.amount / RESOURCES_PRECISION;
}

import { createComponent } from '~/lib/component-utils';

export const RESOURCES_PRECISION = 1000;

export type BaseResourceType = 'ore' | 'energy' | 'food' | 'money';
export type SpecialResourceType = 'crystal' | 'artifact';
export type ResourceType = BaseResourceType | SpecialResourceType;

export type Resource = {
  type: ResourceType;
  amount: number;
  cap?: number;
};

export const ResourceComponent = createComponent<Resource>('Resource');

export function displayResource(resource: Resource) {
  return resource.amount / RESOURCES_PRECISION;
}

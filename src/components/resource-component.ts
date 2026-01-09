import { createComponent } from '../lib/component-utils';

export const RESOURCES_PRECISION = 1000;

export type Resource = {
  type: string;
  amount: number;
  cap?: number;
};

export const ResourceComponent = createComponent<Resource>('Resource');

export function displayResource(resource: Resource) {
  return resource.amount / RESOURCES_PRECISION;
}

import { createComponent } from '../lib/component-utils';

export type Cost = {
  resource: string;
  amount: number; // уже с учётом RESOURCES_PRECISION
};

export const CostComponent = createComponent<Cost>('Cost');

import { createComponent } from '../lib/component-utils';

export type Resource = {
  amount: number;
};

export const ResourceComponent = createComponent<Resource>('Resource');

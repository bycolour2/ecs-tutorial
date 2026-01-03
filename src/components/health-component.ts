import { createComponent } from '../lib/component-utils';

export type Health = {
  value: number;
  max: number;
};

export const HealthComponent = createComponent<Health>('Health');

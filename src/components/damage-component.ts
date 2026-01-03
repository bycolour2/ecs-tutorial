import { createComponent } from '../lib/component-utils';

export type Damage = {
  amount: number;
};

export const DamageComponent = createComponent<Damage>('Damage');

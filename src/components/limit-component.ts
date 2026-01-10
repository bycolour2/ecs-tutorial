import { createComponent } from '~/lib/component-utils';

export type Limit = {
  max: number;
};

export const LimitComponent = createComponent<Limit>('Limit');

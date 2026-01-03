import { createComponent } from '../lib/component-utils';

export type Velocity = {
  dx: number;
  dy: number;
};

export const VelocityComponent = createComponent<Velocity>('Velocity');

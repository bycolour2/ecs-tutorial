import { createComponent } from '../lib/component-utils';

export type Position = {
  x: number;
  y: number;
};

export const PositionComponent = createComponent<Position>('Position');

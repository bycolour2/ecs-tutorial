import { createComponent } from '../lib/component-utils';
import { Entity } from '../types';

export type Production = {
  ratePerSecond: number;
  target: Entity;
};

export const ProductionComponent = createComponent<Production>('Production');

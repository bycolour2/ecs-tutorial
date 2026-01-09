import { createComponent } from '../lib/component-utils';
import { Entity } from '../types';

export type OwnedBy = {
  user: Entity; // entityId пользователя
};

export const OwnedByComponent = createComponent<OwnedBy>('OwnedBy');

import { Entity } from '~/types';
import { createComponent } from '~/lib/component-utils';

export type OwnedBy = {
  user: Entity; // entityId пользователя
};

export const OwnedByComponent = createComponent<OwnedBy>('OwnedBy');

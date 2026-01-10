import { Entity } from '~/types';
import { createComponent } from '~/lib/component-utils';

export type OwnedBy = {
  owner: Entity; // entityId пользователя
};

export const OwnedByComponent = createComponent<OwnedBy>('OwnedBy');

import { createComponent } from '../lib/component-utils';

export type OwnedBy = {
  user: number; // entityId пользователя
};

export const OwnedByComponent = createComponent<OwnedBy>('OwnedBy');

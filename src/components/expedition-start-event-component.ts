import { SpecialResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';
import { Entity } from '~/types';

export type ExpeditionStartEvent = {
  user: Entity;
  target: SpecialResourceType;
};

export const ExpeditionStartEventComponent =
  createComponent<ExpeditionStartEvent>('ExpeditionStartEvent');

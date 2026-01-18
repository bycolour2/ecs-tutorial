import { SpecialResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type Expedition = {
  target: SpecialResourceType;
  duration: number;
};

export const ExpeditionComponent = createComponent<Expedition>('Expedition');

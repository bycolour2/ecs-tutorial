import { createComponent } from '~/lib/component-utils';

export type ExpeditionProgress = {
  progress: number;
};

export const ExpeditionProgressComponent =
  createComponent<ExpeditionProgress>('ExpeditionProgress');

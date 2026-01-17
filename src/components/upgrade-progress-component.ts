import { createComponent } from '~/lib/component-utils';

export type UpgradeProgress = {
  progress: number;
};

export const UpgradeProgressComponent = createComponent<UpgradeProgress>('UpgradeProgress');

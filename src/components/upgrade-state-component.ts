import { createComponent } from '~/lib/component-utils';

export type UpgradeStateType = 'locked' | 'available' | 'inProgress' | 'completed';

export type UpgradeState = {
  state: UpgradeStateType;
};

export const UpgradeStateComponent = createComponent<UpgradeState>('UpgradeState');

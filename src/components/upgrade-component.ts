import { createComponent } from '~/lib/component-utils';

export type Upgrade = {
  id: string;
};

export const UpgradeComponent = createComponent<Upgrade>('Upgrade');

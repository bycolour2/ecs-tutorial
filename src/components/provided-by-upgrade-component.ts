import { createComponent } from '~/lib/component-utils';
import { Entity } from '~/types';

export type ProvidedByUpgrade = {
  source: Entity;
};

export const ProvidedByUpgradeComponent = createComponent<ProvidedByUpgrade>('ProvidedByUpgrade');

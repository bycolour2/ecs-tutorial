import { ResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type SellPrice = {
  resource: ResourceType;
  pricePerUnit: number;
};

export const SellPriceComponent = createComponent<SellPrice>('SellPrice');

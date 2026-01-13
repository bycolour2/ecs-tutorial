import { ResourceType } from '~/components/resource-component';
import { createComponent } from '~/lib/component-utils';

export type SellPrice = {
  resource: ResourceType;
  pricePerUnit: number;
};

export const SellPriceComponent = createComponent<SellPrice>('SellPrice');

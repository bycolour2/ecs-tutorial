import { createComponent } from '~/lib/component-utils';

export type ShopItem = {
  itemId: string;
  costMoney: number;
};

export const ShopItemComponent = createComponent<ShopItem>('ShopItem');

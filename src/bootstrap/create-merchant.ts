import {
  MerchantComponent,
  ProvidedByMerchantComponent,
  SellPriceComponent,
  ResourceType,
} from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { World } from '~/types';

const SELL_PRICES: Array<{ resource: ResourceType; pricePerUnit: number }> = [
  { resource: 'ore', pricePerUnit: 1 },
  { resource: 'energy', pricePerUnit: 2 },
  { resource: 'food', pricePerUnit: 2 },
];

export function createMerchant(world: World) {
  const merchantEntity = createEntity();

  addComponent(world, merchantEntity, MerchantComponent, {
    id: 'default',
  });

  for (const price of SELL_PRICES) {
    const sellPriceEntity = createEntity();

    addComponent(world, sellPriceEntity, SellPriceComponent, {
      resource: price.resource,
      pricePerUnit: price.pricePerUnit,
    });

    addComponent(world, sellPriceEntity, ProvidedByMerchantComponent, {
      merchant: merchantEntity,
    });
  }

  return merchantEntity;
}

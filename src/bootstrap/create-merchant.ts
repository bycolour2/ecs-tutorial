import { MerchantComponent, SellPriceComponent } from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { World } from '~/types';

export function createMerchant(world: World) {
  const merchantEntity = createEntity();

  addComponent(world, merchantEntity, MerchantComponent, {
    id: 'default',
  });

  addComponent(world, merchantEntity, SellPriceComponent, {
    resource: 'ore',
    pricePerUnit: 1,
  });

  addComponent(world, merchantEntity, SellPriceComponent, {
    resource: 'energy',
    pricePerUnit: 2,
  });

  addComponent(world, merchantEntity, SellPriceComponent, {
    resource: 'food',
    pricePerUnit: 2,
  });

  return merchantEntity;
}

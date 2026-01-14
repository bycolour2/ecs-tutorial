import {
  OwnedByComponent,
  ResourceComponent,
  ResourceType,
  SellPriceComponent,
} from '~/components';
import { query } from '~/lib/query';
import { Entity, World } from '~/types';

export function sellResourceSystem(
  world: World,
  user: Entity,
  resourceType: ResourceType,
  amount: number,
) {
  let price = 0;

  for (const [, sell] of query(world, SellPriceComponent)) {
    console.log('🚀 ~ sellResourceSystem ~ sell:', sell);
    if (sell.resource === resourceType) {
      console.log(
        '🚀 ~ sellResourceSystem ~ sell.resource === resourceType:',
        sell.resource === resourceType,
      );
      price = sell.pricePerUnit;
      break;
    }
  }

  console.log('🚀 ~ sellResourceSystem ~ price:', price);
  if (price === 0) return;

  let sold = 0;
  console.log('🚀 ~ sellResourceSystem ~ sold:', sold);

  for (const [, resource, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
    if (ownedBy.owner !== user) continue;
    if (resource.type !== resourceType) continue;

    sold = Math.min(resource.amount, amount);
    resource.amount -= sold;
  }

  console.log('🚀 ~ sellResourceSystem ~ sold:', sold);
  if (sold === 0) return;

  for (const [, money, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
    if (ownedBy.owner !== user) continue;
    if (money.type !== 'money') continue;

    money.amount += sold * price;
    console.log('🚀 ~ sellResourceSystem ~ money.amount:', money.amount);
  }
}

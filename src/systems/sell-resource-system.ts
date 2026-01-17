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
    if (sell.resource === resourceType) {
      price = sell.pricePerUnit;
      break;
    }
  }

  if (price === 0) return;

  let sold = 0;

  for (const [, resource, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
    if (ownedBy.owner !== user) continue;
    if (resource.type !== resourceType) continue;

    sold = Math.min(resource.amount, amount);
    resource.amount -= sold;
  }

  if (sold === 0) return;

  for (const [, money, ownedBy] of query(world, ResourceComponent, OwnedByComponent)) {
    if (ownedBy.owner !== user) continue;
    if (money.type !== 'money') continue;

    money.amount += sold * price;
  }
}

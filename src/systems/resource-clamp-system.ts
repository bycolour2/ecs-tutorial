import { ResourceComponent } from '~/components';
import { query } from '~/lib/query';
import { World } from '~/types';

export function resourceClampSystem(world: World) {
  for (const [, resource] of query(world, ResourceComponent)) {
    if (resource.cap === undefined) continue;

    if (resource.amount > resource.cap) {
      resource.amount = resource.cap;
    }

    if (resource.amount < 0) {
      resource.amount = 0;
    }
  }
}

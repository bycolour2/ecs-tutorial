import { query } from '~/lib/query';
import {
  ExtractionStationComponent,
  OwnedByComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
} from '~/components';
import { World } from '~/types';
import { collectActiveModifiers } from '~/selectors';

export function productionSystem(world: World, deltaMs: number) {
  const modifiers = collectActiveModifiers(world);

  for (const [, station, generator, ownedBy] of query(
    world,
    ExtractionStationComponent,
    ResourceGeneratorComponent,
    OwnedByComponent,
  )) {
    if (!station.built) continue;

    let rate = generator.baseRate * station.level;

    for (const mod of modifiers) {
      if (mod.target !== 'generator_rate') continue;
      if (mod.resource && mod.resource !== generator.resource) continue;

      rate += mod.value;
    }

    // начисление ресурса
    for (const [, resource, resourceOwner] of query(world, ResourceComponent, OwnedByComponent)) {
      if (resourceOwner.owner !== ownedBy.owner) continue;
      if (resource.type !== generator.resource) continue;

      resource.amount += rate * (deltaMs / 1000);
    }
  }
}

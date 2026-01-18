import {
  ExtractionStationComponent,
  OwnedByComponent,
  ResourceGeneratorComponent,
  ResourceType,
} from '~/components';
import { addComponent, createEntity } from '~/lib/world-utils';
import { Entity } from '~/types';

const STATIONS: Array<{ resource: ResourceType; rate: number }> = [
  { resource: 'ore', rate: 1 },
  { resource: 'energy', rate: 0.5 },
  { resource: 'food', rate: 0.5 },
];

export function createExtractionStations(world: any, user: Entity) {
  for (const station of STATIONS) {
    const extractionStationEntity = createEntity();

    addComponent(world, ExtractionStationComponent, extractionStationEntity, {
      resource: station.resource,
      level: 1,
      built: false,
    });

    addComponent(world, ResourceGeneratorComponent, extractionStationEntity, {
      resource: station.resource,
      baseRate: station.rate,
    });

    addComponent(world, OwnedByComponent, extractionStationEntity, {
      owner: user,
    });
  }
}

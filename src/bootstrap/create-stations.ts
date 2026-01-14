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

    addComponent(world, extractionStationEntity, ExtractionStationComponent, {
      resource: station.resource,
      level: 1,
      built: false,
    });

    addComponent(world, extractionStationEntity, ResourceGeneratorComponent, {
      resource: station.resource,
      baseRate: station.rate,
    });

    addComponent(world, extractionStationEntity, OwnedByComponent, {
      owner: user,
    });
  }
}

import { ResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type ExtractionStation = {
  resource: ResourceType;
  level: number;
  built: boolean;
};

export const ExtractionStationComponent = createComponent<ExtractionStation>('ExtractionStation');

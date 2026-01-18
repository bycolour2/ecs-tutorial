import { BaseResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type ExtractionStation = {
  resource: BaseResourceType;
  level: number;
  built: boolean;
};

export const ExtractionStationComponent = createComponent<ExtractionStation>('ExtractionStation');

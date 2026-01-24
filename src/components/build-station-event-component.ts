import { BaseResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';
import { Entity } from '~/types';

export type BuildStationEvent = {
  user: Entity;
  stationType: BaseResourceType;
};

export const BuildStationEventComponent = createComponent<BuildStationEvent>('BuildStationEvent');

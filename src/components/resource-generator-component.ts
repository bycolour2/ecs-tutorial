import { ResourceType } from '~/components/resource-component';
import { createComponent } from '~/lib/component-utils';

export type ResourceGenerator = {
  resource: ResourceType;
  baseRate: number; // в секунду
};

export const ResourceGeneratorComponent = createComponent<ResourceGenerator>('ResourceGenerator');

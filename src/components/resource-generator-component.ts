import { createComponent } from '~/lib/component-utils';

export type ResourceGenerator = {
  resource: string;
  ratePerSecond: number;
};

export const ResourceGeneratorComponent = createComponent<ResourceGenerator>('ResourceGenerator');

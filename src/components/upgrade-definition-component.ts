import { ResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type UpgradeDefinition = {
  id: string;
  cost: Partial<Record<ResourceType, number>>;
  duration: number;
};

export const UpgradeDefinitionComponent = createComponent<UpgradeDefinition>('UpgradeDefinition');

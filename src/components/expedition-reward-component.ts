import { SpecialResourceType } from '~/components';
import { createComponent } from '~/lib/component-utils';

export type ExpeditionReward = {
  resource: SpecialResourceType;
  amount: number;
};

export const ExpeditionRewardComponent = createComponent<ExpeditionReward>('ExpeditionReward');

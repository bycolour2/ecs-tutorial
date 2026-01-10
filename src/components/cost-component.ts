import { createComponent } from '~/lib/component-utils';

export type Cost = {
  resource: string;
  base: number; // уже с учётом RESOURCES_PRECISION
  growth: number;
};

export const CostComponent = createComponent<Cost>('Cost');

export function getUpgradeCost(cost: Cost, level: number) {
  return Math.floor(cost.base * Math.pow(cost.growth, level));
}

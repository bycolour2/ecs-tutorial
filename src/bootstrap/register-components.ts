import {
  CostComponent,
  ExtractionStationComponent,
  LimitComponent,
  MerchantComponent,
  ModifierComponent,
  OwnedByComponent,
  ProvidedByMerchantComponent,
  ProvidedByUpgradeComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  SellPriceComponent,
  ShopItemComponent,
  UpgradeDefinitionComponent,
  UpgradeProgressComponent,
  UpgradeStateComponent,
  UserComponent,
} from '~/components';
import { registerComponent } from '~/lib/component-utils';
import { World } from '~/types';

export function registerComponents(world: World) {
  registerComponent(world, UserComponent);
  registerComponent(world, OwnedByComponent);
  registerComponent(world, ResourceComponent);
  registerComponent(world, ExtractionStationComponent);
  registerComponent(world, ResourceGeneratorComponent);
  registerComponent(world, CostComponent);
  registerComponent(world, LimitComponent);
  registerComponent(world, MerchantComponent);
  registerComponent(world, ProvidedByMerchantComponent);
  registerComponent(world, SellPriceComponent);
  registerComponent(world, ShopItemComponent);
  registerComponent(world, UpgradeDefinitionComponent);
  registerComponent(world, UpgradeProgressComponent);
  registerComponent(world, UpgradeStateComponent);
  registerComponent(world, ModifierComponent);
  registerComponent(world, ProvidedByUpgradeComponent);
}

import {
  CostComponent,
  ExtractionStationComponent,
  LimitComponent,
  ModifierComponent,
  OwnedByComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  UpgradeComponent,
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
  registerComponent(world, UpgradeComponent);
  registerComponent(world, ModifierComponent);
  registerComponent(world, CostComponent);
  registerComponent(world, LimitComponent);
}

import {
  UpgradeDefinitionComponent,
  UpgradeProgressComponent,
  UpgradeStateComponent,
} from '~/components';
import { query } from '~/lib/query';
import { World } from '~/types';

export function upgradeProgressSystem(world: World, deltaSeconds: number) {
  for (const [, progress, state, definition] of query(
    world,
    UpgradeProgressComponent,
    UpgradeStateComponent,
    UpgradeDefinitionComponent,
  )) {
    if (state.state !== 'inProgress') continue;

    progress.progress += deltaSeconds;

    if (progress.progress >= definition.duration) {
      state.state = 'completed';
    }
  }
}

import {
  UpgradeDefinitionComponent,
  UpgradeProgressComponent,
  UpgradeStateComponent,
} from '~/components';
import { query } from '~/lib/query';
import { World } from '~/types';

export function upgradeProgressSystem(world: World, deltaMs: number) {
  for (const [, progress, state, definition] of query(
    world,
    UpgradeProgressComponent,
    UpgradeStateComponent,
    UpgradeDefinitionComponent,
  )) {
    if (state.state !== 'inProgress') continue;

    progress.progress += deltaMs;

    if (progress.progress >= definition.duration * 1000) {
      state.state = 'completed';
    }
  }
}

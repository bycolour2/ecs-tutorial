import {
  Modifier,
  ModifierComponent,
  ProvidedByUpgradeComponent,
  UpgradeStateComponent,
} from '~/components';
import { getComponentValue } from '~/lib/component-utils';
import { query } from '~/lib/query';
import { World } from '~/types';

export function collectActiveModifiers(world: World): Modifier[] {
  const result: Modifier[] = [];

  for (const [, modifier, providedBy] of query(
    world,
    ModifierComponent,
    ProvidedByUpgradeComponent,
  )) {
    const state = getComponentValue(world, UpgradeStateComponent, providedBy.source);

    if (!state) continue;
    if (state.state !== 'completed') continue;

    result.push(modifier);
  }

  return result;
}

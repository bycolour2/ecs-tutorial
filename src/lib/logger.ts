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
  RESOURCES_PRECISION,
} from '~/components';
import { TimeSingleton } from '~/singletons';
import { World } from '~/types';
import { getComponent, getComponentValue } from './component-utils';
import { getProductionMultiplier } from './selectors';
import { getSingleton } from './singleton-utils';

function formatNumber(value: number, precision = 2): string {
  return value.toFixed(precision).replace(/\.00$/, '');
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const s = seconds % 60;
  const m = Math.floor(seconds / 60) % 60;
  const h = Math.floor(seconds / 3600);

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function logWorldState(world: World): void {
  const time = getSingleton(world, TimeSingleton);

  console.log('================ WORLD STATE ================');

  // ---------- Time Singleton ----------
  console.log('Time:');
  console.log(`  nowMs: ${time.nowMs} (${formatTime(time.nowMs)})`);
  console.log(`  tick: ${time.tick}`);
  console.log(`  accumulatorMs: ${time.accumulatorMs}`);
  console.log('');

  // ---------- Users ----------
  console.log('Users:');
  const users = getComponent(world, UserComponent);
  if (users.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, user] of users) {
      console.log(`  [${entity}] id: ${user.id}`);
    }
  }
  console.log('');

  // ---------- Ownership ----------
  console.log('Ownership:');
  const ownership = getComponent(world, OwnedByComponent);
  if (ownership.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, ownedBy] of ownership) {
      console.log(`  [${entity}] owned by user entity [${ownedBy.owner}]`);
    }
  }
  console.log('');

  // ---------- Resources ----------
  console.log('Resources:');
  const resources = getComponent(world, ResourceComponent);
  if (resources.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, resource] of resources) {
      const amount = resource.amount;
      const capStr = resource.cap !== undefined ? ` / ${resource.cap}` : '';
      console.log(`  [${entity}] ${resource.type.toUpperCase()}: ${formatNumber(amount)}${capStr}`);
    }
  }
  console.log('');

  // ---------- Extraction Stations ----------
  console.log('Extraction Stations:');
  const extractionStations = getComponent(world, ExtractionStationComponent);
  if (extractionStations.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, station] of extractionStations) {
      const owner = getComponentValue(world, OwnedByComponent, entity);
      const ownerStr = owner ? ` [user: ${owner.owner}]` : ' (no owner)';
      const builtStr = station.built ? ' [built]' : ' [blueprint]';
      console.log(
        `  [${entity}] ${station.resource.toUpperCase()}: level ${
          station.level
        }${builtStr}${ownerStr}`,
      );
    }
  }
  console.log('');

  // ---------- Resource Generators ----------
  console.log('Resource Generators:');
  const resourceGenerators = getComponent(world, ResourceGeneratorComponent);
  if (resourceGenerators.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, generator] of resourceGenerators) {
      const owner = getComponentValue(world, OwnedByComponent, entity);
      if (owner) {
        const multiplier = getProductionMultiplier(world, owner.owner, generator.resource);
        const effectiveRate = generator.baseRate * multiplier;
        const multiplierStr = multiplier !== 1 ? ` (x${formatNumber(multiplier)})` : '';
        console.log(
          `  [${entity}] -> ${generator.resource} @ ${formatNumber(
            generator.baseRate,
          )}/sec${multiplierStr} = ${formatNumber(effectiveRate)}/sec`,
        );
      } else {
        console.log(
          `  [${entity}] -> ${generator.resource} @ ${formatNumber(
            generator.baseRate,
          )}/sec (no owner)`,
        );
      }
    }
  }
  console.log('');

  // ---------- Cost ----------
  console.log('Cost:');
  const costs = getComponent(world, CostComponent);
  if (costs.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, cost] of costs) {
      const base = cost.base / RESOURCES_PRECISION;
      console.log(
        `  [${entity}] ${cost.resource}: base=${formatNumber(base)}, growth=${formatNumber(
          cost.growth,
        )}`,
      );
    }
  }
  console.log('');

  // ---------- Limit ----------
  console.log('Limit:');
  const limits = getComponent(world, LimitComponent);
  if (limits.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, limit] of limits) {
      console.log(`  [${entity}] max: ${limit.max}`);
    }
  }
  console.log('');

  // ---------- Upgrade ----------
  console.log('Upgrade:');
  const upgrades = getComponent(world, UpgradeComponent);
  if (upgrades.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, upgrade] of upgrades) {
      console.log(`  [${entity}] id: ${upgrade.id}`);
    }
  }
  console.log('');

  // ---------- Modifier ----------
  console.log('Modifier:');
  const modifiers = getComponent(world, ModifierComponent);
  if (modifiers.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, modifier] of modifiers) {
      const owner = getComponentValue(world, OwnedByComponent, entity);
      const resourceStr = modifier.resource ? ` (${modifier.resource})` : ' (all)';
      const statusStr = owner ? ` [ACTIVE - user: ${owner.owner}]` : ' [blueprint]';
      console.log(
        `  [${entity}] ${modifier.stat}${resourceStr}: ${formatNumber(
          modifier.value,
        )}x${statusStr}`,
      );
    }
  }
  console.log('');

  // ---------- All Entities ----------
  const allEntities = new Set<number>();
  const entityComponents = new Map<number, string[]>();

  for (const [, component] of world.components) {
    const store = getComponent(world, component);
    for (const entity of store.keys()) {
      allEntities.add(entity);
      if (!entityComponents.has(entity)) {
        entityComponents.set(entity, []);
      }
      entityComponents.get(entity)!.push(component.name);
    }
  }

  console.log('All Entities:');
  if (allEntities.size === 0) {
    console.log('  (none)');
  } else {
    const sortedEntities = Array.from(allEntities).sort((a, b) => a - b);
    for (const entity of sortedEntities) {
      const components = entityComponents.get(entity) || [];
      const componentsStr = components.sort().join(', ');
      console.log(`  [${entity}] components: ${componentsStr}`);
    }
  }
  console.log('');

  // ---------- Summary ----------
  console.log(`Total Entities: ${allEntities.size}`);
  console.log('=============================================');
}

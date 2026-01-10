import {
  CostComponent,
  DamageComponent,
  HealthComponent,
  LimitComponent,
  ModifierComponent,
  OwnedByComponent,
  PositionComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  UpgradeComponent,
  UserComponent,
  VelocityComponent,
  RESOURCES_PRECISION,
} from '../components';
import { TimeSingleton } from '../singletons';
import { World } from '../types';
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
  if (UserComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, user] of UserComponent.store) {
      console.log(`  [${entity}] id: ${user.id}`);
    }
  }
  console.log('');

  // ---------- Resources ----------
  console.log('Resources:');
  if (ResourceComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, resource] of ResourceComponent.store) {
      const amount = resource.amount / RESOURCES_PRECISION;
      const capStr = resource.cap !== undefined ? ` / ${resource.cap / RESOURCES_PRECISION}` : '';
      console.log(`  [${entity}] ${resource.type.toUpperCase()}: ${formatNumber(amount)}${capStr}`);
    }
  }
  console.log('');

  // ---------- Generators ----------
  console.log('Generators:');
  if (ResourceGeneratorComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, generator] of ResourceGeneratorComponent.store) {
      const owner = OwnedByComponent.store.get(entity);
      if (owner) {
        const multiplier = getProductionMultiplier(world, owner.user, generator.resource);
        const effectiveRate = generator.ratePerSecond * multiplier;
        const multiplierStr = multiplier !== 1 ? ` (x${formatNumber(multiplier)})` : '';
        console.log(
          `  [${entity}] -> ${generator.resource} @ ${formatNumber(
            generator.ratePerSecond,
          )}/sec${multiplierStr} = ${formatNumber(effectiveRate)}/sec`,
        );
      } else {
        console.log(
          `  [${entity}] -> ${generator.resource} @ ${formatNumber(
            generator.ratePerSecond,
          )}/sec (no owner)`,
        );
      }
    }
  }
  console.log('');

  // ---------- Ownership ----------
  console.log('Ownership:');
  if (OwnedByComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, ownedBy] of OwnedByComponent.store) {
      console.log(`  [${entity}] owned by user entity [${ownedBy.user}]`);
    }
  }
  console.log('');

  // ---------- Health ----------
  console.log('Health:');
  if (HealthComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, health] of HealthComponent.store) {
      console.log(`  [${entity}] ${formatNumber(health.value)} / ${formatNumber(health.max)}`);
    }
  }
  console.log('');

  // ---------- Damage ----------
  console.log('Damage:');
  if (DamageComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, damage] of DamageComponent.store) {
      console.log(`  [${entity}] amount: ${formatNumber(damage.amount)}`);
    }
  }
  console.log('');

  // ---------- Position ----------
  console.log('Position:');
  if (PositionComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, position] of PositionComponent.store) {
      console.log(`  [${entity}] (${formatNumber(position.x)}, ${formatNumber(position.y)})`);
    }
  }
  console.log('');

  // ---------- Velocity ----------
  console.log('Velocity:');
  if (VelocityComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, velocity] of VelocityComponent.store) {
      console.log(`  [${entity}] (${formatNumber(velocity.dx)}, ${formatNumber(velocity.dy)})`);
    }
  }
  console.log('');

  // ---------- Cost ----------
  console.log('Cost:');
  if (CostComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, cost] of CostComponent.store) {
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
  if (LimitComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, limit] of LimitComponent.store) {
      console.log(`  [${entity}] max: ${limit.max}`);
    }
  }
  console.log('');

  // ---------- Upgrade ----------
  console.log('Upgrade:');
  if (UpgradeComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, upgrade] of UpgradeComponent.store) {
      console.log(`  [${entity}] id: ${upgrade.id}`);
    }
  }
  console.log('');

  // ---------- Modifier ----------
  console.log('Modifier:');
  if (ModifierComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, modifier] of ModifierComponent.store) {
      const owner = OwnedByComponent.store.get(entity);
      const resourceStr = modifier.resource ? ` (${modifier.resource})` : ' (all)';
      const statusStr = owner ? ` [ACTIVE - user: ${owner.user}]` : ' [blueprint]';
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
    for (const entity of component.store.keys()) {
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

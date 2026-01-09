import {
  DamageComponent,
  HealthComponent,
  OwnedByComponent,
  PositionComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  UserComponent,
  VelocityComponent,
  RESOURCES_PRECISION,
} from '../components';
import { TimeSingleton } from '../singletons';
import { World } from '../types';
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
      console.log(
        `  [${entity}] ${resource.type.toUpperCase()}: ${formatNumber(amount)}${capStr}`,
      );
    }
  }
  console.log('');

  // ---------- Generators ----------
  console.log('Generators:');
  if (ResourceGeneratorComponent.store.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, generator] of ResourceGeneratorComponent.store) {
      console.log(
        `  [${entity}] -> ${generator.resource} @ ${formatNumber(generator.ratePerSecond)}/sec`,
      );
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
      console.log(
        `  [${entity}] (${formatNumber(velocity.dx)}, ${formatNumber(velocity.dy)})`,
      );
    }
  }
  console.log('');

  // ---------- Summary ----------
  const totalEntities = new Set<number>();
  for (const [, component] of world.components) {
    for (const entity of component.store.keys()) {
      totalEntities.add(entity);
    }
  }
  console.log(`Total Entities: ${totalEntities.size}`);
  console.log('=============================================');
}

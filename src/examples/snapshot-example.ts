import { createSnapshot } from '../snapshots/create-snapshot';
import { restoreSnapshot } from '../snapshots/restore-snapshot';
import {
  registerComponents,
  registerSingletons,
  createUser,
  createUserResources,
  createExtractionStations,
} from '../bootstrap';
import { createWorld } from '../lib/world-utils';
import { simulate } from '../game-loop';
import { OwnedByComponent, ResourceComponent } from '../components';
import { getComponent } from '../lib/component-utils';
import { Entity, World } from '../types';

/**
 * Пример использования Snapshot API для сериализации и десериализации мира
 */
export function runSnapshotExample() {
  console.log('=== Snapshot API Example ===\n');

  // Создаем начальный мир
  const world = createWorld();
  registerComponents(world);
  registerSingletons(world);

  const user = createUser(world);
  createUserResources(world, user);
  createExtractionStations(world, user);

  // Временно мутируем ресурсы вручную
  for (const [, res] of getComponent(world, ResourceComponent) ?? []) {
    if (res.type === 'ore') res.amount = 100;
  }

  console.log('Initial world created');
  console.log('Entities:', countEntities(world));

  // Симулируем немного времени
  simulate(world, 10_000);
  console.log('\nAfter 10 seconds of simulation:');
  logResources(world, user);

  // Создаем snapshot
  console.log('\nCreating snapshot...');
  const snapshot = createSnapshot(world);
  console.log('Snapshot created');
  console.log('Components in snapshot:', snapshot.components.length);
  console.log('Singletons in snapshot:', Object.keys(snapshot.singletons).length);

  // Восстанавливаем мир из snapshot
  console.log('\nRestoring world from snapshot...');
  const restoredWorld = restoreSnapshot(snapshot);
  console.log('World restored');
  console.log('Entities in restored world:', countEntities(restoredWorld));

  // Проверяем, что ресурсы совпадают
  console.log('\nResources in restored world:');
  logResources(restoredWorld, user);

  // Симулируем в восстановленном мире
  simulate(restoredWorld, 10_000);
  console.log('\nAfter another 10 seconds in restored world:');
  logResources(restoredWorld, user);
}

/**
 * Подсчитывает количество entity в мире
 */
function countEntities(world: World): number {
  const entitySet = new Set<Entity>();

  for (const component of world.components.values()) {
    for (const entity of component.store.keys()) {
      entitySet.add(entity);
    }
  }

  return entitySet.size;
}

/**
 * Логирует ресурсы пользователя
 */
function logResources(world: World, user: Entity) {
  const resourceComponent = world.components.get(ResourceComponent.name);
  const ownedByComponent = world.components.get(OwnedByComponent.name);

  if (!resourceComponent || !ownedByComponent) return;

  const resources: Record<string, number> = {};

  for (const [entity, resource] of resourceComponent.store.entries()) {
    const ownedBy = ownedByComponent.store.get(entity);
    if (ownedBy && ownedBy.owner === user) {
      resources[resource.type] = resource.amount;
    }
  }

  console.log('User resources:', resources);
}

// Запуск примера если файл запущен напрямую
if (require.main === module) {
  runSnapshotExample();
}

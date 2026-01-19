/**
 * Тесты для Итерации 1: Core ECS логика
 *
 * Тестирует:
 * - Snapshot API (сериализация/десериализация мира)
 * - Event types (типизация событий)
 * - Deterministic random (детерминизм)
 * - Event replay framework (replay событий)
 */

import { createSnapshot, restoreSnapshot } from '~/snapshots';
import { replayEvents, createReplayLogger } from '~/lib/event-replay';
import { createSeededRandom } from '~/lib/deterministic-random';
import {
  registerComponents,
  registerSingletons,
  createUser,
  createUserResources,
  createExtractionStations,
} from '~/bootstrap';
import { createWorld, resetEntityId } from '~/lib/world-utils';
import { simulate } from '~/game-loop';
import { ResourceComponent } from '~/components';
import { getComponent } from '~/lib/component-utils';
import type { GameEvent } from '~/events/types';

/**
 * Тест Snapshot API
 */
export function testSnapshotAPI() {
  console.log('\n=== Test: Snapshot API ===\n');

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

  // Симулируем немного времени
  simulate(world, 10_000);

  // Создаем snapshot
  console.log('Creating snapshot...');
  const snapshot = createSnapshot(world);
  console.log('✓ Snapshot created');
  console.log('  Components:', snapshot.components.length);
  console.log('  Singletons:', Object.keys(snapshot.singletons).length);

  // Восстанавливаем мир из snapshot
  console.log('\nRestoring world from snapshot...');
  const restoredWorld = restoreSnapshot(snapshot);
  console.log('✓ World restored');

  // Создаем snapshot из восстановленного мира
  const restoredSnapshot = createSnapshot(restoredWorld);
  console.log('✓ Restored snapshot created');

  // Сравниваем snapshots
  const originalJson = JSON.stringify(snapshot);
  const restoredJson = JSON.stringify(restoredSnapshot);

  if (originalJson === restoredJson) {
    console.log('✓ PASS: Snapshots are identical');
    return true;
  } else {
    console.log('✗ FAIL: Snapshots differ');
    console.log('  Original length:', originalJson.length);
    console.log('  Restored length:', restoredJson.length);
    return false;
  }
}

/**
 * Тест Event Types
 */
export function testEventTypes() {
  console.log('\n=== Test: Event Types ===\n');

  const events: GameEvent[] = [
    {
      type: 'BUILD_STATION',
      userId: 'player-1',
      stationType: 'ore',
      timestamp: 1000,
    },
    {
      type: 'SELL_RESOURCE',
      userId: 'player-1',
      resourceType: 'ore',
      amount: 10,
      price: 5,
      timestamp: 10_000,
    },
    {
      type: 'START_EXPEDITION',
      userId: 'player-1',
      target: 'crystal',
      timestamp: 20_000,
    },
    {
      type: 'PURCHASE_UPGRADE',
      userId: 'player-1',
      upgradeId: 'ore_station_level_2',
      timestamp: 30_000,
    },
  ];

  console.log('Creating events of all types...');
  console.log('✓ Events created:', events.length);

  // Проверяем, что каждое событие имеет правильный type
  const types = new Set(events.map((e) => e.type));
  const expectedTypes = new Set<GameEvent['type']>([
    'BUILD_STATION',
    'SELL_RESOURCE',
    'START_EXPEDITION',
    'PURCHASE_UPGRADE',
  ]);

  const hasAllTypes =
    expectedTypes.size === types.size && [...expectedTypes].every((t) => types.has(t));

  if (hasAllTypes) {
    console.log('✓ PASS: All event types are present');
    console.log('  Types:', Array.from(types));
    return true;
  } else {
    console.log('✗ FAIL: Missing event types');
    console.log('  Expected:', Array.from(expectedTypes));
    console.log('  Found:', Array.from(types));
    return false;
  }
}

/**
 * Тест Deterministic Random
 */
export function testDeterministicRandom() {
  console.log('\n=== Test: Deterministic Random ===\n');

  const seed = 12345;

  console.log('Creating two generators with same seed:', seed);
  const rng1 = createSeededRandom(seed);
  const rng2 = createSeededRandom(seed);

  const iterations = 100;
  let allEqual = true;

  console.log(`Generating ${iterations} numbers...`);

  for (let i = 0; i < iterations; i++) {
    const val1 = rng1.next();
    const val2 = rng2.next();

    if (val1 !== val2) {
      allEqual = false;
      console.log(`✗ FAIL: Values differ at iteration ${i}: ${val1} vs ${val2}`);
      break;
    }
  }

  if (allEqual) {
    console.log('✓ PASS: All generated numbers are equal');
    console.log('  First few values:', [
      rng1.next(),
      rng1.next(),
      rng1.next(),
      rng1.next(),
      rng1.next(),
    ]);
    return true;
  } else {
    return false;
  }
}

/**
 * Тест Event Replay
 */
export function testEventReplay() {
  console.log('\n=== Test: Event Replay ===\n');

  const events: GameEvent[] = [
    {
      type: 'BUILD_STATION',
      userId: 'player-1',
      stationType: 'ore',
      timestamp: 1000,
    },
    {
      type: 'SELL_RESOURCE',
      userId: 'player-1',
      resourceType: 'ore',
      amount: 10,
      price: 5,
      timestamp: 10_000,
    },
    {
      type: 'START_EXPEDITION',
      userId: 'player-1',
      target: 'crystal',
      timestamp: 20_000,
    },
  ];

  console.log('Replaying events...');
  const result1 = replayEvents(events);
  console.log('✓ First replay completed');
  console.log('  Events processed:', result1.eventsProcessed);
  console.log('  Simulation time:', result1.simulationTimeMs, 'ms');

  const snapshot1 = createSnapshot(result1.world);
  console.log('✓ Snapshot 1 created');

  // Второй replay тех же событий (проверка детерминизма)
  console.log('\nReplaying same events again...');
  resetEntityId();
  const result2 = replayEvents(events);
  console.log('✓ Second replay completed');
  console.log('  Events processed:', result2.eventsProcessed);
  console.log('  Simulation time:', result2.simulationTimeMs, 'ms');

  const snapshot2 = createSnapshot(result2.world);
  console.log('✓ Snapshot 2 created');

  // Сравниваем snapshots
  const json1 = JSON.stringify(snapshot1);
  const json2 = JSON.stringify(snapshot2);

  if (json1 === json2) {
    console.log('\n✓ PASS: Snapshots are identical! Replay is deterministic.');
    return true;
  } else {
    console.log('\n✗ FAIL: Snapshots differ! Replay is not deterministic.');
    console.log('  Lengths:', json1.length, 'vs', json2.length);
    return false;
  }
}

/**
 * Тест Replay Logger
 */
export function testReplayLogger() {
  console.log('\n=== Test: Replay Logger ===\n');

  const world = createWorld();
  registerComponents(world);
  registerSingletons(world);

  const logger = createReplayLogger(world);
  console.log('✓ Replay logger created');

  logger.log('Test log message');
  const logs = logger.getLogs();

  if (logs.length === 1 && logs[0] === 'Test log message') {
    console.log('✓ PASS: Logger works correctly');
    console.log('  Logs:', logs);
    return true;
  } else {
    console.log('✗ FAIL: Logger does not work correctly');
    console.log('  Expected: ["Test log message"]');
    console.log('  Got:', logs);
    return false;
  }
}

/**
 * Запуск всех тестов
 */
export function runAllTests() {
  console.log('\n========================================');
  console.log('  ITERATION 1: CORE ECS LOGIC TESTS');
  console.log('========================================');

  const results = {
    snapshotAPI: testSnapshotAPI(),
    eventTypes: testEventTypes(),
    deterministicRandom: testDeterministicRandom(),
    eventReplay: testEventReplay(),
    replayLogger: testReplayLogger(),
  };

  console.log('\n========================================');
  console.log('  TEST RESULTS');
  console.log('========================================\n');

  const passed = Object.values(results).filter((r) => r === true).length;
  const total = Object.keys(results).length;

  for (const [name, result] of Object.entries(results)) {
    const status = result ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${name}`);
  }

  console.log(`\nTotal: ${passed}/${total} tests passed`);

  return passed === total;
}

// Запуск тестов если файл запущен напрямую
if (require.main === module) {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

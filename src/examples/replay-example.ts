import { replayEvents, createReplayLogger } from '~/lib/event-replay';
import { createSnapshot } from '~/snapshots/create-snapshot';
import type { GameEvent } from '~/events/types';
import { resetEntityId } from '~/lib/world-utils';

/**
 * Пример использования Event Replay Framework
 */
export function runReplayExample() {
  console.log('=== Event Replay Example ===\n');

  // Создаем последовательность событий
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

  console.log('Replaying', events.length, 'events...\n');

  // Replay событий
  const result1 = replayEvents(events);

  console.log('First replay completed');
  console.log('Events processed:', result1.eventsProcessed);
  console.log('Simulation time:', result1.simulationTimeMs, 'ms');
  console.log('Users created:', result1.userIdToEntityMap.size);

  // Создаем snapshot после первого replay
  const snapshot1 = createSnapshot(result1.world);
  console.log('\nSnapshot 1 created');

  // Второй replay тех же событий (проверка детерминизма)
  console.log('\nReplaying same events again...');
  resetEntityId();
  const result2 = replayEvents(events);

  console.log('Second replay completed');
  console.log('Events processed:', result2.eventsProcessed);
  console.log('Simulation time:', result2.simulationTimeMs, 'ms');
  console.log('Users created:', result2.userIdToEntityMap.size);

  // Создаем snapshot после второго replay
  const snapshot2 = createSnapshot(result2.world);
  console.log('\nSnapshot 2 created');

  // Сравниваем snapshots
  console.log('\nComparing snapshots...');
  const logger = createReplayLogger(result1.world);
  const isEqual = logger.compareSnapshots(snapshot1, snapshot2);

  if (isEqual) {
    console.log('SUCCESS: Snapshots are identical! Replay is deterministic.');
  } else {
    console.log('FAIL: Snapshots differ! Replay is not deterministic.');
  }

  // Replay с опциями
  console.log('\n\n=== Replay with Options ===\n');

  // Replay с пропуском симуляции
  console.log('Replaying with skipSimulation option...');
  const resultSkipSim = replayEvents(events, { skipSimulation: true });
  console.log('Events processed:', resultSkipSim.eventsProcessed);
  console.log('Simulation time:', resultSkipSim.simulationTimeMs, 'ms');

  // Replay с ограничением времени
  console.log('\nReplaying with maxTime option (5000ms)...');
  const resultMaxTime = replayEvents(events, { maxTime: 5000 });
  console.log('Events processed:', resultMaxTime.eventsProcessed);
  console.log('Simulation time:', resultMaxTime.simulationTimeMs, 'ms');
  console.log('(Note: Events after 5000ms were not simulated)');

  // Replay нескольких игроков
  console.log('\n\n=== Multi-player Replay ===\n');

  const multiPlayerEvents: GameEvent[] = [
    {
      type: 'BUILD_STATION',
      userId: 'player-1',
      stationType: 'ore',
      timestamp: 1000,
    },
    {
      type: 'BUILD_STATION',
      userId: 'player-2',
      stationType: 'ore',
      timestamp: 2000,
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
      userId: 'player-2',
      target: 'crystal',
      timestamp: 15_000,
    },
  ];

  console.log(
    'Replaying events for',
    multiPlayerEvents.length,
    'actions across multiple players...\n',
  );
  const multiPlayerResult = replayEvents(multiPlayerEvents);

  console.log('Multi-player replay completed');
  console.log('Events processed:', multiPlayerResult.eventsProcessed);
  console.log('Users created:', multiPlayerResult.userIdToEntityMap.size);
  console.log('User IDs:', Array.from(multiPlayerResult.userIdToEntityMap.keys()));
}

// Запуск примера если файл запущен напрямую
if (require.main === module) {
  runReplayExample();
}

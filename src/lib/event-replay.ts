import { UserComponent } from '~/components';
import { GameEvent, emitBuildStation, emitStartExpedition } from '~/events';
import { purchaseUpgradeSystem, sellResourceSystem } from '~/systems';
import { simulate } from '~/game-loop';
import { registerComponents, registerSingletons } from '~/bootstrap';
import { createWorld, resetEntityId, createEntity } from '~/lib/world-utils';
import { clearAllComponents } from '~/lib/component-utils';
import { query } from '~/lib/query';
import { Entity, World, WorldSnapshot } from '~/types';

/**
 * Опции для replay событий
 */
export type ReplayOptions = {
  seed?: number; // Seed для deterministic random (для будущей рогалик-системы)
  maxTime?: number; // Максимальное время симуляции в миллисекундах
  skipSimulation?: boolean; // Пропустить симуляцию времени между событиями
};

/**
 * Результат replay событий
 */
export type ReplayResult = {
  world: World;
  eventsProcessed: number;
  simulationTimeMs: number;
  userIdToEntityMap: Map<string, Entity>;
};

/**
 * Восстанавливает мир из списка событий
 *
 * @param events - Список игровых событий
 * @param options - Опции replay
 * @returns ReplayResult с восстановленным миром и метаинформацией
 */
export function replayEvents(events: GameEvent[], options?: ReplayOptions): ReplayResult {
  // Сбрасываем счетчик entity ID для детерминизма
  resetEntityId();

  const world = createWorld();
  registerComponents(world);
  registerSingletons(world);

  // Очищаем все компоненты для детерминизма
  clearAllComponents(world);

  const userIdToEntityMap = new Map<string, Entity>();
  let previousTimestamp = 0;
  let simulationTimeMs = 0;

  // Сортируем события по timestamp
  const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

  for (const event of sortedEvents) {
    // Получаем или создаем entity пользователя
    let userEntity = userIdToEntityMap.get(event.userId);
    if (!userEntity) {
      userEntity = ensureUserEntity(world, event.userId);
      userIdToEntityMap.set(event.userId, userEntity);
    }

    // Симулируем время между событиями
    if (!options?.skipSimulation && previousTimestamp > 0) {
      const deltaMs = event.timestamp - previousTimestamp;
      if (deltaMs > 0 && (!options?.maxTime || simulationTimeMs + deltaMs <= options.maxTime)) {
        simulate(world, deltaMs);
        simulationTimeMs += deltaMs;
      }
    }

    // Применяем событие
    applyEvent(world, userEntity, event);
    previousTimestamp = event.timestamp;
  }

  return {
    world,
    eventsProcessed: events.length,
    simulationTimeMs,
    userIdToEntityMap,
  };
}

/**
 * Применяет событие к миру
 */
function applyEvent(world: World, userEntity: Entity, event: GameEvent) {
  switch (event.type) {
    case 'BUILD_STATION':
      emitBuildStation(world, userEntity, event.stationType);
      break;

    case 'SELL_RESOURCE':
      sellResourceSystem(world, userEntity, event.resourceType, event.amount);
      break;

    case 'START_EXPEDITION':
      emitStartExpedition(world, userEntity, event.target);
      break;

    case 'PURCHASE_UPGRADE':
      purchaseUpgradeSystem(world, userEntity, event.upgradeId);
      break;
  }
}

/**
 * Гарантирует существование entity пользователя в мире
 */
function ensureUserEntity(world: World, userId: string): Entity {
  // Проверяем, существует ли пользователь с таким ID
  for (const [entity, user] of query(world, UserComponent)) {
    if (user.id === userId) {
      return entity;
    }
  }

  // Создаем нового пользователя
  const userEntity = createEntity();

  // Добавляем UserComponent
  const userComponent = world.components.get('User');
  if (userComponent) {
    userComponent.store.set(userEntity, {
      id: userId,
      name: `User-${userId}`,
    });
  }

  return userEntity;
}

/**
 * Создает логгер для сравнения состояний при replay
 * Полезен для тестирования детерминизма
 */
export function createReplayLogger(world: World) {
  const logs: string[] = [];

  function log(message: string) {
    logs.push(message);
  }

  function getLogs() {
    return logs;
  }

  function compareSnapshots(snapshot1: WorldSnapshot, snapshot2: WorldSnapshot) {
    const equal = JSON.stringify(snapshot1) === JSON.stringify(snapshot2);
    log(`Snapshots ${equal ? 'are equal' : 'differ'}`);
    return equal;
  }

  function dumpState() {
    for (const [name, component] of world.components.entries()) {
      log(`Component ${name}: ${component.store.size} entities`);
    }
  }

  return {
    log,
    getLogs,
    compareSnapshots,
    dumpState,
  };
}

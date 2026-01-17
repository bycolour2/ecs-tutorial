import {
  CostComponent,
  ExtractionStationComponent,
  LimitComponent,
  MerchantComponent,
  ModifierComponent,
  OwnedByComponent,
  ProvidedByMerchantComponent,
  ResourceComponent,
  ResourceGeneratorComponent,
  SellPriceComponent,
  ShopItemComponent,
  // UpgradeComponent,
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

  // // ---------- Upgrade ----------
  // console.log('Upgrade:');
  // const upgrades = getComponent(world, UpgradeComponent);
  // if (upgrades.size === 0) {
  //   console.log('  (none)');
  // } else {
  //   for (const [entity, upgrade] of upgrades) {
  //     console.log(`  [${entity}] id: ${upgrade.id}`);
  //   }
  // }
  // console.log('');

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

  // ---------- Merchant ----------
  console.log('Merchant:');
  const merchants = getComponent(world, MerchantComponent);
  if (merchants.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, merchant] of merchants) {
      console.log(`  [${entity}] id: ${merchant.id}`);
    }
  }
  console.log('');

  // ---------- Shop Item ----------
  console.log('Shop Item:');
  const shopItems = getComponent(world, ShopItemComponent);
  if (shopItems.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, shopItem] of shopItems) {
      const providedBy = getComponentValue(world, ProvidedByMerchantComponent, entity);
      const merchantStr = providedBy ? `, merchant: [${providedBy.merchant}]` : ' (no merchant)';
      console.log(
        `  [${entity}] itemId: ${shopItem.itemId}, costMoney: ${formatNumber(
          shopItem.costMoney,
        )}${merchantStr}`,
      );
    }
  }
  console.log('');

  // ---------- Sell Price ----------
  console.log('Sell Price:');
  const sellPrices = getComponent(world, SellPriceComponent);
  if (sellPrices.size === 0) {
    console.log('  (none)');
  } else {
    for (const [entity, sellPrice] of sellPrices) {
      const providedBy = getComponentValue(world, ProvidedByMerchantComponent, entity);
      const merchantStr = providedBy ? `, merchant: [${providedBy.merchant}]` : ' (no merchant)';
      console.log(
        `  [${entity}] ${sellPrice.resource.toUpperCase()}: ${formatNumber(
          sellPrice.pricePerUnit,
        )} per unit${merchantStr}`,
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

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

type ChangeType = 'ADDED' | 'REMOVED' | 'CHANGED';

interface ComponentChange {
  entity: number;
  componentName: string;
  type: ChangeType;
  prevValue?: unknown;
  newValue?: unknown;
}

export function logWorldChanges(prevWorld: World, nextWorld: World): void {
  console.log('=============== WORLD CHANGES ===============');

  let totalChanges = 0;
  let changedEntities = new Set<number>();

  // ---------- Singletons ----------
  console.log('Singletons:');
  let singletonChanges = 0;

  // TimeSingleton
  const prevTime = getSingleton(prevWorld, TimeSingleton);
  const nextTime = getSingleton(nextWorld, TimeSingleton);

  if (prevTime.nowMs !== nextTime.nowMs) {
    console.log(
      `  TimeSingleton.nowMs: ${formatTime(prevTime.nowMs)} (${prevTime.nowMs}) -> ${formatTime(
        nextTime.nowMs,
      )} (${nextTime.nowMs})`,
    );
    singletonChanges++;
  }
  if (prevTime.tick !== nextTime.tick) {
    console.log(`  TimeSingleton.tick: ${prevTime.tick} -> ${nextTime.tick}`);
    singletonChanges++;
  }
  if (prevTime.accumulatorMs !== nextTime.accumulatorMs) {
    console.log(
      `  TimeSingleton.accumulatorMs: ${prevTime.accumulatorMs} -> ${nextTime.accumulatorMs}`,
    );
    singletonChanges++;
  }

  if (singletonChanges === 0) {
    console.log('  (no changes)');
  }
  console.log('');

  totalChanges += singletonChanges;

  // ---------- Components ----------
  const allComponentNames = new Set<string>();
  for (const [name] of prevWorld.components) allComponentNames.add(name);
  for (const [name] of nextWorld.components) allComponentNames.add(name);

  const changesByComponent = new Map<string, ComponentChange[]>();

  for (const componentName of allComponentNames) {
    const prevComponent = prevWorld.components.get(componentName);
    const nextComponent = nextWorld.components.get(componentName);

    const changes: ComponentChange[] = [];

    // Entities that had this component in prevWorld
    if (prevComponent) {
      for (const [entity, prevValue] of prevComponent.store) {
        const nextValue = nextComponent?.store.get(entity);

        if (nextValue === undefined) {
          // Component was removed
          changes.push({ entity, componentName, type: 'REMOVED', prevValue });
          changedEntities.add(entity);
        } else if (!deepEqual(prevValue, nextValue)) {
          // Component value changed
          changes.push({ entity, componentName, type: 'CHANGED', prevValue, newValue: nextValue });
          changedEntities.add(entity);
        }
      }
    }

    // Entities that have this component only in nextWorld (added)
    if (nextComponent) {
      for (const [entity, nextValue] of nextComponent.store) {
        const prevValue = prevComponent?.store.get(entity);
        if (prevValue === undefined) {
          changes.push({ entity, componentName, type: 'ADDED', newValue: nextValue });
          changedEntities.add(entity);
        }
      }
    }

    if (changes.length > 0) {
      changesByComponent.set(componentName, changes);
    }
  }

  // Print component changes
  if (changesByComponent.size === 0) {
    console.log('Components: (no changes)');
  } else {
    console.log('Components:');
    for (const [componentName, changes] of changesByComponent) {
      console.log(`  ${componentName}:`);
      for (const change of changes) {
        const { entity, type, prevValue, newValue } = change;

        switch (type) {
          case 'ADDED': {
            console.log(`    [${entity}] -> ${formatValue(componentName, newValue)} (ADDED)`);
            break;
          }
          case 'REMOVED': {
            console.log(`    [${entity}] <- ${formatValue(componentName, prevValue)} (REMOVED)`);
            break;
          }
          case 'CHANGED': {
            console.log(
              `    [${entity}] ${formatValue(componentName, prevValue)} -> ${formatValue(
                componentName,
                newValue,
              )} (CHANGED)`,
            );
            break;
          }
        }
        totalChanges++;
      }
    }
  }
  console.log('');

  // ---------- Summary ----------
  console.log(`Total changes: ${changedEntities.size} entities, ${totalChanges} components`);
  console.log('=============================================');
}

function formatValue(componentName: string, value: unknown): string {
  if (value === undefined) return '(undefined)';
  if (value === null) return '(null)';

  // Special formatting for known component types
  if (componentName === 'Resource') {
    const resource = value as { type: string; amount: number; cap?: number };
    const amount = formatNumber(resource.amount);
    const capStr = resource.cap !== undefined ? ` / ${formatNumber(resource.cap)}` : '';
    return `${resource.type.toUpperCase()}: ${amount}${capStr}`;
  }

  if (componentName === 'ExtractionStation') {
    const station = value as { resource: string; level: number; built: boolean };
    return `${station.resource.toUpperCase()} level ${station.level}${
      station.built ? ' [built]' : ' [blueprint]'
    }`;
  }

  if (componentName === 'ResourceGenerator') {
    const gen = value as { resource: string; baseRate: number };
    return `${gen.resource} @ ${formatNumber(gen.baseRate)}/sec`;
  }

  if (componentName === 'UpgradeState') {
    const state = value as { state: string };
    return `${state.state}`;
  }

  // Default: try to format as JSON
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function cloneWorld(world: World): World {
  return structuredClone(world);
}

export interface ChangesLogger {
  (world: World): void;
}

export function createChangesLogger(initialWorld?: World): ChangesLogger {
  let prevWorld: World | undefined = initialWorld ? cloneWorld(initialWorld) : undefined;

  return function logChanges(world: World): void {
    if (prevWorld === undefined) {
      prevWorld = cloneWorld(world);
      console.log('--- First state captured for changes logger ---');
      return;
    }

    logWorldChanges(prevWorld, world);
    prevWorld = cloneWorld(world);
  };
}

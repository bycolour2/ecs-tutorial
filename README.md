# ECS Tutorial

A TypeScript tutorial project demonstrating the Entity Component System (ECS) architecture pattern. This project provides a clean, type-safe implementation of ECS concepts with examples of components, systems, and game loop mechanics.

## What is ECS?

Entity Component System (ECS) is a software architecture pattern commonly used in game development and simulation systems. It separates data (components) from behavior (systems), providing:

- **Flexibility**: Entities can have different combinations of components
- **Performance**: Systems process entities in batches
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new components and systems

### Core Concepts

- **Entity**: A unique identifier (number) representing a game object
- **Component**: Data containers attached to entities (e.g., Position, Health, Resource)
- **System**: Logic that processes entities with specific component combinations
- **World**: Container for all components and singletons in the game state
- **Singleton**: Global state shared across the entire world (e.g., Time)

## Project Structure

```
src/
├── components/          # Component definitions
│   ├── damage-component.ts
│   ├── health-component.ts
│   ├── position-component.ts
│   ├── production-component.ts
│   ├── resource-component.ts
│   └── velocity-component.ts
├── systems/             # System implementations
│   ├── damage-system.ts
│   ├── death-system.ts
│   ├── movement-system.ts
│   ├── production-system.ts
│   └── time-system.ts
├── singletons/          # Singleton definitions
│   └── time-singleton.ts
├── lib/                 # Utility functions
│   ├── component-utils.ts
│   └── singleton-utils.ts
├── game-loop.ts         # Game loop with fixed timestep
├── types.ts             # Core type definitions
└── index.ts             # Example usage
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.25.0) - specified in package.json

### Installation

```bash
pnpm install
```

### Building

```bash
pnpm build
```

### Running

```bash
# Run the compiled JavaScript
pnpm start

# Or run in development mode with auto-reload
pnpm dev
```

## Usage Example

The project includes a working example that demonstrates resource production over time:

```typescript
import { createWorld, createEntity } from './index';
import { ProductionComponent, ResourceComponent } from './components';
import { TimeSingleton } from './singletons';
import { addComponent, registerComponent } from './lib/component-utils';
import { registerSingleton, getSingleton } from './lib/singleton-utils';
import { advanceTime } from './game-loop';

// Create a world
const world = createWorld();

// Register components and singletons
registerComponent(world, ResourceComponent);
registerComponent(world, ProductionComponent);
registerSingleton(world, TimeSingleton);

// Create entities
const resourceEntity = createEntity();
const producerEntity = createEntity();

// Add components to entities
addComponent(world, ResourceComponent, resourceEntity, {
  amount: 0,
});

addComponent(world, ProductionComponent, producerEntity, {
  ratePerSecond: 2,
  target: resourceEntity,
});

// Advance time and see resources accumulate
advanceTime(world, 1000); // Advance 1 second
console.log(ResourceComponent.store.get(resourceEntity)); // { amount: 2 }
```

## Architecture

### Components

Components are pure data containers. They define what data an entity has:

```typescript
export type Resource = {
  amount: number;
};

export const ResourceComponent = createComponent<Resource>('Resource');
```

### Systems

Systems contain the logic that processes entities. They run every game tick:

```typescript
export function productionSystem(world: World, deltaMs: number) {
  // Process all entities with ProductionComponent
  // Update target ResourceComponent based on ratePerSecond
}
```

### Game Loop

The game loop uses a fixed timestep approach with an accumulator pattern:

- **TICK_MS**: Fixed timestep (100ms)
- **advanceTime()**: Advances the game world by a real-time delta
- **tick()**: Executes all systems in order

This ensures consistent game behavior regardless of frame rate.

## Available Components

- **ResourceComponent**: Stores resource amounts
- **ProductionComponent**: Defines production rate and target entity
- **HealthComponent**: Entity health points
- **DamageComponent**: Damage to be applied
- **PositionComponent**: 2D position
- **VelocityComponent**: Movement velocity

## Available Systems

- **timeSystem**: Updates the global time singleton
- **productionSystem**: Processes production and updates resources
- **damageSystem**: Applies damage to entities
- **deathSystem**: Removes entities with zero or negative health
- **movementSystem**: Updates positions based on velocity

## Key Features

- ✅ Type-safe component and system definitions
- ✅ Fixed timestep game loop with accumulator
- ✅ Singleton support for global state
- ✅ Clean separation of data and logic
- ✅ Easy to extend with new components and systems

## License

ISC

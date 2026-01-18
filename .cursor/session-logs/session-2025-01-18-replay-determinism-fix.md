# Session Log: 2025-01-18 - Replay Determinism Fix

## Problem Identification
- User reported that replay is not deterministic
- Running the same events multiple times produces different snapshots

## Investigation Process

### Step 1: Initial Analysis
- Reviewed replay-example.ts to understand the replay mechanism
- Reviewed event-replay.ts to see how replay is implemented
- Reviewed deterministic-random.ts to check random number generation

### Step 2: Debug Scripts Creation
Created several debug scripts to identify the issue:
- debug-snapshot.ts - Simple snapshot comparison with 2 events
- debug-full.ts - Full event set comparison
- debug-map-order.ts - Component order verification
- debug-component-data.ts - Detailed component data comparison
- debug-component-reuse.ts - Component identity testing
- debug-registration.ts - Component registration testing
- debug-clear.ts - Component state clearing between worlds

### Step 3: Root Cause Discovery
Through debug scripts, discovered:
1. Components are created as global constants
2. Each component has a `Map<Entity, T>` store
3. When registering components, the same objects are reused across worlds
4. This means all worlds share the same component stores
5. Data from first replay persists in stores when second replay runs
6. Entity IDs might be different, causing mismatched data

**Key finding:** In `debug-registration.ts`:
```
world1.components.get('ExtractionStation') === world2.components.get('ExtractionStation')? YES
User store 1 keys: [ 1 ]
User store 2 keys: [ 1 ]  // Same store, should be empty!
```

### Step 4: Solution Implementation
Added `clearAllComponents(world)` function in `src/lib/component-utils.ts`:

```typescript
export function clearAllComponents(world: World) {
  for (const component of world.components.values()) {
    component.store.clear();
  }
}
```

Updated `replayEvents()` in `src/lib/event-replay.ts`:
- Import `clearAllComponents` from component-utils
- Call `clearAllComponents(world)` after registering components

### Step 5: Verification
- Ran debug scripts to verify fix works
- Ran `npm run example:replay` - SUCCESS: Snapshots are identical!
- Ran `npm run test:iteration-1` - All 5 tests pass

### Step 6: Cleanup
- Deleted all debug scripts (7 files)
- Removed debug scripts from package.json
- Fixed linter error in iteration-1.test.ts (type annotation)
- Created REPLAY-DETERMINISM-FIX.md documentation

### Step 7: Documentation Structure
Created two directories:
- `docs/` - For documentation
- `logs/` - For session logs

## Files Modified

### Core Implementation
- `src/lib/component-utils.ts` - Added `clearAllComponents()` function
- `src/lib/event-replay.ts` - Call `clearAllComponents()` in replay logic
- `src/lib/index.ts` - Cleaned up duplicate exports

### Tests
- `src/tests/iteration-1.test.ts` - Fixed type annotation for event types

### Documentation
- `REPLAY-DETERMINISM-FIX.md` - Detailed explanation of the fix

## Files Created (then deleted during cleanup)
- src/debug-snapshot.ts
- src/debug-full.ts
- src/debug-map-order.ts
- src/debug-component-data.ts
- src/debug-component-reuse.ts
- src/debug-registration.ts
- src/debug-clear.ts

## Test Results

### Before Fix
```
FAIL: Snapshots differ! Replay is not deterministic.
```

### After Fix
```
SUCCESS: Snapshots are identical! Replay is deterministic.
✓ PASS: eventReplay
Total: 5/5 tests passed
```

## Key Insights

1. **Shared state causes non-determinism**: Global mutable state across multiple instances breaks determinism
2. **Always clean up before reuse**: When reusing objects, ensure they're in a clean state
3. **Test with multiple runs**: Deterministic code should produce identical results across multiple runs
4. **Component stores are shared**: Components are designed to be reused, but stores must be cleared between worlds

## Future Improvements

Potential long-term solutions to avoid this issue entirely:
1. **World-local components**: Create new component instances for each world instead of sharing global constants
2. **Component factory**: Use a factory pattern that creates fresh components for each world
3. **Immutable snapshots**: Make snapshots immutable and use them for comparisons instead of direct state
4. **Isolated component registries**: Each world has its own component registry

For now, `clearAllComponents()` solution provides a clean and explicit way to ensure determinism.

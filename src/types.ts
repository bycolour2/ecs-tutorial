// Entity is a unique identifier for an entity
export type Entity = number;

export type Component<T> = {
  name: string;
  store: Map<Entity, T>;
};

export type Singleton<T> = {
  name: string;
  initial: T;
};

// World is a collection of components
export type World = {
  components: Map<string, Component<any>>;
  singletons: Map<string, unknown>;
};

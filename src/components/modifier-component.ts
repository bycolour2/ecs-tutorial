import { createComponent } from '~/lib/component-utils';

export type ModifierTarget = 'generator_rate' | 'station_level';

export type Modifier = {
  target: ModifierTarget;
  resource?: string; // ограничение по ресурсу (ore, energy и т.д.)
  value: number; // аддитивное значение
};

export const ModifierComponent = createComponent<Modifier>('Modifier');

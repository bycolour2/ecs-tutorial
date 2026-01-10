import { createComponent } from '~/lib/component-utils';

export type Modifier = {
  stat: 'production';
  resource?: string;
  value: number;
};

export const ModifierComponent = createComponent<Modifier>('Modifier');

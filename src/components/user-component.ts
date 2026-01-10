import { createComponent } from '~/lib/component-utils';

export type User = {
  id: string;
  name: string;
};

export const UserComponent = createComponent<User>('User');

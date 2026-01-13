import { createComponent } from '~/lib/component-utils';

export type Merchant = {
  id: 'default';
};

export const MerchantComponent = createComponent<Merchant>('Merchant');

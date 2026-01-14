import { Entity } from '~/types';
import { createComponent } from '~/lib/component-utils';

export type ProvidedByMerchant = {
  merchant: Entity; // entityId мерчанта
};

export const ProvidedByMerchantComponent =
  createComponent<ProvidedByMerchant>('ProvidedByMerchant');

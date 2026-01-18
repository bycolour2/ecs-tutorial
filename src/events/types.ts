import { BaseResourceType, ResourceType, SpecialResourceType } from '~/components';

export type GameEvent =
  | BuildStationEvent
  | SellResourceEvent
  | StartExpeditionEvent
  | PurchaseUpgradeEvent;

export type BuildStationEvent = {
  type: 'BUILD_STATION';
  userId: string;
  stationType: BaseResourceType;
  timestamp: number;
};

export type SellResourceEvent = {
  type: 'SELL_RESOURCE';
  userId: string;
  resourceType: ResourceType;
  amount: number;
  price: number;
  timestamp: number;
};

export type StartExpeditionEvent = {
  type: 'START_EXPEDITION';
  userId: string;
  target: SpecialResourceType;
  timestamp: number;
};

export type PurchaseUpgradeEvent = {
  type: 'PURCHASE_UPGRADE';
  userId: string;
  upgradeId: string;
  timestamp: number;
};

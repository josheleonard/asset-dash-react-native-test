export type DegenListData = DegenListItemData[];

export interface DegenListItemData {
  token_address: string;
  token_symbol?: string;
  token_icon?: string;
  token_created: number;
  price_usd: number;
  market_cap_usd: number;
  total_supply: number;
  price_change_percent: PriceChangePercent;
  whale_count: WhaleCount;
  whale_trades_count: WhaleTradesCount;
  whale_buys_count: WhaleBuysCount;
  whale_buy_volume_usd: WhaleBuyVolumeUsd;
  whale_sells_count: WhaleSellsCount;
  whale_sell_volume_usd: WhaleSellVolumeUsd;
  whale_net_flow_usd: WhaleNetFlowUsd;
  whale_buy_amount: WhaleBuyAmount;
  whale_sell_amount: WhaleSellAmount;
  whale_net_amount: WhaleNetAmount;
  whale_holder_retention_percent: WhaleHolderRetentionPercent;
  whale_buy_supply_percent: WhaleBuySupplyPercent;
  whale_sell_supply_percent: WhaleSellSupplyPercent;
  whale_net_supply_percent: WhaleNetSupplyPercent;
  volume_usd: VolumeUsd;
  liquidity_usd: number;
  transactions_count: TransactionsCount;
  is_new: boolean;
  is_pump: boolean;
  is_pro: boolean;
  is_bonk: boolean;
  is_believe: boolean;
  is_xstocks?: boolean;
  is_ray: boolean;
  antirug_score: any;
  launchpad: any;
  score_values: ScoreValues;
}

export interface TimelineValues {
  m5: number;
  m30: number;
  h1: number;
  h4: number;
  h8: number;
  h24: number;
}

export type PriceChangePercent = Partial<TimelineValues>;

export type WhaleCount = TimelineValues;

export type WhaleTradesCount = TimelineValues;

export type WhaleBuysCount = TimelineValues;

export type WhaleBuyVolumeUsd = TimelineValues;

export type WhaleSellsCount = TimelineValues;

export type WhaleSellVolumeUsd = TimelineValues;

export type WhaleNetFlowUsd = TimelineValues;

export type WhaleBuyAmount = TimelineValues;

export type WhaleSellAmount = TimelineValues;

export type WhaleNetAmount = TimelineValues;

export type WhaleHolderRetentionPercent = TimelineValues;

export type WhaleBuySupplyPercent = TimelineValues;

export type WhaleSellSupplyPercent = TimelineValues;

export type WhaleNetSupplyPercent = TimelineValues;

export type VolumeUsd = TimelineValues;

export type TransactionsCount = TimelineValues;

export type ScoreValues = TimelineValues;

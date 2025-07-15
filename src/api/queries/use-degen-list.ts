import { useQuery } from "@tanstack/react-query";
import { DegenListData } from "../types/degen-list.types";
import { getUpdatedPercentChange } from "../../utils/percentages";

const DEGEN_LIST_ENDPOINT =
  "https://dev-screener-api.assetdash.com/moby_screener/leaderboard/degen_list?compact=false";

export const degenListQueryKey = ["degen_list"];

/** Fetches the degen list leaderboard assets, and applies random price changes to some assets */
export const degenListQueryFn = async (): Promise<DegenListData> => {
  const degenListResponse = await fetch(DEGEN_LIST_ENDPOINT);
  const degenList: DegenListData = await degenListResponse.json();
  // Update prices for some tokens with random values
  return degenList.map((item) => {
    const shouldUpdate = Math.random() > 0.2;
    if (!shouldUpdate) {
      return item;
    }

    // set the price to a new random value and update the price change percentages
    const randomPercentage = Math.floor(Math.random() * 100) + 1; // 1% - 100%

    // randomly decide if the price should go up or down
    const randomPercentChange =
      Math.random() < 0.5 ? -randomPercentage : randomPercentage;

    const oldPrice = item.price_usd;
    const newPrice = item.price_usd * (randomPercentChange / 100);
    const priceChangeRatio = newPrice / oldPrice;

    return {
      ...item,
      liquidity_usd: item.liquidity_usd * priceChangeRatio,
      price_usd: newPrice,
      // NOTE: these updates do not account fo the time since the last data fetch
      price_change_percent: {
        h1: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.h1 || 0
        ),
        h24: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.h24 || 0
        ),
        h4: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.h4 || 0
        ),
        h8: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.h8 || 0
        ),
        m30: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.m30 || 0
        ),
        m5: getUpdatedPercentChange(
          oldPrice,
          newPrice,
          item.price_change_percent?.m5 || 0
        ),
      },
      market_cap_usd: item.total_supply * newPrice,
    };
  });
};

/** performs a query for the degen list leaderboard assets and polls for updates every 10 seconds  */
export const useDegenList = () => {
  return useQuery({
    queryKey: degenListQueryKey,
    queryFn: degenListQueryFn,
    refetchInterval: 10_000,
  });
};

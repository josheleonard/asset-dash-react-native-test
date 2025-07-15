import { useQuery } from "@tanstack/react-query";
import { DegenListData } from "../types/degen-list.types";

const DEGEN_LIST_ENDPOINT =
  "https://dev-screener-api.assetdash.com/moby_screener/leaderboard/degen_list?compact=false";

export const degenListQueryKey = ["degen_list"];

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
    const oldPrice = item.price_usd;
    const newPrice = Math.random() * 0.01;

    const newPriceChangePercent = ((newPrice - oldPrice) / oldPrice) * 100;

    return {
      ...item,
      price_usd: newPrice,
      price_change_percent: {
        h1: (item.price_change_percent?.h1 || 0) + newPriceChangePercent,
        h24: (item.price_change_percent?.h24 || 0) + newPriceChangePercent,
        h4: (item.price_change_percent?.h4 || 0) + newPriceChangePercent,
        h8: (item.price_change_percent?.h8 || 0) + newPriceChangePercent,
        m30: (item.price_change_percent?.m30 || 0) + newPriceChangePercent,
        m5: (item.price_change_percent?.m5 || 0) + newPriceChangePercent,
      },
    };
  });
};

export const useDegenList = () => {
  return useQuery({
    queryKey: degenListQueryKey,
    queryFn: degenListQueryFn,
    refetchInterval: 10_000,
  });
};

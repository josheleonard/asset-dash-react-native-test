import { useQuery } from "@tanstack/react-query";
import { DegenListData } from "../types/degen-list.types";

const DEGEN_LIST_ENDPOINT =
  "https://dev-screener-api.assetdash.com/moby_screener/leaderboard/degen_list?compact=false";

export const degenListQueryKey = ["degen_list"];

export const degenListQueryFn = async (): Promise<DegenListData> => {
  const degenListResponse = await fetch(DEGEN_LIST_ENDPOINT);
  return degenListResponse.json();
};

export const useDegenList = () => {
  return useQuery({
    queryKey: degenListQueryKey,
    queryFn: degenListQueryFn,
    refetchInterval: 10_000,
  });
};

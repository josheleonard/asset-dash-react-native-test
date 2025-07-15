import React from "react";
import { Linking, StyleSheet, Text, TouchableOpacity } from "react-native";
import { DegenListItemData } from "../api/types/degen-list.types";
import { Image, ImageProps } from "expo-image";

const priceFormatter = Intl.NumberFormat("en-us", {
  currency: "usd",
  maximumFractionDigits: 8,
  currencyDisplay: "symbol",
  trailingZeroDisplay: "auto",
  style: "currency",
});

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const tokenIconPlaceholder: ImageProps["placeholder"] = { blurhash };

export default function DegenListItem({
  item,
  isRefreshing,
}: {
  item: DegenListItemData;
  isRefreshing: boolean;
}) {
  const onTokenPress = React.useCallback(async () => {
    await Linking.openURL(`https://solscan.io/token/${item.token_address}`);
  }, [item.token_address]);

  return (
    <TouchableOpacity
      onPress={onTokenPress}
      style={[styles.container, isRefreshing ? styles.refreshing : undefined]}
    >
      <Image
        source={item.token_icon}
        contentFit="fill"
        placeholderContentFit="fill"
        placeholder={tokenIconPlaceholder}
        style={styles.tokenIcon}
        transition={500}
      />
      <Text>{item.token_symbol || "???"}</Text>
      <Text>{priceFormatter.format(item.price_usd)}</Text>
      {item.is_new ? <Text>New</Text> : null}
      {item.is_pro ? <Text>Pro</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  refreshing: {
    opacity: 0.6,
  },
  tokenIcon: {
    width: 34,
    height: 34,
    borderRadius: 25,
    backgroundColor: "grey",
  },
});

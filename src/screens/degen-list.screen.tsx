import React from "react";
import {
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useDegenList } from "../api/queries/use-degen-list";
import DegenListItem from "../components/degen-list-item";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

/* Allows only non-negative number-like inputs */
const numberRegex = /^(?:\d+\.?\d*|\.\d*)?$/;

const segments = ["All", "New", "Pro"];
export default function DegenListScreen() {
  const {
    data: degenList,
    isFetching: isFetchingDegenList,
    isPending,
    refetch: refetchDegenList,
  } = useDegenList();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [priceGreaterThanFilterInput, setPriceGreaterThanFilterInput] =
    React.useState("");
  const {
    getItem: getPriceGreaterThanFilterInput,
    setItem: setPriceGreaterThanFilterInputStorage,
  } = useAsyncStorage("@priceGreaterThanFilter");

  const [selectedSegmentIndex, setSelectedSegmentIndex] = React.useState(0);
  const {
    getItem: getSelectedSegmentIndex,
    setItem: setSelectedSegmentIndexStorage,
  } = useAsyncStorage("@selectedSegmentIndex");

  const isNewFilter = selectedSegmentIndex === 1 || undefined;
  const isProFilter = selectedSegmentIndex === 2 || undefined;
  const parsedPriceFilter = parseFloat(priceGreaterThanFilterInput) || 0;

  const filteredList = React.useMemo(() => {
    if (!degenList) {
      return [];
    }
    return degenList.filter((item) => {
      return (
        item.price_usd >= parsedPriceFilter &&
        (isProFilter === undefined || item.is_pro === isProFilter) &&
        (isNewFilter === undefined || item.is_new === isNewFilter)
      );
    });
  }, [degenList, isNewFilter, isProFilter, parsedPriceFilter]);

  const refresh = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetchDegenList();
    } catch (error) {
      console.log(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchDegenList]);

  // update state with storage values on mount
  React.useEffect(() => {
    (async () => {
      const priceGreaterThanFilterInputStorage =
        (await getPriceGreaterThanFilterInput()) || "";
      const selectedSegmentIndexStorage =
        Number(await getSelectedSegmentIndex()) || 0;
      setPriceGreaterThanFilterInput(priceGreaterThanFilterInputStorage);
      setSelectedSegmentIndex(selectedSegmentIndexStorage);
    })();
  }, [getPriceGreaterThanFilterInput, getSelectedSegmentIndex]);

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Price greater than:</Text>
          <TextInput
            value={priceGreaterThanFilterInput}
            style={styles.textInput}
            keyboardType="number-pad"
            onPointerLeave={Keyboard.dismiss}
            onChangeText={(value) => {
              if (numberRegex.test(value)) {
                setPriceGreaterThanFilterInput(value);
                setPriceGreaterThanFilterInputStorage(value);
              }
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
          <SegmentedControl
            values={segments}
            selectedIndex={selectedSegmentIndex}
            style={styles.segmentedControl}
            onChange={(event) => {
              setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
              setSelectedSegmentIndexStorage(
                event.nativeEvent.selectedSegmentIndex.toString()
              );
            }}
          />
          <FlatList
            keyboardDismissMode="on-drag"
            data={filteredList}
            renderItem={({ item }) => (
              <DegenListItem isRefreshing={isFetchingDegenList} item={item} />
            )}
            keyExtractor={(item) => item.token_address}
            contentContainerStyle={styles.flatListContentContainer}
            extraData={isFetchingDegenList}
            maxToRenderPerBatch={10}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
            }
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
  },
  loadingText: {
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  flatListContentContainer: { gap: 24 },
  segmentedControl: { marginBottom: 16 },
});

import React from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
  // queries
  const {
    data: degenList,
    isFetching: isFetchingDegenList,
    isPending,
    refetch: refetchDegenList,
    isError,
  } = useDegenList();

  // state
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"price" | "symbol">("price");
  const [sortOrder, setSortOrder] = React.useState<"ascending" | "descending">(
    "descending"
  );

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

  // computed and memoized values
  const isNewFilter = selectedSegmentIndex === 1 || undefined;
  const isProFilter = selectedSegmentIndex === 2 || undefined;
  const parsedPriceFilter = parseFloat(priceGreaterThanFilterInput) || 0;

  const filteredList = React.useMemo(() => {
    if (!degenList) {
      return [];
    }
    return degenList.filter((item) => {
      return (
        item.price_usd > parsedPriceFilter &&
        (isProFilter === undefined || item.is_pro === isProFilter) &&
        (isNewFilter === undefined || item.is_new === isNewFilter)
      );
    });
  }, [degenList, isNewFilter, isProFilter, parsedPriceFilter]);

  const sortedFilteredList = React.useMemo(() => {
    if (sortBy === "symbol") {
      return [...filteredList].sort(
        sortOrder === "ascending"
          ? (itemA, itemB) => {
              return (
                itemA.token_symbol?.localeCompare(itemB.token_symbol || "") || 0
              );
            }
          : (itemA, itemB) => {
              return (
                itemB.token_symbol?.localeCompare(itemA.token_symbol || "") || 0
              );
            }
      );
    }

    // price
    return [...filteredList].sort(
      sortOrder === "ascending"
        ? (itemA, itemB) => {
            return itemA.price_usd - itemB.price_usd;
          }
        : (itemA, itemB) => {
            return itemB.price_usd - itemA.price_usd;
          }
    );
  }, [filteredList, sortBy, sortOrder]);

  // methods
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

  // effects
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

  // render
  if (isPending) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Something went wrong, try again later
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => refetchDegenList()}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal transparent visible={isSortModalOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort assets by:</Text>
            <TouchableOpacity
              onPress={() => {
                setSortBy("price");
                setSortOrder("ascending");
                setIsSortModalOpen(false);
              }}
            >
              <Text>Price (Ascending)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortBy("price");
                setSortOrder("descending");
                setIsSortModalOpen(false);
              }}
            >
              <Text>Price (Descending)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortBy("symbol");
                setSortOrder("ascending");
                setIsSortModalOpen(false);
              }}
            >
              <Text>Symbol (Ascending)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSortBy("symbol");
                setSortOrder("descending");
                setIsSortModalOpen(false);
              }}
            >
              <Text>Symbol (Descending)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
          <View style={styles.sortButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                setIsSortModalOpen(true);
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                Sort by: {sortBy} ({sortOrder})
              </Text>
            </TouchableOpacity>
          </View>
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
          {sortedFilteredList.length ? (
            <FlatList
              keyboardDismissMode="on-drag"
              data={sortedFilteredList}
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
          ) : (
            <View style={styles.noAssetsFoundContainer}>
              <Text>No assets found</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    // account for status bar height on Android
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "stretch",
    justifyContent: "center",
    width: "100%",
    padding: 8,
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
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 35,
    alignItems: "flex-start",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 14,
  },
  modalTitle: { marginBottom: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 12,
    backgroundColor: "blue",
    borderRadius: 14,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
  },
  sortButtonContainer: {
    alignSelf: "baseline",
  },
  noAssetsFoundContainer: { flex: 1 },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

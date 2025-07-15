import React from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDegenList } from "../api/queries/use-degen-list";
import DegenListItem from "../components/degen-list-item";

export default function DegenListScreen() {
  const {
    data: degenList,
    isFetching: isFetchingDegenList,
    isPending,
    refetch: refetchDegenList,
  } = useDegenList();

  const [isRefreshing, setIsRefreshing] = React.useState(false);

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

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={degenList}
        renderItem={({ item }) => (
          <DegenListItem isRefreshing={isFetchingDegenList} item={item} />
        )}
        keyExtractor={(item) => item.token_address}
        contentContainerStyle={{ gap: 24 }}
        extraData={isFetchingDegenList}
        maxToRenderPerBatch={10}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});

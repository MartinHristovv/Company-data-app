import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
  StyleSheet,
} from "react-native";
import { useAppContext } from "../state/AppContext";
import { CompanyCard } from "./CompanyCard";
import { Company } from "../data/types";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function ResultList() {
  const { state } = useAppContext();
  const { results, searchQuery } = state;
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [results]);

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No results found.</Text>
      </View>
    );
  }

  return (
    <FlatList<Company>
      data={results}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <CompanyCard company={item} />}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.countBar}>
          <Text style={styles.countText}>
            {isSearching
              ? `${results.length} result${results.length === 1 ? "" : "s"} found`
              : `${results.length} ${results.length === 1 ? "company" : "companies"}`}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  countBar: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 12,
    color: "#888",
  },
});

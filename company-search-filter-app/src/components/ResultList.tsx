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
  const { results } = state;

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
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
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
});

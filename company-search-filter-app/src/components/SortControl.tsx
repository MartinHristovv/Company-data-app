import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppContext } from "../state/AppContext";
import { SortField } from "../state/types";

const SORT_FIELDS: SortField[] = [
  "name",
  "founded_year",
  "revenue",
  "net_income",
  "company_type",
  "size",
];

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  founded_year: "Founded",
  revenue: "Revenue",
  net_income: "Net Income",
  company_type: "Type",
  size: "Size",
};

export function SortControl() {
  const { state, dispatch } = useAppContext();
  const { sortField, sortDirection } = state;

  function handleChipPress(field: SortField) {
    if (field !== sortField) {
      // New field — start at asc
      dispatch({ type: "SET_SORT", payload: { field, direction: "asc" } });
    } else if (sortDirection === "asc") {
      // Second tap — switch to desc
      dispatch({ type: "SET_SORT", payload: { field, direction: "desc" } });
    } else {
      // Third tap — clear sort entirely
      dispatch({
        type: "SET_SORT",
        payload: { field: null, direction: "asc" },
      });
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {SORT_FIELDS.map((field) => {
          const isActive = field === sortField;
          return (
            <TouchableOpacity
              key={field}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => handleChipPress(field)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {FIELD_LABELS[field!]}
                {isActive ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#1a73e8",
    borderColor: "#1a73e8",
  },
  chipText: {
    fontSize: 13,
    color: "#555",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});

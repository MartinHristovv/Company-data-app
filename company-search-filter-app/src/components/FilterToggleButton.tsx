import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

interface FilterToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export function FilterToggleButton({
  isVisible,
  onToggle,
  activeFilterCount,
}: FilterToggleButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, activeFilterCount > 0 && styles.buttonActive]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, activeFilterCount > 0 && styles.textActive]}>
        {isVisible ? "Filters ▲" : "Filters ▼"}
      </Text>
      {activeFilterCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeFilterCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    marginHorizontal: 12,
    marginVertical: 4,
    gap: 8,
  },
  buttonActive: {
    borderColor: "#1a73e8",
    backgroundColor: "#e8f0fe",
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  textActive: {
    color: "#1a73e8",
  },
  badge: {
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});

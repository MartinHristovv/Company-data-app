import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface FilterToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function FilterToggleButton({
  isVisible,
  onToggle,
}: FilterToggleButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{isVisible ? "Filters ▲" : "Filters ▼"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    marginHorizontal: 12,
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});

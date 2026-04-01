import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useAppContext } from "../state/AppContext";
import { useDebounce } from "../hooks/useDebounce";

export function SearchBar() {
  const { dispatch } = useAppContext();
  const [localValue, setLocalValue] = useState("");
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: debouncedValue });
  }, [debouncedValue, dispatch]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={localValue}
        onChangeText={setLocalValue}
        placeholder="Search companies..."
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
});

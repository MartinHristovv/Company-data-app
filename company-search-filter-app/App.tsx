import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { AppProvider } from "./src/state/AppContext";
import { SearchBar } from "./src/components/SearchBar";
import { SortControl } from "./src/components/SortControl";
import { FilterToggleButton } from "./src/components/FilterToggleButton";
import { FilterPanel } from "./src/components/FilterPanel";
import { ResultList } from "./src/components/ResultList";

function AppContent() {
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar />
        <SortControl />
        <FilterToggleButton
          isVisible={filterVisible}
          onToggle={() => setFilterVisible((v) => !v)}
        />
        <FilterPanel isVisible={filterVisible} />
      </View>
      <View style={styles.listContainer}>
        <ResultList />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    // sticky header area — no flex so it sizes to content
  },
  listContainer: {
    flex: 1,
  },
});

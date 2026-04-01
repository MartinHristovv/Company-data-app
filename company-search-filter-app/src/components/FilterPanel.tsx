import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useAppContext } from "../state/AppContext";
import { COMPANIES } from "../data/dataset";

interface FilterPanelProps {
  isVisible: boolean;
}

const DISTINCT_INDUSTRIES = Array.from(
  new Set(COMPANIES.map((c) => c.industry)),
).sort();

const COMPANY_TYPES: ("Public" | "Private")[] = ["Public", "Private"];
const SIZES: ("Small" | "Medium" | "Large")[] = ["Small", "Medium", "Large"];

export function FilterPanel({ isVisible }: FilterPanelProps) {
  const { state, dispatch } = useAppContext();
  const { filters } = state;

  // Animation: animate height from 0 to measuredHeight
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const hasMeasured = useRef(false);

  // Local text state for range inputs (keeps UI responsive)
  const [revenueMin, setRevenueMin] = useState("");
  const [revenueMax, setRevenueMax] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");

  // Once we have a measured height, animate on visibility change
  useEffect(() => {
    if (measuredHeight === 0) return;
    Animated.timing(animatedHeight, {
      toValue: isVisible ? measuredHeight : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isVisible, measuredHeight, animatedHeight]);

  function toggleIndustry(industry: string) {
    const next = filters.industries.includes(industry)
      ? filters.industries.filter((i) => i !== industry)
      : [...filters.industries, industry];
    dispatch({ type: "SET_FILTER", payload: { industries: next } });
  }

  function toggleCompanyType(type: "Public" | "Private") {
    const next = filters.companyTypes.includes(type)
      ? filters.companyTypes.filter((t) => t !== type)
      : [...filters.companyTypes, type];
    dispatch({ type: "SET_FILTER", payload: { companyTypes: next } });
  }

  function toggleSize(size: "Small" | "Medium" | "Large") {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    dispatch({ type: "SET_FILTER", payload: { sizes: next } });
  }

  function commitRevenueMin(text: string) {
    const val = parseFloat(text);
    dispatch({
      type: "SET_FILTER",
      payload: { revenueMin: isNaN(val) ? null : val },
    });
  }

  function commitRevenueMax(text: string) {
    const val = parseFloat(text);
    dispatch({
      type: "SET_FILTER",
      payload: { revenueMax: isNaN(val) ? null : val },
    });
  }

  function commitYearMin(text: string) {
    const val = parseInt(text, 10);
    dispatch({
      type: "SET_FILTER",
      payload: { foundedYearMin: isNaN(val) ? null : val },
    });
  }

  function commitYearMax(text: string) {
    const val = parseInt(text, 10);
    dispatch({
      type: "SET_FILTER",
      payload: { foundedYearMax: isNaN(val) ? null : val },
    });
  }

  function clearAll() {
    dispatch({ type: "CLEAR_FILTERS" });
    setRevenueMin("");
    setRevenueMax("");
    setYearMin("");
    setYearMax("");
  }

  const filterContent = (
    <View style={styles.content}>
      {/* Industry — multi-select checkboxes */}
      <Text style={styles.sectionTitle}>Industry</Text>
      <View style={styles.checkboxGroup}>
        {DISTINCT_INDUSTRIES.map((industry) => {
          const checked = filters.industries.includes(industry);
          return (
            <TouchableOpacity
              key={industry}
              style={styles.checkboxRow}
              onPress={() => toggleIndustry(industry)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, checked && styles.checkboxChecked]}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{industry}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Company Type — multi-select checkboxes */}
      <Text style={styles.sectionTitle}>Company Type</Text>
      <View style={styles.checkboxGroup}>
        {COMPANY_TYPES.map((type) => {
          const checked = filters.companyTypes.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={styles.checkboxRow}
              onPress={() => toggleCompanyType(type)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, checked && styles.checkboxChecked]}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{type}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Size — multi-select checkboxes */}
      <Text style={styles.sectionTitle}>Size</Text>
      <View style={styles.checkboxGroup}>
        {SIZES.map((size) => {
          const checked = filters.sizes.includes(size);
          return (
            <TouchableOpacity
              key={size}
              style={styles.checkboxRow}
              onPress={() => toggleSize(size)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, checked && styles.checkboxChecked]}
              >
                {checked && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>{size}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Revenue Range */}
      <Text style={styles.sectionTitle}>Revenue Range (USD)</Text>
      <View style={styles.rangeRow}>
        <TextInput
          style={styles.rangeInput}
          placeholder="Min"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={revenueMin}
          onChangeText={setRevenueMin}
          onBlur={() => commitRevenueMin(revenueMin)}
          onSubmitEditing={() => commitRevenueMin(revenueMin)}
        />
        <Text style={styles.rangeSeparator}>–</Text>
        <TextInput
          style={styles.rangeInput}
          placeholder="Max"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={revenueMax}
          onChangeText={setRevenueMax}
          onBlur={() => commitRevenueMax(revenueMax)}
          onSubmitEditing={() => commitRevenueMax(revenueMax)}
        />
      </View>

      {/* Founded Year Range */}
      <Text style={styles.sectionTitle}>Founded Year Range</Text>
      <View style={styles.rangeRow}>
        <TextInput
          style={styles.rangeInput}
          placeholder="Min"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={yearMin}
          onChangeText={setYearMin}
          onBlur={() => commitYearMin(yearMin)}
          onSubmitEditing={() => commitYearMin(yearMin)}
        />
        <Text style={styles.rangeSeparator}>–</Text>
        <TextInput
          style={styles.rangeInput}
          placeholder="Max"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={yearMax}
          onChangeText={setYearMax}
          onBlur={() => commitYearMax(yearMax)}
          onSubmitEditing={() => commitYearMax(yearMax)}
        />
      </View>

      {/* Clear All */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearAll}
        activeOpacity={0.7}
      >
        <Text style={styles.clearButtonText}>Clear All Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {/* Hidden measurement render — positioned off-screen so layout fires */}
      {!hasMeasured.current && (
        <View
          style={styles.measureContainer}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0) {
              hasMeasured.current = true;
              setMeasuredHeight(h);
              // If already visible when first measured, jump to full height
              if (isVisible) animatedHeight.setValue(h);
            }
          }}
          pointerEvents="none"
        >
          {filterContent}
        </View>
      )}

      {/* Animated visible panel */}
      <Animated.View
        style={[styles.animatedWrapper, { height: animatedHeight }]}
      >
        <ScrollView
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filterContent}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  measureContainer: {
    position: "absolute",
    top: -9999,
    left: 0,
    right: 0,
    opacity: 0,
  },
  animatedWrapper: {
    overflow: "hidden",
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginTop: 10,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 3,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1a73e8",
    borderColor: "#1a73e8",
  },
  checkmark: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#333",
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
  rangeSeparator: {
    fontSize: 16,
    color: "#888",
  },
  clearButton: {
    marginTop: 14,
    marginBottom: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f44336",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});

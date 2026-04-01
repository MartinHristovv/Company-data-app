import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Company } from "../data/types";

interface CompanyCardProps {
  company: Company;
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000_000)
    return `${sign}$${(abs / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000)
    return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs}`;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const {
    name,
    industry,
    country,
    founded_year,
    financials,
    details,
    board_members,
    offices,
  } = company;
  const { revenue, net_income } = financials;
  const { company_type, size, ceo_name, headquarters } = details;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{company_type}</Text>
          <Text style={styles.badge}>{size}</Text>
        </View>
      </View>

      {/* Core fields */}
      <View style={styles.row}>
        <Text style={styles.label}>Industry</Text>
        <Text style={styles.value}>{industry}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Country</Text>
        <Text style={styles.value}>{country}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Founded</Text>
        <Text style={styles.value}>{founded_year}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>CEO</Text>
        <Text style={styles.value}>{ceo_name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>HQ</Text>
        <Text style={styles.value}>{headquarters}</Text>
      </View>

      {/* Financials */}
      <View style={styles.financials}>
        <View style={styles.financialItem}>
          <Text style={styles.label}>Revenue</Text>
          <Text style={styles.financialValue}>{formatCurrency(revenue)}</Text>
        </View>
        <View style={styles.financialItem}>
          <Text style={styles.label}>Net Income</Text>
          <Text
            style={[styles.financialValue, net_income < 0 && styles.negative]}
          >
            {formatCurrency(net_income)}
          </Text>
        </View>
      </View>

      {/* Expand/collapse for board members & offices */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? "Hide details ▲" : "Show board & offices ▼"}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedSection}>
          {/* Board Members */}
          {board_members.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Board Members</Text>
              {board_members.map((bm, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.value}>{bm.name}</Text>
                  <Text style={styles.label}>{bm.role}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Offices */}
          {offices.length > 0 && (
            <View style={styles.subSection}>
              <Text style={styles.subSectionTitle}>Offices</Text>
              {offices.map((office, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.value}>
                    {office.city}, {office.country}
                  </Text>
                  <Text style={[styles.label, styles.officeType]}>
                    {office.type}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    fontSize: 11,
    color: "#555",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#888",
  },
  value: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  financials: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  financialItem: {
    alignItems: "center",
  },
  financialValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 2,
  },
  negative: {
    color: "#d32f2f",
  },
  expandButton: {
    marginTop: 10,
    paddingVertical: 6,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  expandButtonText: {
    fontSize: 12,
    color: "#1a73e8",
    fontWeight: "500",
  },
  expandedSection: {
    marginTop: 8,
  },
  subSection: {
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  officeType: {
    color: "#1a73e8",
    fontWeight: "500",
  },
});

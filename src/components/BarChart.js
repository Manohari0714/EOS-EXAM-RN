import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Simple income vs expense bar chart built with plain Views (no chart library needed).
export default function BarChart({ bars, height = 140 }) {
  const max = Math.max(1, ...bars.flatMap((b) => [b.income, b.expense]));
  const h = (v) => (v > 0 ? Math.max(4, (v / max) * height) : 2);
  const compact = bars.length > 8;
  return (
    <View>
      <View style={[styles.row, { height }]}>
        {bars.map((b, i) => (
          <View key={i} style={styles.col}>
            <View style={[styles.pair, { height }]}>
              <View style={[styles.bar, { height: h(b.income), backgroundColor: colors.primary, width: compact ? 6 : 10 }]} />
              <View style={{ width: 2 }} />
              <View style={[styles.bar, { height: h(b.expense), backgroundColor: colors.blue, width: compact ? 6 : 10 }]} />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {bars.map((b, i) => (
          <Text key={i} style={[styles.label, compact && { fontSize: 8 }]} numberOfLines={1}>
            {b.label}
          </Text>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <Text style={styles.legendText}>Income</Text>
        <View style={[styles.dot, { backgroundColor: colors.blue, marginLeft: 16 }]} />
        <Text style={styles.legendText}>Expense</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center' },
  pair: { flexDirection: 'row', alignItems: 'flex-end' },
  bar: { borderRadius: 4 },
  labels: { flexDirection: 'row', marginTop: 6 },
  label: { flex: 1, textAlign: 'center', fontSize: 10, color: colors.textMuted },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: colors.textMuted },
});

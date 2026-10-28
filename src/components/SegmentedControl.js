import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function SegmentedControl({ options, value, onChange, style }) {
  return (
    <View style={[styles.wrap, style]}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <TouchableOpacity
            key={o.key}
            onPress={() => onChange(o.key)}
            style={[styles.item, active && styles.itemActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: colors.mint, borderRadius: 22, padding: 4 },
  item: { flex: 1, height: 38, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  itemActive: { backgroundColor: colors.primary },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  labelActive: { color: colors.text },
});

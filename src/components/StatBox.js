import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { formatMoney } from '../utils/helpers';

export default function StatBox({ label, value, icon, tone = 'green', raw, style }) {
  const bg = tone === 'blue' ? colors.blue : tone === 'dark' ? colors.text : colors.primary;
  return (
    <View style={[styles.box, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={20} color="#fff" /> : null}
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {raw !== undefined ? raw : formatMoney(value)}
      </Text>
    </View>
  );
}

export function EmptyState({ text }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="document-text-outline" size={36} color={colors.textMuted} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, borderRadius: 20, padding: 14 },
  label: { color: '#fff', opacity: 0.9, fontSize: 12, marginTop: 6 },
  value: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: colors.textMuted, marginTop: 8, fontSize: 13 },
});

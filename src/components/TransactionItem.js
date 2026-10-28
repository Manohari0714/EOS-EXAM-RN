import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { formatMoney, formatDate, formatTime } from '../utils/helpers';

export default function TransactionItem({ tx, onPress, onDelete }) {
  const { getCategory } = useApp();
  const cat = getCategory(tx.category);
  const income = tx.type === 'income';
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={styles.row}>
      <View style={[styles.icon, { backgroundColor: income ? colors.primary : colors.blue }]}>
        <Ionicons name={cat.icon} size={20} color="#fff" />
      </View>
      <View style={styles.mid}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {formatTime(tx.date)} · {formatDate(tx.date)} · {cat.name}
        </Text>
      </View>
      <Text style={[styles.amount, { color: income ? colors.primaryDark : colors.blue }]}>
        {income ? '+' : '-'}
        {formatMoney(tx.amount)}
      </Text>
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.del} accessibilityLabel="Delete transaction">
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  icon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  mid: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700', marginLeft: 8 },
  del: { marginLeft: 10, padding: 4 },
});

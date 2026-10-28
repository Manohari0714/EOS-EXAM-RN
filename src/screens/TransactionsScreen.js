import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import TransactionItem from '../components/TransactionItem';
import StatBox, { EmptyState } from '../components/StatBox';
import SegmentedControl from '../components/SegmentedControl';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { MONTH_LONG, sameMonth, dayLabel, totalOf } from '../utils/helpers';
import { confirmDialog, notify } from '../utils/dialogs';

// Rubric item 4: Transaction (month wise) Screen (only Customer)
export default function TransactionsScreen({ navigation }) {
  const { userTransactions, deleteTransaction } = useApp();
  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [filter, setFilter] = useState('all');

  const monthTxs = useMemo(
    () =>
      userTransactions
        .filter((t) => sameMonth(new Date(t.date), month))
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [userTransactions, month]
  );
  const shown = filter === 'all' ? monthTxs : monthTxs.filter((t) => t.type === filter);

  const groups = useMemo(() => {
    const map = {};
    shown.forEach((t) => {
      const key = dayLabel(t.date);
      (map[key] = map[key] || []).push(t);
    });
    return Object.entries(map);
  }, [shown]);

  const isCurrent = sameMonth(month, now);
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  const remove = (t) =>
    confirmDialog('Delete transaction', `Delete "${t.title}"?`, () => {
      const res = deleteTransaction(t.id);
      notify('Transaction deleted', res.message);
    }, 'Delete');

  return (
    <ScreenLayout
      title="Transactions"
      showMenu
      fab={{ icon: 'add', onPress: () => navigation.navigate('AddTransaction'), label: 'Add transaction' }}
    >
      <View style={styles.monthRow}>
        <TouchableOpacity onPress={() => shift(-1)} style={styles.arrow} accessibilityLabel="Previous month">
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.month}>
          {MONTH_LONG[month.getMonth()]} {month.getFullYear()}
        </Text>
        <TouchableOpacity
          onPress={() => shift(1)}
          disabled={isCurrent}
          style={[styles.arrow, isCurrent && { opacity: 0.35 }]}
          accessibilityLabel="Next month"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Income" value={totalOf(monthTxs, 'income')} icon="arrow-down-circle" />
        <View style={{ width: 12 }} />
        <StatBox label="Expense" value={totalOf(monthTxs, 'expense')} icon="arrow-up-circle" tone="blue" />
      </View>

      <SegmentedControl
        options={[
          { key: 'all', label: 'All' },
          { key: 'income', label: 'Income' },
          { key: 'expense', label: 'Expense' },
        ]}
        value={filter}
        onChange={setFilter}
        style={{ marginVertical: 16 }}
      />

      {groups.length === 0 ? (
        <EmptyState text="No transactions in this month" />
      ) : (
        groups.map(([label, items]) => (
          <View key={label} style={{ marginBottom: 8 }}>
            <Text style={styles.group}>{label}</Text>
            {items.map((t) => (
              <TransactionItem
                key={t.id}
                tx={t}
                onPress={() => navigation.navigate('AddTransaction', { id: t.id })}
                onDelete={() => remove(t)}
              />
            ))}
          </View>
        ))
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: { fontSize: 18, fontWeight: '800', color: colors.text },
  statsRow: { flexDirection: 'row' },
  group: { fontSize: 14, fontWeight: '700', color: colors.textMuted, marginTop: 6 },
});

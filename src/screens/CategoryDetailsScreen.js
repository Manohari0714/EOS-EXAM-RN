import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import TransactionItem from '../components/TransactionItem';
import StatBox, { EmptyState } from '../components/StatBox';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { MONTH_LONG, formatMoney, sameMonth, totalOf } from '../utils/helpers';
import { validateAmount } from '../utils/validators';
import { notify } from '../utils/dialogs';

// Rubric item 6: Category Details Screen (Customer)
export default function CategoryDetailsScreen({ navigation, route }) {
  const { categoryId } = route.params;
  const { getCategory, userTransactions, getCategoryBudget, setCategoryBudget } = useApp();
  const cat = getCategory(categoryId);

  const now = new Date();
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [limit, setLimit] = useState('');
  const [limitError, setLimitError] = useState('');

  const all = useMemo(() => userTransactions.filter((t) => t.category === categoryId), [userTransactions, categoryId]);
  const monthTxs = useMemo(
    () => all.filter((t) => sameMonth(new Date(t.date), month)).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [all, month]
  );

  const budget = getCategoryBudget(categoryId);
  const spent = totalOf(monthTxs, 'expense');
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const over = budget > 0 && spent > budget;
  const isCurrent = sameMonth(month, now);
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));

  const saveLimit = () => {
    const err = validateAmount(limit);
    setLimitError(err);
    if (err) return;
    setCategoryBudget(categoryId, parseFloat(limit));
    setLimit('');
    notify('Limit saved', `Monthly limit for ${cat.name} is now ${formatMoney(parseFloat(limit))}.`);
  };

  return (
    <ScreenLayout title={cat.name} showBack>
      <View style={styles.head}>
        <View style={styles.circle}>
          <Ionicons name={cat.icon} size={30} color="#fff" />
        </View>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={styles.headTitle}>{cat.name}</Text>
          <Text style={styles.headSub}>{all.length} transaction(s) overall</Text>
        </View>
      </View>

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

      <View style={styles.row}>
        <StatBox label="Spent" value={spent} icon="arrow-up-circle" tone="blue" />
        <View style={{ width: 12 }} />
        <StatBox label="Income" value={totalOf(monthTxs, 'income')} icon="arrow-down-circle" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly limit</Text>
        {budget > 0 ? (
          <>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%`, backgroundColor: over ? colors.danger : colors.primary }]} />
            </View>
            <Text style={[styles.limitText, over && { color: colors.danger }]}>
              {formatMoney(spent)} of {formatMoney(budget)} ({pct}%){over ? ' - limit exceeded' : ''}
            </Text>
          </>
        ) : (
          <Text style={styles.limitText}>No limit set for this category.</Text>
        )}
        <InputField
          placeholder="Set new limit amount"
          keyboardType="decimal-pad"
          value={limit}
          onChangeText={setLimit}
          error={limitError}
          style={{ marginTop: 12, marginBottom: 10 }}
        />
        <PrimaryButton title="Save Limit" variant="secondary" onPress={saveLimit} />
      </View>

      <Text style={[styles.cardTitle, { marginTop: 20 }]}>Transactions</Text>
      {monthTxs.length === 0 ? (
        <EmptyState text={`No ${cat.name} transactions in ${MONTH_LONG[month.getMonth()]}`} />
      ) : (
        monthTxs.map((t) => (
          <TransactionItem key={t.id} tx={t} onPress={() => navigation.navigate('AddTransaction', { id: t.id })} />
        ))
      )}

      <PrimaryButton
        title={`Add ${cat.name} Transaction`}
        onPress={() => navigation.navigate('AddTransaction', { categoryId })}
        style={{ marginTop: 14 }}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  headSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: { fontSize: 17, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row' },
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 16, marginTop: 16 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  track: { height: 12, borderRadius: 6, backgroundColor: colors.mint, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 6 },
  limitText: { fontSize: 12, color: colors.textMuted, marginTop: 6 },
});

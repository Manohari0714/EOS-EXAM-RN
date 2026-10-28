import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import SegmentedControl from '../components/SegmentedControl';
import BarChart from '../components/BarChart';
import StatBox, { EmptyState } from '../components/StatBox';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { buildReport, expenseByCategory, formatMoney } from '../utils/helpers';

// Rubric item 2: Analysis Screen (Admin and Customers)
// Customers see their own data, Admin sees the data of all customers combined.
export default function AnalysisScreen() {
  const { currentUser, userTransactions, transactions, users, getCategory } = useApp();
  const isAdmin = currentUser.role === 'admin';
  const source = isAdmin ? transactions : userTransactions;
  const [period, setPeriod] = useState('monthly');

  const report = useMemo(() => buildReport(source, period), [source, period]);
  const cats = useMemo(() => expenseByCategory(report.items), [report]);
  const maxCat = cats.length ? cats[0].total : 1;

  const perUser = useMemo(() => {
    if (!isAdmin) return [];
    return users
      .filter((u) => u.role === 'customer')
      .map((u) => {
        const list = report.items.filter((t) => t.userId === u.id);
        return {
          user: u,
          income: list.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
          expense: list.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
      });
  }, [isAdmin, users, report]);

  const saved = report.income > 0 ? Math.max(0, Math.round(((report.income - report.expense) / report.income) * 100)) : 0;

  return (
    <ScreenLayout title={isAdmin ? 'Overall Analysis' : 'Analysis'} showMenu>
      <SegmentedControl
        options={[
          { key: 'daily', label: 'Daily' },
          { key: 'weekly', label: 'Weekly' },
          { key: 'monthly', label: 'Monthly' },
          { key: 'yearly', label: 'Year' },
        ]}
        value={period}
        onChange={setPeriod}
        style={{ marginBottom: 16 }}
      />

      <View style={styles.row}>
        <StatBox label="Income" value={report.income} icon="arrow-down-circle" />
        <View style={{ width: 12 }} />
        <StatBox label="Expense" value={report.expense} icon="arrow-up-circle" tone="blue" />
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <StatBox label="Balance" value={report.balance} icon="wallet" tone="dark" />
        <View style={{ width: 12 }} />
        <StatBox label="Income saved" raw={`${saved}%`} icon="trending-up" tone="dark" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Income & Expenses</Text>
        <BarChart bars={report.bars} height={150} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Spending by Category</Text>
        {cats.length === 0 ? (
          <EmptyState text="No expenses in this period" />
        ) : (
          cats.map(({ category, total }) => {
            const c = getCategory(category);
            return (
              <View key={category} style={{ marginBottom: 12 }}>
                <View style={styles.catRow}>
                  <Text style={styles.catName}>{c.name}</Text>
                  <Text style={styles.catAmt}>{formatMoney(total)}</Text>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.max(4, (total / maxCat) * 100)}%` }]} />
                </View>
              </View>
            );
          })
        )}
      </View>

      {isAdmin ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customers ({perUser.length})</Text>
          {perUser.length === 0 ? (
            <EmptyState text="No customers yet" />
          ) : (
            perUser.map((p) => (
              <View key={p.user.id} style={styles.userRow}>
                <Text style={styles.catName}>{p.user.name}</Text>
                <Text style={styles.userNums}>
                  +{formatMoney(p.income)}  /  -{formatMoney(p.expense)}
                </Text>
              </View>
            ))
          )}
        </View>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 16, marginTop: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 12 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  catName: { fontSize: 14, fontWeight: '600', color: colors.text },
  catAmt: { fontSize: 13, color: colors.textMuted },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.mint, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5, backgroundColor: colors.primary },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.mint,
  },
  userNums: { fontSize: 12, color: colors.textMuted },
});

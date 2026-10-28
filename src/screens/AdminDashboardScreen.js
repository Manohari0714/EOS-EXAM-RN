import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import StatBox, { EmptyState } from '../components/StatBox';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { formatMoney, initials, totalOf } from '../utils/helpers';
import { confirmDialog, notify } from '../utils/dialogs';

// Admin home: platform totals + customer list (admin can remove a customer).
export default function AdminDashboardScreen() {
  const { currentUser, users, transactions, deleteUser } = useApp();
  const customers = users.filter((u) => u.role === 'customer');

  const remove = (u) =>
    confirmDialog('Remove customer', `Remove ${u.name} and all their transactions?`, () => {
      deleteUser(u.id);
      notify('Customer removed', `${u.name} has been removed.`);
    }, 'Remove');

  return (
    <ScreenLayout title="Admin Dashboard" showMenu>
      <Text style={styles.hi}>Hello, {currentUser.name.split(' ')[0]}</Text>
      <Text style={styles.sub}>Overview of all customers</Text>

      <View style={styles.row}>
        <StatBox label="Customers" raw={String(customers.length)} icon="people" tone="dark" />
        <View style={{ width: 12 }} />
        <StatBox label="Transactions" raw={String(transactions.length)} icon="swap-horizontal" tone="dark" />
      </View>
      <View style={[styles.row, { marginTop: 12 }]}>
        <StatBox label="Total Income" value={totalOf(transactions, 'income')} icon="arrow-down-circle" />
        <View style={{ width: 12 }} />
        <StatBox label="Total Expense" value={totalOf(transactions, 'expense')} icon="arrow-up-circle" tone="blue" />
      </View>

      <Text style={styles.title}>Customers</Text>
      {customers.length === 0 ? (
        <EmptyState text="No customers registered" />
      ) : (
        customers.map((u) => {
          const list = transactions.filter((t) => t.userId === u.id);
          const bal = totalOf(list, 'income') - totalOf(list, 'expense');
          return (
            <View key={u.id} style={styles.user}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(u.name)}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.uName}>{u.name}</Text>
                <Text style={styles.uSub} numberOfLines={1}>
                  {u.email} · {list.length} txns
                </Text>
                <Text style={styles.uBal}>Balance {formatMoney(bal)}</Text>
              </View>
              <TouchableOpacity onPress={() => remove(u)} style={styles.del} accessibilityLabel="Remove customer">
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hi: { fontSize: 22, fontWeight: '800', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginBottom: 16, marginTop: 2 },
  row: { flexDirection: 'row' },
  title: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 10 },
  user: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 12, marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontWeight: '800', color: colors.text },
  uName: { fontSize: 15, fontWeight: '700', color: colors.text },
  uSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  uBal: { fontSize: 12, color: colors.primaryDark, fontWeight: '700', marginTop: 2 },
  del: { padding: 8 },
});

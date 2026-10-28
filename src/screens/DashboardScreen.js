import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import SegmentedControl from '../components/SegmentedControl';
import BarChart from '../components/BarChart';
import TransactionItem from '../components/TransactionItem';
import StatBox, { EmptyState } from '../components/StatBox';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { buildReport, formatMoney, formatDate, formatTime, totalOf } from '../utils/helpers';

// Customer Home (tab). Includes the daily / weekly / monthly reports (Functional Requirement iii)
// and the notification bell that shows the personalised alerts (Functional Requirement ii).
export default function DashboardScreen({ navigation }) {
  const { currentUser, userTransactions, notifications, markNotificationsRead } = useApp();
  const [period, setPeriod] = useState('daily');
  const [showNotes, setShowNotes] = useState(false);

  const report = useMemo(() => buildReport(userTransactions, period), [userTransactions, period]);
  const monthly = useMemo(() => buildReport(userTransactions, 'monthly'), [userTransactions]);

  const totalIncome = totalOf(userTransactions, 'income');
  const totalExpense = totalOf(userTransactions, 'expense');
  const balance = totalIncome - totalExpense;
  const budget = currentUser.budget;
  const pct = budget > 0 ? Math.min(100, Math.round((monthly.expense / budget) * 100)) : 0;
  const over = budget > 0 && monthly.expense > budget;
  const unread = notifications.filter((n) => !n.read).length;
  const first = currentUser.name.trim().split(/\s+/)[0];

  const openNotes = () => {
    setShowNotes(true);
    markNotificationsRead();
  };

  const bell = (
    <TouchableOpacity style={styles.bell} onPress={openNotes} accessibilityLabel="Notifications">
      <Ionicons name="notifications" size={20} color={colors.text} />
      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const headerExtra = (
    <View style={styles.hero}>
      <Text style={styles.hi}>Hi, Welcome Back {first}</Text>
      <View style={styles.balanceRow}>
        <View style={styles.balanceCol}>
          <Text style={styles.small}>Total Balance</Text>
          <Text style={styles.big}>{formatMoney(balance)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.balanceCol}>
          <Text style={styles.small}>Total Expense</Text>
          <Text style={[styles.big, { color: colors.blue }]}>-{formatMoney(totalExpense)}</Text>
        </View>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: over ? colors.danger : colors.text }]} />
      </View>
      <Text style={styles.progressText}>
        {budget > 0
          ? `${pct}% of your ${formatMoney(budget)} monthly budget used${over ? ' - over budget!' : ''}`
          : 'No monthly budget set (set one in Edit Profile)'}
      </Text>
    </View>
  );

  return (
    <>
      <ScreenLayout
        title="Home"
        showMenu
        right={bell}
        headerExtra={headerExtra}
        fab={{ icon: 'add', onPress: () => navigation.navigate('AddTransaction'), label: 'Add transaction' }}
      >
        <SegmentedControl
          options={[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' },
          ]}
          value={period}
          onChange={setPeriod}
          style={{ marginBottom: 16 }}
        />

        <View style={styles.statsRow}>
          <StatBox label="Income" value={report.income} icon="arrow-down-circle" />
          <View style={{ width: 12 }} />
          <StatBox label="Expense" value={report.expense} icon="arrow-up-circle" tone="blue" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {period === 'daily' ? "Today's Report" : period === 'weekly' ? 'Last 7 Days' : 'This Month by Week'}
          </Text>
          <BarChart bars={report.bars} />
        </View>

        <View style={styles.listHead}>
          <Text style={styles.cardTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.see}>See all</Text>
          </TouchableOpacity>
        </View>
        {report.items.length === 0 ? (
          <EmptyState text="No transactions for this period" />
        ) : (
          report.items.slice(0, 5).map((t) => (
            <TransactionItem key={t.id} tx={t} onPress={() => navigation.navigate('AddTransaction', { id: t.id })} />
          ))
        )}
      </ScreenLayout>

      <Modal visible={showNotes} animationType="slide" transparent onRequestClose={() => setShowNotes(false)}>
        <View style={styles.modalBack}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotes(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 420 }}>
              {notifications.length === 0 ? (
                <EmptyState text="No alerts yet. Add or edit a transaction to get one." />
              ) : (
                notifications.map((n) => (
                  <View key={n.id} style={styles.note}>
                    <Ionicons name="notifications-circle" size={26} color={colors.primaryDark} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.noteText}>{n.message}</Text>
                      <Text style={styles.noteTime}>
                        {formatDate(n.date)} · {formatTime(n.date)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <PrimaryButton title="Close" onPress={() => setShowNotes(false)} style={{ marginTop: 12 }} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 24, paddingBottom: 8, paddingTop: 6 },
  hi: { fontSize: 18, fontWeight: '800', color: colors.text },
  balanceRow: { flexDirection: 'row', marginTop: 14 },
  balanceCol: { flex: 1 },
  divider: { width: 1, backgroundColor: colors.text, opacity: 0.3, marginHorizontal: 14 },
  small: { fontSize: 12, color: colors.text, opacity: 0.8 },
  big: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 2 },
  progressTrack: { height: 14, borderRadius: 7, backgroundColor: colors.mint, marginTop: 14, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 7 },
  progressText: { fontSize: 11, color: colors.text, marginTop: 6 },
  bell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  statsRow: { flexDirection: 'row', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 22, padding: 16, marginBottom: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  listHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  see: { color: colors.primaryDark, fontWeight: '700', marginBottom: 10 },
  modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.bg, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: 30 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  note: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginBottom: 10 },
  noteText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  noteTime: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { formatMoney, initials, totalOf } from '../utils/helpers';
import { confirmDialog } from '../utils/dialogs';

// Rubric item 3 (part 1): Profile Screen (only Customer)
export default function ProfileScreen({ navigation }) {
  const { currentUser, userTransactions, signOut } = useApp();
  const balance = totalOf(userTransactions, 'income') - totalOf(userTransactions, 'expense');

  const rows = [
    { icon: 'mail-outline', label: 'Email', value: currentUser.email },
    { icon: 'call-outline', label: 'Mobile', value: currentUser.phone },
    { icon: 'ribbon-outline', label: 'Account type', value: 'Customer' },
    { icon: 'speedometer-outline', label: 'Monthly budget', value: formatMoney(currentUser.budget) },
  ];

  return (
    <ScreenLayout title="Profile" showMenu>
      <View style={styles.top}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(currentUser.name)}</Text>
        </View>
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.id}>ID: {currentUser.id.toUpperCase()}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{userTransactions.length}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statVal}>{formatMoney(balance)}</Text>
          <Text style={styles.statLabel}>Balance</Text>
        </View>
      </View>

      <View style={styles.card}>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
            <View style={styles.rowIcon}>
              <Ionicons name={r.icon} size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowValue}>{r.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
        <Ionicons name="create-outline" size={20} color={colors.text} />
        <Text style={styles.editText}>Edit Profile</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.text} />
      </TouchableOpacity>

      <PrimaryButton
        title="Log Out"
        variant="outline"
        style={{ marginTop: 16 }}
        onPress={() => confirmDialog('Log out', 'Are you sure you want to log out?', signOut, 'Log out')}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', marginBottom: 18 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.mint,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: colors.text },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 12 },
  id: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  stats: { flexDirection: 'row', backgroundColor: colors.primary, borderRadius: 22, padding: 16, marginBottom: 18 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: colors.text, opacity: 0.3 },
  statVal: { fontSize: 18, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 12, color: colors.text, opacity: 0.8, marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.mint },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: { fontSize: 11, color: colors.textMuted },
  rowValue: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 1 },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  editText: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '700', color: colors.text },
});

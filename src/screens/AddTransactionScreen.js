import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { validateTitle, validateAmount, validateDate } from '../utils/validators';
import { formatDMY, parseDMY } from '../utils/helpers';
import { notify, confirmDialog } from '../utils/dialogs';

// Add / edit a transaction. Saving shows a personalised alert (Functional Requirement ii).
export default function AddTransactionScreen({ navigation, route }) {
  const { userTransactions, categories, addTransaction, updateTransaction, deleteTransaction } = useApp();
  const { id, categoryId } = route.params || {};
  const existing = id ? userTransactions.find((t) => t.id === id) : null;

  const [type, setType] = useState(existing ? existing.type : 'expense');
  const [title, setTitle] = useState(existing ? existing.title : '');
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [category, setCategory] = useState(existing ? existing.category : categoryId || 'food');
  const [dateStr, setDateStr] = useState(formatDMY(existing ? new Date(existing.date) : new Date()));
  const [errors, setErrors] = useState({});

  const setQuickDate = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setDateStr(formatDMY(d));
  };

  const submit = () => {
    const e = {
      title: validateTitle(title),
      amount: validateAmount(amount),
      date: validateDate(dateStr),
    };
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const when = parseDMY(dateStr);
    const clock = existing ? new Date(existing.date) : new Date();
    when.setHours(clock.getHours(), clock.getMinutes(), 0, 0);

    const data = {
      type,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      date: when.toISOString(),
    };
    const res = existing ? updateTransaction(existing.id, data) : addTransaction(data);
    notify(existing ? 'Transaction updated' : 'Transaction added', res.message, () => navigation.goBack());
  };

  const remove = () =>
    confirmDialog('Delete transaction', `Delete "${existing.title}"?`, () => {
      const res = deleteTransaction(existing.id);
      notify('Transaction deleted', res.message, () => navigation.goBack());
    }, 'Delete');

  return (
    <ScreenLayout title={existing ? 'Edit Transaction' : 'Add Transaction'} showBack>
      <SegmentedControl
        options={[
          { key: 'expense', label: 'Expense' },
          { key: 'income', label: 'Income' },
        ]}
        value={type}
        onChange={setType}
        style={{ marginBottom: 20 }}
      />

      <InputField label="Title" icon="create-outline" placeholder="e.g. Lunch, Salary" autoCapitalize="sentences" value={title} onChangeText={setTitle} error={errors.title} />
      <InputField label="Amount" icon="cash-outline" placeholder="0.00" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} error={errors.amount} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chips}>
        {categories.map((c) => {
          const active = c.id === category;
          return (
            <TouchableOpacity
              key={c.id}
              onPress={() => setCategory(c.id)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Ionicons name={c.icon} size={16} color={active ? colors.text : colors.textMuted} />
              <Text style={[styles.chipText, active && { color: colors.text }]}>{c.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <InputField label="Date (DD-MM-YYYY)" icon="calendar-outline" placeholder="DD-MM-YYYY" value={dateStr} onChangeText={setDateStr} error={errors.date} keyboardType="numbers-and-punctuation" />
      <View style={styles.quick}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => setQuickDate(0)}>
          <Text style={styles.quickText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => setQuickDate(1)}>
          <Text style={styles.quickText}>Yesterday</Text>
        </TouchableOpacity>
      </View>

      <PrimaryButton title={existing ? 'Save Changes' : 'Save Transaction'} onPress={submit} style={{ marginTop: 8 }} />
      {existing ? <PrimaryButton title="Delete Transaction" variant="danger" onPress={remove} style={{ marginTop: 12 }} /> : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 36,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primaryDark },
  chipText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: colors.textMuted },
  quick: { flexDirection: 'row', marginTop: -6, marginBottom: 6 },
  quickBtn: { backgroundColor: colors.lightBlue, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
  quickText: { color: colors.blue, fontWeight: '700', fontSize: 12 },
});

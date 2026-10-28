import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { buildReport, formatMoney, sameMonth } from '../utils/helpers';
import { validateCategoryName } from '../utils/validators';
import { notify } from '../utils/dialogs';

export default function CategoriesScreen({ navigation }) {
  const { categories, userTransactions, addCategory } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const monthly = useMemo(() => buildReport(userTransactions, 'monthly'), [userTransactions]);

  const spentIn = (id) =>
    userTransactions
      .filter((t) => t.category === id && t.type === 'expense' && sameMonth(new Date(t.date), new Date()))
      .reduce((s, t) => s + t.amount, 0);

  const save = () => {
    const err = validateCategoryName(name);
    setError(err);
    if (err) return;
    const res = addCategory(name);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setName('');
    setShowAdd(false);
    notify('Category added', `"${name.trim()}" is now available when adding transactions.`);
  };

  return (
    <>
      <ScreenLayout title="Categories" showMenu>
        <View style={styles.summary}>
          <Text style={styles.sumLabel}>Spent this month</Text>
          <Text style={styles.sumValue}>{formatMoney(monthly.expense)}</Text>
        </View>

        <View style={styles.grid}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={styles.cell}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CategoryDetails', { categoryId: c.id })}
            >
              <View style={styles.circle}>
                <Ionicons name={c.icon} size={28} color="#fff" />
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.amt}>{formatMoney(spentIn(c.id))}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cell} activeOpacity={0.8} onPress={() => setShowAdd(true)}>
            <View style={[styles.circle, { backgroundColor: colors.primaryDark }]}>
              <Ionicons name="add" size={32} color="#fff" />
            </View>
            <Text style={styles.name}>More</Text>
            <Text style={styles.amt}>Add new</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>

      <Modal visible={showAdd} transparent animationType="fade" onRequestClose={() => setShowAdd(false)}>
        <View style={styles.modalBack}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>New Category</Text>
            <InputField
              label="Category name"
              placeholder="e.g. Education"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              error={error}
            />
            <PrimaryButton title="Add Category" onPress={save} />
            <PrimaryButton
              title="Cancel"
              variant="secondary"
              style={{ marginTop: 10 }}
              onPress={() => {
                setShowAdd(false);
                setError('');
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  summary: { backgroundColor: colors.primary, borderRadius: 22, padding: 18, marginBottom: 20 },
  sumLabel: { color: colors.text, opacity: 0.8, fontSize: 13 },
  sumValue: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '31%', alignItems: 'center', marginBottom: 20 },
  circle: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { marginTop: 8, fontSize: 13, fontWeight: '700', color: colors.text },
  amt: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  modalBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.bg, borderRadius: 28, padding: 22 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 14 },
});

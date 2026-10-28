import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirm,
} from '../utils/validators';
import { notify } from '../utils/dialogs';

// Rubric item 3 (part 2): Edit Profile Screen (only Customer)
export default function EditProfileScreen({ navigation }) {
  const { currentUser, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    budget: String(currentUser.budget),
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const budgetErr = !/^\d+$/.test(form.budget.trim())
      ? 'Enter a whole number (0 for no budget)'
      : Number(form.budget) > 10000000
      ? 'Budget is too large'
      : '';
    const changingPw = form.password.length > 0 || form.confirm.length > 0;
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      budget: budgetErr,
      password: changingPw ? validatePassword(form.password) : '',
      confirm: changingPw ? validateConfirm(form.password, form.confirm) : '',
    };
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const fields = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      budget: Number(form.budget),
    };
    if (changingPw) fields.password = form.password;

    const res = updateProfile(fields);
    if (!res.ok) {
      notify('Could not update profile', res.error);
      return;
    }
    notify('Profile updated', `Hi ${fields.name.split(' ')[0]}, your profile details were saved.`, () =>
      navigation.goBack()
    );
  };

  return (
    <ScreenLayout title="Edit Profile" showBack>
      <InputField label="Full Name" icon="person-outline" autoCapitalize="words" value={form.name} onChangeText={set('name')} error={errors.name} />
      <InputField label="Email" icon="mail-outline" keyboardType="email-address" value={form.email} onChangeText={set('email')} error={errors.email} />
      <InputField label="Mobile Number" icon="call-outline" keyboardType="phone-pad" maxLength={10} value={form.phone} onChangeText={set('phone')} error={errors.phone} />
      <InputField label="Monthly Budget" icon="speedometer-outline" keyboardType="number-pad" value={form.budget} onChangeText={set('budget')} error={errors.budget} />

      <Text style={styles.section}>Change password (optional)</Text>
      <InputField label="New Password" icon="lock-closed-outline" secureTextEntry placeholder="Leave blank to keep current" value={form.password} onChangeText={set('password')} error={errors.password} />
      <InputField label="Confirm New Password" icon="lock-closed-outline" secureTextEntry placeholder="Re-enter new password" value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />

      <PrimaryButton title="Update Profile" onPress={submit} style={{ marginTop: 6 }} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 8, marginBottom: 12 },
});

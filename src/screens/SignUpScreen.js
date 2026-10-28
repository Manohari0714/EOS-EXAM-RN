import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { ADMIN_CODE } from '../utils/seed';
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirm,
} from '../utils/validators';
import { notify } from '../utils/dialogs';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useApp();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', code: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    const e = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirm: validateConfirm(form.password, form.confirm),
      code: role === 'admin' && form.code !== ADMIN_CODE ? 'Invalid admin access code' : '',
    };
    setErrors(e);
    if (Object.values(e).some(Boolean)) return;

    const res = signUp({ ...form, role });
    if (!res.ok) {
      notify('Sign up failed', res.error);
      return;
    }
    notify('Account created', `Welcome ${form.name.trim().split(' ')[0]}! Please sign in to continue.`, () =>
      navigation.navigate('SignIn')
    );
  };

  return (
    <ScreenLayout title="Create Account" showBack>
      <Text style={styles.sub}>Sign up as</Text>
      <SegmentedControl
        options={[
          { key: 'customer', label: 'Customer' },
          { key: 'admin', label: 'Admin' },
        ]}
        value={role}
        onChange={setRole}
        style={{ marginBottom: 20 }}
      />

      <InputField label="Full Name" icon="person-outline" placeholder="John Doe" autoCapitalize="words" value={form.name} onChangeText={set('name')} error={errors.name} />
      <InputField label="Email" icon="mail-outline" placeholder="example@example.com" keyboardType="email-address" value={form.email} onChangeText={set('email')} error={errors.email} />
      <InputField label="Mobile Number" icon="call-outline" placeholder="10-digit number" keyboardType="phone-pad" maxLength={10} value={form.phone} onChangeText={set('phone')} error={errors.phone} />
      <InputField label="Password" icon="lock-closed-outline" placeholder="Min 6 chars, letter + number" secureTextEntry value={form.password} onChangeText={set('password')} error={errors.password} />
      <InputField label="Confirm Password" icon="lock-closed-outline" placeholder="Re-enter password" secureTextEntry value={form.confirm} onChangeText={set('confirm')} error={errors.confirm} />
      {role === 'admin' ? (
        <InputField label="Admin Access Code" icon="key-outline" placeholder="Enter admin code" value={form.code} onChangeText={set('code')} error={errors.code} />
      ) : null}

      <PrimaryButton title="Sign Up" onPress={submit} style={{ marginTop: 6 }} />

      <View style={styles.row}>
        <Text style={styles.muted}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.bold}>Sign In</Text>
        </TouchableOpacity>
      </View>
      {role === 'admin' ? <Text style={styles.hint}>Hint for examiners: admin access code is {ADMIN_CODE}</Text> : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sub: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  muted: { color: colors.textMuted },
  bold: { color: colors.primaryDark, fontWeight: '800' },
  hint: { textAlign: 'center', color: colors.textMuted, fontSize: 11, marginTop: 14 },
});

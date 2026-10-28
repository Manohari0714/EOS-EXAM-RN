import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SegmentedControl from '../components/SegmentedControl';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { validateEmail } from '../utils/validators';
import { notify } from '../utils/dialogs';

export default function LoginScreen({ navigation }) {
  const { signIn } = useApp();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = { email: validateEmail(email), password: password ? '' : 'Password is required' };
    setErrors(e);
    if (e.email || e.password) return;
    const res = signIn(email, password, role);
    if (!res.ok) notify('Sign in failed', res.error);
  };

  const fillDemo = () => {
    if (role === 'admin') {
      setEmail('admin@finance.com');
      setPassword('Admin@123');
    } else {
      setEmail('demo@finance.com');
      setPassword('Demo@123');
    }
    setErrors({});
  };

  return (
    <ScreenLayout title="Sign In" showBack>
      <Text style={styles.welcome}>Welcome Back</Text>
      <Text style={styles.sub}>Sign in as</Text>
      <SegmentedControl
        options={[
          { key: 'customer', label: 'Customer' },
          { key: 'admin', label: 'Admin' },
        ]}
        value={role}
        onChange={setRole}
        style={{ marginBottom: 20 }}
      />

      <InputField
        label="Email"
        icon="mail-outline"
        placeholder="example@example.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />
      <InputField
        label="Password"
        icon="lock-closed-outline"
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />

      <PrimaryButton title="Sign In" onPress={submit} style={{ marginTop: 6 }} />
      <TouchableOpacity onPress={fillDemo} style={styles.link}>
        <Text style={styles.linkText}>Fill demo {role} credentials</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.muted}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.bold}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  welcome: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 14 },
  sub: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  link: { alignItems: 'center', marginTop: 14 },
  linkText: { color: colors.primaryDark, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  muted: { color: colors.textMuted },
  bold: { color: colors.primaryDark, fontWeight: '800' },
});

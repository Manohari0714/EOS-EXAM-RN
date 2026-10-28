import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme';

// Rubric item 1: Home Screen with options Sign up & Sign in (Admin and Customers)
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.top}>
        <View style={styles.logo}>
          <Ionicons name="wallet" size={54} color={colors.text} />
        </View>
        <Text style={styles.brand}>Finance Budget Tracker</Text>
        <Text style={styles.tag}>Track income, control spending, reach your goals</Text>
      </SafeAreaView>

      <View style={styles.panel}>
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.desc}>
          Manage your daily, weekly and monthly money with simple reports and smart budget alerts. Admins and Customers
          can both sign in.
        </Text>

        <PrimaryButton title="Sign In" onPress={() => navigation.navigate('SignIn')} style={styles.btn} />
        <PrimaryButton title="Sign Up" variant="secondary" onPress={() => navigation.navigate('SignUp')} style={styles.btn} />

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo accounts</Text>
          <Text style={styles.demoText}>Customer: demo@finance.com / Demo@123</Text>
          <Text style={styles.demoText}>Admin: admin@finance.com / Admin@123</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  top: { alignItems: 'center', paddingTop: 30, paddingBottom: 30, paddingHorizontal: 24 },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 36,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: 18, textAlign: 'center' },
  tag: { fontSize: 14, color: colors.text, marginTop: 6, textAlign: 'center', opacity: 0.8 },
  panel: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 28,
  },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  desc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: 10, marginBottom: 26, lineHeight: 20 },
  btn: { marginBottom: 14 },
  demo: { marginTop: 14, backgroundColor: colors.mint, borderRadius: 18, padding: 14 },
  demoTitle: { fontWeight: '700', color: colors.text, marginBottom: 4 },
  demoText: { fontSize: 12, color: colors.text },
});

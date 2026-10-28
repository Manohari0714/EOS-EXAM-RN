import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { initials } from '../utils/helpers';
import { confirmDialog } from '../utils/dialogs';

export default function DrawerContent(props) {
  const { navigation } = props;
  const { currentUser, signOut } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const go = (screen) => {
    navigation.closeDrawer();
    navigation.navigate('Main', { screen });
  };

  const item = (label, icon, onPress) => (
    <DrawerItem
      label={label}
      onPress={onPress}
      icon={({ color }) => <Ionicons name={icon} size={20} color={color} />}
      labelStyle={styles.label}
      inactiveTintColor={colors.text}
    />
  );

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      <View style={styles.head}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(currentUser.name)}</Text>
        </View>
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.email}>{currentUser.email}</Text>
        <View style={styles.role}>
          <Text style={styles.roleText}>{isAdmin ? 'ADMIN' : 'CUSTOMER'}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 8, paddingTop: 10 }}>
        <DrawerItemList {...props} />
        {!isAdmin ? (
          <>
            {item('Analysis', 'bar-chart-outline', () => go('Analysis'))}
            {item('Transactions', 'swap-horizontal-outline', () => go('Transactions'))}
            {item('Categories', 'grid-outline', () => go('Categories'))}
            {item('Profile', 'person-outline', () => go('Profile'))}
            {item('Add Transaction', 'add-circle-outline', () => {
              navigation.closeDrawer();
              navigation.navigate('AddTransaction');
            })}
          </>
        ) : null}
        {item('Log Out', 'log-out-outline', () =>
          confirmDialog('Log out', 'Are you sure you want to log out?', signOut, 'Log out')
        )}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  head: { backgroundColor: colors.primary, padding: 22, paddingTop: 56, borderBottomRightRadius: 30 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: colors.text },
  name: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 12 },
  email: { fontSize: 12, color: colors.text, opacity: 0.8, marginTop: 2 },
  role: {
    alignSelf: 'flex-start',
    backgroundColor: colors.text,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 10,
  },
  roleText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  label: { fontWeight: '600', marginLeft: -8 },
});

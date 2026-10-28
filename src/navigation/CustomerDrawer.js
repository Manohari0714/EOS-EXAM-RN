import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerTabs from './CustomerTabs';
import DrawerContent from './DrawerContent';
import { colors } from '../theme';

const Drawer = createDrawerNavigator();

// DRAWER NAVIGATION (rubric Part II - iii) - wraps the bottom tabs for customers
export default function CustomerDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.text,
        drawerActiveBackgroundColor: colors.mint,
        drawerLabelStyle: { fontWeight: '600', marginLeft: -8 },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={CustomerTabs}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

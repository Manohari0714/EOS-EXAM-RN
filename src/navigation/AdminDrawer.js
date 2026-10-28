import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from './DrawerContent';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import { colors } from '../theme';

const Drawer = createDrawerNavigator();

// Admin only uses a drawer: Dashboard + Analysis (+ Log Out in the drawer content)
export default function AdminDrawer() {
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
        name="AdminHome"
        component={AdminDashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color }) => <Ionicons name="speedometer-outline" size={20} color={color} />,
        }}
      />
      <Drawer.Screen
        name="AdminAnalysis"
        component={AnalysisScreen}
        options={{
          drawerLabel: 'Analysis',
          drawerIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={20} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
}

import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DashboardScreen from '../screens/DashboardScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS = {
  Dashboard: ['home', 'home-outline'],
  Analysis: ['bar-chart', 'bar-chart-outline'],
  Transactions: ['swap-horizontal', 'swap-horizontal-outline'],
  Categories: ['grid', 'grid-outline'],
  Profile: ['person', 'person-outline'],
};

// TABS NAVIGATION (rubric Part II - ii)
export default function CustomerTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.mint,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={22} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

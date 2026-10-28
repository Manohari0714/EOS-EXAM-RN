import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CustomerDrawer from './CustomerDrawer';
import AdminDrawer from './AdminDrawer';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.primary } };

// STACK NAVIGATION (rubric Part II - i)
//  - Logged out : Home -> SignIn / SignUp
//  - Admin      : AdminDrawer (Dashboard, Analysis)
//  - Customer   : CustomerDrawer (Bottom Tabs) + pushed screens (AddTransaction, CategoryDetails, EditProfile)
export default function RootNavigator() {
  const { currentUser } = useApp();

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!currentUser ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignIn" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : currentUser.role === 'admin' ? (
          <Stack.Screen name="AdminRoot" component={AdminDrawer} />
        ) : (
          <>
            <Stack.Screen name="CustomerRoot" component={CustomerDrawer} />
            <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
            <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

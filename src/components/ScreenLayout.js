import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { colors } from '../theme';

// Shared Figma-style layout: green header on top, rounded white panel below.
export default function ScreenLayout({
  title,
  showBack,
  showMenu,
  right,
  headerExtra,
  children,
  fab,
  contentStyle,
}) {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.top}>
        <View style={styles.headerRow}>
          <View style={styles.side}>
            {showBack ? (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn} accessibilityLabel="Go back">
                <Ionicons name="arrow-back" size={22} color={colors.text} />
              </TouchableOpacity>
            ) : null}
            {showMenu ? (
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.iconBtn}
                accessibilityLabel="Open menu"
              >
                <Ionicons name="menu" size={24} color={colors.text} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
        </View>
        {headerExtra}
      </SafeAreaView>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.panel}>
          <ScrollView
            contentContainerStyle={[styles.content, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          {fab ? (
            <TouchableOpacity style={styles.fab} onPress={fab.onPress} accessibilityLabel={fab.label || 'Add'}>
              <Ionicons name={fab.icon || 'add'} size={28} color="#fff" />
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1 },
  top: { backgroundColor: colors.primary, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, minHeight: 52 },
  side: { width: 48 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '700', color: colors.text },
  panel: {
    flex: 1,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
  },
  content: { padding: 22, paddingBottom: 100 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function PrimaryButton({ title, onPress, variant = 'primary', style, disabled }) {
  const v = variants[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: v.bg, borderColor: v.border, opacity: disabled ? 0.5 : 1 }, style]}
    >
      <Text style={[styles.text, { color: v.color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const variants = {
  primary: { bg: colors.primary, color: colors.text, border: colors.primary },
  secondary: { bg: colors.mint, color: colors.text, border: colors.mint },
  outline: { bg: 'transparent', color: colors.primaryDark, border: colors.primary },
  danger: { bg: colors.danger, color: '#fff', border: colors.danger },
};

const styles = StyleSheet.create({
  btn: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 24,
  },
  text: { fontSize: 16, fontWeight: '700' },
});

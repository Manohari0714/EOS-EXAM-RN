import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function InputField({ label, error, icon, secureTextEntry, style, ...rest }) {
  const [hidden, setHidden] = useState(!!secureTextEntry);
  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, error ? styles.boxError : null]}>
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} style={{ marginRight: 8 }} /> : null}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          autoCapitalize="none"
          {...rest}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.mint,
    borderRadius: 18,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  boxError: { borderColor: colors.danger },
  input: { flex: 1, fontSize: 15, color: colors.text, height: '100%' },
  error: { color: colors.danger, fontSize: 12, marginTop: 4, marginLeft: 4 },
});

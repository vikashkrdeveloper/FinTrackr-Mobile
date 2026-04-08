import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, useColorScheme } from 'react-native';
import { TOKENS } from '../../theme/tokens';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const InputField = ({ label, error, leftIcon, ...props }: InputFieldProps) => {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.secondary }]}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        { backgroundColor: theme.surface },
        error ? { borderColor: theme.error, borderWidth: 1 } : {}
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, { color: theme.primary }]}
          placeholderTextColor={theme.secondary}
          {...props}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: TOKENS.spacing.lg,
  },
  label: {
    ...TOKENS.typography.caption,
    marginBottom: TOKENS.spacing.sm,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: TOKENS.radius.md,
    paddingHorizontal: TOKENS.spacing.lg,
    paddingVertical: 14,
  },
  leftIcon: {
    marginRight: TOKENS.spacing.sm,
  },
  input: {
    flex: 1,
    ...TOKENS.typography.body,
  },
  errorText: {
    ...TOKENS.typography.caption,
    marginTop: TOKENS.spacing.sm,
  }
});

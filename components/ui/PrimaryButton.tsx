import React from 'react';
import { Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const PrimaryButton = ({ label, onPress, disabled, loading }: ButtonProps) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary },
        (disabled || loading) && { opacity: 0.5 },
        pressed && !loading && { opacity: 0.8 }
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.background} />
      ) : (
        <Text style={[styles.label, { color: theme.background }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: TOKENS.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Ensure consistent height
  },
  label: {
    ...TOKENS.typography.body,
    fontWeight: '700',
  }
});

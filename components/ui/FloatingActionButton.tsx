import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../hooks/useAppTheme';

interface Props {
  onPress: () => void;
}

export const FloatingActionButton = ({ onPress }: Props) => {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.8 : 1 }
      ]}
    >
      <LinearGradient
        colors={theme.cardGradient as [string, string]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <MaterialCommunityIcons name="plus" size={32} color="#000000" />
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: TOKENS.spacing.xl,
    right: TOKENS.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, useColorScheme } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { TOKENS } from '../../theme/tokens';
import { InputField } from '../../components/ui/InputField';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export default function LoginScreen() {
  const router = useRouter();
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      router.replace('/(tabs)' as any);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.secondary }]}>
            Login to access your financial dashboard
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Password"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={{ marginTop: TOKENS.spacing.xl }}>
            <PrimaryButton 
              label={loading ? "Logging in..." : "Login"} 
              onPress={handleLogin} 
              disabled={loading}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ color: theme.secondary }}>Don&apos;t have an account? </Text>
          <Link href={"/(auth)/register" as any} asChild>
            <Text style={{ color: theme.accent, fontWeight: '700' }}>Register</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TOKENS.spacing.xl,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    ...TOKENS.typography.heading,
    marginBottom: TOKENS.spacing.sm,
  },
  subtitle: {
    ...TOKENS.typography.body,
  },
  form: {
    gap: TOKENS.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: TOKENS.spacing.xl,
  },
});

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, useColorScheme, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { TOKENS } from '../theme/tokens';
import { InputField } from '../components/ui/InputField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAuthStore } from '../store/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const router = useRouter();
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;
  
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() }
    });

    if (error) {
      Alert.alert('Update Error', error.message);
    } else {
      setUser(data.user);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen options={{ 
        headerShown: true, 
        title: 'Edit Profile', 
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.primary,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16 }}>
            <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
          </TouchableOpacity>
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <InputField
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <View style={{ marginTop: TOKENS.spacing.xl }}>
            <PrimaryButton 
              label={loading ? "Updating..." : "Save Changes"} 
              onPress={handleUpdate} 
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TOKENS.spacing.xl,
  },
  form: {
    gap: TOKENS.spacing.md,
  },
});

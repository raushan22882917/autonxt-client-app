import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const c = useColors();
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await signIn(username.trim(), password);
      router.replace('/(main)/dashboard');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed. Please try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: c.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoWrap, { shadowColor: c.primary }]}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: c.foreground }]}>AutoNXT Fleet</Text>
          <Text style={[styles.subtitle, { color: c.mutedForeground }]}>Fleet Management Portal</Text>
        </View>

        {/* Card */}
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <Text style={[styles.cardTitle, { color: c.foreground }]}>Sign In</Text>
          <Text style={[styles.cardSub, { color: c.mutedForeground }]}>
            Access restricted to authorized personnel
          </Text>

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: c.mutedForeground }]}>Email / Username</Text>
            <View style={[styles.inputWrap, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
              <Feather name="mail" size={16} color={c.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: c.foreground }]}
                placeholder="your@email.com"
                placeholderTextColor={c.mutedForeground}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: c.mutedForeground }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
              <Feather name="lock" size={16} color={c.mutedForeground} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: c.foreground }]}
                placeholder="••••••••"
                placeholderTextColor={c.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                activeOpacity={0.7}
              >
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={c.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: c.primary }, isLoading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.secureRow}>
            <Feather name="shield" size={13} color={c.mutedForeground} />
            <Text style={[styles.secureText, { color: c.mutedForeground }]}>Secured by AWS Cognito</Text>
          </View>
        </View>

        <Text style={[styles.accessNote, { color: c.mutedForeground }]}>
          Only registered users and admins can access this portal.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  logo: { width: 80, height: 80 },
  appName: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    gap: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  fieldWrap: { gap: 6 },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  eyeBtn: { padding: 4 },
  loginBtn: {
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  accessNote: {
    marginTop: 24,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

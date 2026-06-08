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
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
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
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;
  const cardPadding = isDesktop ? 32 : 24;

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
      style={[styles.root]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[c.primary, c.gradientEnd, c.foreground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header */}
        <View style={styles.header}>
          <View style={[styles.logoWrap, { shadowColor: c.accent }]}>
            <View style={[styles.logoInner, { backgroundColor: 'transparent' }]}>
              <Image
                source={require('../assets/images/small-logo-white.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={[styles.appName, { color: c.card }]}>AutoNxt Pvt Limited</Text>
          <View style={styles.subtitleRow}>
            <View style={[styles.divider, { backgroundColor: c.accent }]} />
            <Text style={[styles.subtitle, { color: c.card + 'DD' }]}>
              Fleet Management Portal
            </Text>
            <View style={[styles.divider, { backgroundColor: c.accent }]} />
          </View>
        </View>

        {/* Glass Card */}
        <View style={styles.cardContainer}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={20} tint="light" style={[styles.card, styles.glassCard]}>
              <View style={[styles.cardInner, { padding: cardPadding, backgroundColor: c.card + 'F2' }]}>
                <CardContent
                  c={c}
                  username={username}
                  password={password}
                  showPassword={showPassword}
                  isLoading={isLoading}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  setShowPassword={setShowPassword}
                  handleLogin={handleLogin}
                  isDesktop={isDesktop}
                />
              </View>
            </BlurView>
          ) : (
            <View style={[styles.card, { backgroundColor: c.card }]}>
              <View style={[styles.cardInner, { padding: cardPadding }]}>
                <CardContent
                  c={c}
                  username={username}
                  password={password}
                  showPassword={showPassword}
                  isLoading={isLoading}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  setShowPassword={setShowPassword}
                  handleLogin={handleLogin}
                  isDesktop={isDesktop}
                />
              </View>
            </View>
          )}
        </View>

        <Text style={[styles.accessNote, { color: c.card + 'CC' }]}>
          <Feather name="shield" size={12} color={c.card + 'CC'} /> Secured by AWS Cognito · Authorized personnel only
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function CardContent({
  c,
  username,
  password,
  showPassword,
  isLoading,
  setUsername,
  setPassword,
  setShowPassword,
  handleLogin,
  isDesktop,
}: any) {
  const headingSize = isDesktop ? 32 : 24;
  const headingLineHeight = isDesktop ? 38 : 30;

  return (
    <>
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            {
              color: c.foreground,
              fontSize: headingSize,
              lineHeight: headingLineHeight,
              paddingBottom: 2,
            },
          ]}
        >
          Welcome Back
        </Text>
        <Text style={[styles.cardSub, { color: c.mutedForeground }]}>
          Sign in to manage your fleet
        </Text>
      </View>

      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: c.mutedForeground }]}>Email Address</Text>
        <View style={[styles.inputWrap, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Feather name="mail" size={18} color={c.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: c.foreground }]}
            placeholder="your@email.com"
            placeholderTextColor={c.mutedForeground + '88'}
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
          <Feather name="lock" size={18} color={c.primary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: c.foreground }]}
            placeholder="••••••••••"
            placeholderTextColor={c.mutedForeground + '88'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
            activeOpacity={0.6}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={c.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.loginBtn,
          { backgroundColor: c.primary, shadowColor: c.primary },
          isLoading && styles.loginBtnDisabled,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color={c.primaryForeground} />
        ) : (
          <>
            <Text style={[styles.loginBtnText, { color: c.primaryForeground }]}>
              Sign In to Fleet
            </Text>
            <Feather name="arrow-right" size={20} color={c.primaryForeground} />
          </>
        )}
      </TouchableOpacity>
    </>
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
    marginBottom: 40,
  },
  logoWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: 100, height: 100 },
  appName: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    width: 30,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
  },
  glassCard: {
    backgroundColor: 'transparent',
  },
  cardInner: {
    padding: 28,
    gap: 20,
    borderRadius: 24,
  },
  cardHeader: {
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  cardSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  fieldWrap: { gap: 8 },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 54,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },
  loginBtn: {
    borderRadius: 14,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  accessNote: {
    marginTop: 28,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});

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
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

// ── Geometric background decoration ──────────────────────────────────────────
function GeometricOverlay() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Top-right large circle */}
      <View style={[geo.circle, geo.topRight]} />
      {/* Bottom-left medium circle */}
      <View style={[geo.circle, geo.bottomLeft]} />
      {/* Top-left small accent dot */}
      <View style={geo.accentDot} />
      {/* Bottom-right accent line */}
      <View style={geo.accentLine} />
      {/* Center cross-hatch grid lines */}
      <View style={geo.gridH} />
      <View style={geo.gridV} />
    </View>
  );
}

const geo = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#D7322015',
  },
  topRight: {
    width: 320,
    height: 320,
    top: -100,
    right: -80,
    backgroundColor: '#D7322008',
  },
  bottomLeft: {
    width: 220,
    height: 220,
    bottom: -60,
    left: -60,
    backgroundColor: '#0B78B308',
    borderColor: '#0B78B315',
  },
  accentDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D7322040',
    top: 80,
    left: 32,
  },
  accentLine: {
    position: 'absolute',
    width: 60,
    height: 2,
    backgroundColor: '#0B78B330',
    bottom: 120,
    right: 32,
    borderRadius: 1,
  },
  gridH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    height: 1,
    backgroundColor: '#0F172A06',
  },
  gridV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '30%',
    width: 1,
    backgroundColor: '#0F172A06',
  },
});

// ─────────────────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const c = useColors();
  const { signIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 768;
  const cardPadding = isDesktop ? 36 : 28;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = React.useRef<TextInput>(null);

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
      // JSON.stringify(Error) always produces {} — log message explicitly
      const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
      console.error('Login error:', errMsg);
      const msg =
        e instanceof Error
          ? e.message
          : 'Login failed. Please check your credentials and try again.';
      Alert.alert('Login Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: '#FFFFFF' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* White base + geometric overlay */}
      <GeometricOverlay />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand header ── */}
        <View style={styles.header}>
          {/* Logo container — Bold Red */}
          <View style={[styles.logoWrap, { backgroundColor: '#D73220', shadowColor: '#D73220' }]}>
            <Image
              source={require('../assets/images/small-logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={[styles.appName, { color: '#0F172A' }]}>AutoNxt Pvt Limited</Text>

          <View style={styles.subtitleRow}>
            <View style={[styles.divider, { backgroundColor: '#0B78B3' }]} />
            <Text style={[styles.subtitle, { color: '#0B78B3' }]}>
              Fleet Management Portal
            </Text>
            <View style={[styles.divider, { backgroundColor: '#0B78B3' }]} />
          </View>
        </View>

        {/* ── Login card ── */}
        <View style={styles.cardContainer}>
          {Platform.OS === 'ios' ? (
            <BlurView intensity={0} tint="light" style={[styles.card, { borderColor: '#E2E8F0' }]}>
              <View style={[styles.cardInner, { padding: cardPadding, backgroundColor: '#FFFFFF' }]}>
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
                  passwordRef={passwordRef}
                />
              </View>
            </BlurView>
          ) : (
            <View style={[styles.card, { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' }]}>
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
                  passwordRef={passwordRef}
                />
              </View>
            </View>
          )}
        </View>

        {/* ── Footer note ── */}
        <View style={styles.footerRow}>
          <Feather name="shield" size={12} color="#0B78B3" />
          <Text style={[styles.accessNote, { color: '#94A3B8' }]}>
            Secured by AWS Cognito · Authorized personnel only
          </Text>
        </View>
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
  passwordRef,
}: any) {
  const headingSize = isDesktop ? 32 : 26;
  const headingLineHeight = isDesktop ? 38 : 32;

  return (
    <>
      {/* Card heading */}
      <View style={styles.cardHeader}>
        <Text
          style={[
            styles.cardTitle,
            { color: '#0F172A', fontSize: headingSize, lineHeight: headingLineHeight },
          ]}
        >
          Welcome Back
        </Text>
        <Text style={[styles.cardSub, { color: '#64748B' }]}>
          Sign in to manage your fleet
        </Text>
      </View>

      {/* Email */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: '#0F172A' }]}>Email Address</Text>
        <View style={[styles.inputWrap, { backgroundColor: '#F2F3F8', borderColor: '#E2E8F0' }]}>
          <Feather name="mail" size={18} color="#0B78B3" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: '#0F172A' }]}
            placeholder="your@email.com"
            placeholderTextColor="#94A3B8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            testID="emailInput"
            autoComplete="off"
            importantForAutofill="no"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        </View>
      </View>

      {/* Password */}
      <View style={styles.fieldWrap}>
        <Text style={[styles.label, { color: '#0F172A' }]}>Password</Text>
        <View style={[styles.inputWrap, { backgroundColor: '#F2F3F8', borderColor: '#E2E8F0' }]}>
          <Feather name="lock" size={18} color="#0B78B3" style={styles.inputIcon} />
          <TextInput
            ref={passwordRef}
            style={[styles.input, { color: '#0F172A' }]}
            placeholder="••••••••••"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            testID="passwordInput"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
            testID="togglePasswordVisibility"
            activeOpacity={0.6}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign In button — Bold Red */}
      <TouchableOpacity
        style={[
          styles.loginBtn,
          { backgroundColor: '#D73220', shadowColor: '#D73220' },
          isLoading && styles.loginBtnDisabled,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
        activeOpacity={0.85}
        testID="signInButton"
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.loginBtnText}>Sign In to Fleet</Text>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
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

  // ── Header ──
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoWrap: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: { width: 60, height: 60 },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    height: 1,
    width: 28,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  // ── Card ──
  cardContainer: {
    width: '100%',
    maxWidth: 420,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  cardInner: {
    gap: 20,
  },
  cardHeader: {
    gap: 6,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
  },
  cardSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },

  // ── Fields ──
  fieldWrap: { gap: 8 },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.3,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  eyeBtn: { padding: 4 },

  // ── Button ──
  loginBtn: {
    borderRadius: 12,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 14,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.6 },
  loginBtnText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },

  // ── Footer ──
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  accessNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});

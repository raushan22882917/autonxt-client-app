// src/features/auth/ui/CustomSignIn.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import {
  confirmResetPassword,
  resetPassword,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import Loader from '../../../components/Loader';
import colors from '../../../constants/colors';
import { useAuth } from '@/context/AuthContext';

const SMALL_LOGO_BLACK = require('../../../assets/images/small-logo-black.png');
const C = colors.light;
const TEXT_MUTED_LIGHT = '#64748B';
const ICON_COLOR = '#7E152F'; // Burgundy icon color

type AuthMode = 'signIn' | 'forgotPassword' | 'confirmReset';

export type CustomSignInProps = {
  onBack: () => void;
  onSuccess: () => void | Promise<void>;
};

function getAuthErrorMessage(error: unknown, fallback: string): string {
  const err = error as { name?: string; message?: string };
  if (err.name === 'UserNotFoundException') {
    return 'No account found with this email address.';
  }
  if (err.name === 'InvalidPasswordException') {
    return 'Password does not meet requirements. Use at least 8 characters with uppercase, lowercase, number, and symbol.';
  }
  if (err.name === 'CodeMismatchException') {
    return 'Invalid verification code. Please try again.';
  }
  if (err.name === 'ExpiredCodeException') {
    return 'Verification code has expired. Please request a new code.';
  }
  if (err.name === 'LimitExceededException') {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (err.message) {
    return err.message;
  }
  return fallback;
}

export function CustomSignIn({ onBack, onSuccess }: CustomSignInProps) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [codeDestination, setCodeDestination] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Clear any stale Amplify session
      try {
        await amplifySignOut({ global: false });
      } catch {
        // No active session or sign-out failed
      }

      // Step 2: Sign in via AuthContext
      await signIn(email.trim(), password);

      // Step 3: Success callback
      await onSuccess();
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      const msg = getAuthErrorMessage(error, 'Failed to sign in. Please try again.');
      Alert.alert('Sign In Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordPress = () => {
    setAuthMode('forgotPassword');
  };

  const handleSendResetCode = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      setIsLoading(true);
      const output = await resetPassword({ username: trimmedEmail });
      const destination = output.nextStep.codeDeliveryDetails?.destination ?? trimmedEmail;
      setCodeDestination(destination);
      setAuthMode('confirmReset');
      Alert.alert(
        'Check your email',
        `A verification code was sent to ${destination}. If you don't receive it in your inbox, please check your spam folder for the OTP.`
      );
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      Alert.alert(
        'Reset Password Error',
        getAuthErrorMessage(error, 'Failed to send reset code. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResetPassword = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !resetCode.trim()) {
      Alert.alert('Error', 'Please enter your email and verification code.');
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      await confirmResetPassword({
        username: trimmedEmail,
        confirmationCode: resetCode.trim(),
        newPassword,
      });
      Alert.alert(
        'Password Reset',
        'Your password has been updated. Please sign in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => {
              setAuthMode('signIn');
              setPassword('');
              setResetCode('');
              setNewPassword('');
              setConfirmNewPassword('');
            },
          },
        ]
      );
    } catch (error: unknown) {
      console.error('Confirm reset password error:', error);
      Alert.alert(
        'Reset Password Error',
        getAuthErrorMessage(error, 'Failed to reset password. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (authMode === 'signIn') {
      onBack();
      return;
    }
    setAuthMode('signIn');
    setResetCode('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  useEffect(() => {
    const onBackPress = () => {
      handleBackPress();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [authMode, onBack]);

  const renderInput = (
    label: string,
    icon: keyof typeof Ionicons.glyphMap,
    input: React.ReactNode,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color={ICON_COLOR} style={styles.inputIcon} />
        {input}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 50 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: '#7E152F' }}
          >
            {/* Absolute Background Graphics */}
            <View style={styles.absoluteBackground}>
              <LinearGradient
                colors={['#FEFDFD', '#F5ECEE']}
                style={{ height: 510 }}
              />
              <View style={{ height: 120 }}>
                <Svg
                  height="120"
                  width="100%"
                  viewBox="0 0 375 120"
                  preserveAspectRatio="none"
                >
                  <Path
                    d="M0,0 L375,0 L375,40 Q187.5,110 0,40 Z"
                    fill="#F5ECEE"
                  />
                  <Path
                    d="M0,40 Q187.5,110 375,40"
                    stroke="#E2A93E"
                    strokeWidth={3}
                    fill="none"
                  />
                </Svg>
              </View>
            </View>

            {/* Foreground Content */}
            <View style={styles.container}>
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#7E152F" />
              </TouchableOpacity>

              {/* Header section (Centered logo inside oval) */}
              <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoRowContainer}>
                    <Image
                      source={SMALL_LOGO_BLACK}
                      style={styles.smallLogo}
                      resizeMode="contain"
                    />
                    <View style={styles.logoTextContainer}>
                      <Text style={styles.logoTextBrand}>AutoNXT</Text>
                      <View style={styles.logoTextDivider} />
                      <Text style={styles.logoTextSub}>AUTOMATION</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Titles outside the card */}
              {authMode === 'signIn' && (
                <>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Sign in to your AutoNXT account</Text>
                </>
              )}

              {authMode === 'forgotPassword' && (
                <>
                  <Text style={styles.title}>Forgot Password</Text>
                  <Text style={styles.subtitle}>
                    Enter your email and we will send you a verification code.
                  </Text>
                </>
              )}

              {authMode === 'confirmReset' && (
                <>
                  <Text style={styles.title}>Reset Password</Text>
                  <Text style={styles.subtitle}>
                    Enter the verification code sent to {codeDestination || email}.
                  </Text>
                </>
              )}

              {/* Form Card */}
              <View style={styles.card}>
                {authMode === 'signIn' && (
                  <>
                    {renderInput(
                      'Email',
                      'mail-outline',
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={TEXT_MUTED_LIGHT}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />,
                    )}

                    {renderInput(
                      'Password',
                      'lock-closed-outline',
                      <>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Enter your password"
                          placeholderTextColor={TEXT_MUTED_LIGHT}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                          <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={TEXT_MUTED_LIGHT}
                          />
                        </TouchableOpacity>
                      </>,
                    )}

                    {/* Sign In Button */}
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={isLoading}>
                      {isLoading ? (
                        <Loader size={20} color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.signInButtonText}>Sign In</Text>
                          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                        </>
                      )}
                    </TouchableOpacity>

                    {/* Forgot Password Link */}
                    <View style={styles.forgotPasswordContainer}>
                      <TouchableOpacity onPress={handleForgotPasswordPress}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {authMode === 'forgotPassword' && (
                  <>
                    {renderInput(
                      'Email',
                      'mail-outline',
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={TEXT_MUTED_LIGHT}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />,
                    )}

                    <TouchableOpacity style={styles.signInButton} onPress={handleSendResetCode} disabled={isLoading}>
                      {isLoading ? (
                        <Loader size={20} color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.signInButtonText}>Send Reset Code</Text>
                          <Ionicons name="mail-outline" size={18} color="#FFFFFF" />
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={() => setAuthMode('signIn')}>
                      <Text style={styles.linkText}>Back to Sign In</Text>
                    </TouchableOpacity>
                  </>
                )}

                {authMode === 'confirmReset' && (
                  <>
                    {renderInput(
                      'Verification Code',
                      'key-outline',
                      <TextInput
                        style={styles.input}
                        placeholder="Enter verification code"
                        placeholderTextColor={TEXT_MUTED_LIGHT}
                        value={resetCode}
                        onChangeText={setResetCode}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />,
                    )}

                    {renderInput(
                      'New Password',
                      'lock-closed-outline',
                      <>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Enter new password"
                          placeholderTextColor={TEXT_MUTED_LIGHT}
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry={!showNewPassword}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                          <Ionicons
                            name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={TEXT_MUTED_LIGHT}
                          />
                        </TouchableOpacity>
                      </>,
                    )}

                    {renderInput(
                      'Confirm Password',
                      'lock-closed-outline',
                      <>
                        <TextInput
                          style={[styles.input, { flex: 1 }]}
                          placeholder="Confirm new password"
                          placeholderTextColor={TEXT_MUTED_LIGHT}
                          value={confirmNewPassword}
                          onChangeText={setConfirmNewPassword}
                          secureTextEntry={!showConfirmNewPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          style={styles.eyeIcon}
                        >
                          <Ionicons
                            name={showConfirmNewPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={TEXT_MUTED_LIGHT}
                          />
                        </TouchableOpacity>
                      </>,
                    )}

                    <TouchableOpacity style={styles.signInButton} onPress={handleConfirmResetPassword} disabled={isLoading}>
                      {isLoading ? (
                        <Loader size={20} color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.signInButtonText}>Reset Password</Text>
                          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.linkButton} onPress={handleSendResetCode} disabled={isLoading}>
                      <Text style={styles.linkText}>Resend Code</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              {/* Bottom Feature Badges */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureColumn}>
                  <Ionicons name="shield-checkmark-outline" size={26} color="#E2A93E" />
                  <Text style={styles.featureTitle}>Secure</Text>
                  <Text style={styles.featureSubtitle}>Bank-grade security</Text>
                </View>

                <View style={styles.featureDivider} />

                <View style={styles.featureColumn}>
                  <Ionicons name="people-outline" size={26} color="#E2A93E" />
                  <Text style={styles.featureTitle}>Trusted</Text>
                  <Text style={styles.featureSubtitle}>By 1000+ partners</Text>
                </View>

                <View style={styles.featureDivider} />

                <View style={styles.featureColumn}>
                  <Ionicons name="flash-outline" size={26} color="#E2A93E" />
                  <Text style={styles.featureTitle}>Fast</Text>
                  <Text style={styles.featureSubtitle}>Built for performance</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#7E152F',
  },
  safe: {
    flex: 1,
    backgroundColor: '#FEFDFD',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  absoluteBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#7E152F',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 14,
    paddingTop: 6,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallLogo: {
    width: 100,
    height: 100,
    marginRight: 6,
  },
  logoTextContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoTextBrand: {
    fontSize: 38,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontWeight: '700',
    color: '#7E152F',
    letterSpacing: 0.5,
    lineHeight: 40,
  },
  logoTextDivider: {
    height: 1.5,
    backgroundColor: '#7E152F',
    alignSelf: 'stretch',
    marginVertical: 4,
  },
  logoTextSub: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#E2A93E',
    letterSpacing: 4,
  },
  card: {
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#0F172A',
    height: '100%',
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#7E152F',
  },
  signInButton: {
    backgroundColor: '#7E152F',
    borderRadius: 26,
    height: 52,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#7E152F',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
    width: '100%',
  },
  featureColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  featureDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#E2A93E',
    marginTop: 8,
    marginBottom: 6,
  },
  featureSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16, // Added spacing below the subtitle text
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});


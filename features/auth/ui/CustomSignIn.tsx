// src/features/auth/ui/CustomSignIn.tsx

import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import {
  confirmResetPassword,
  resetPassword,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import Loader from '../../../components/Loader';
import colors from '../../../constants/colors';
import { useAuth } from '@/context/AuthContext';

const TRUST_LOGO = require('../../../assets/images/trust-logo.png');
const C = colors.light;
const TEXT_MUTED_LIGHT = '#64748B';
const ICON_COLOR = '#64748B';

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

const WaveSvg = ({ color }: { color: string }) => {
  return (
    <View style={styles.waveContainer}>
      <Svg
        height="80"
        width="100%"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={styles.waveSvg}
      >
        {/* Soft shadow curve path cast onto the card */}
        <Path
          fill="rgba(18, 14, 16, 0.2)"
          d="M0,164 C320,304 960,84 1440,224 L1440,320 L0,320 Z"
        />
        {/* Main Burgundy curve path */}
        <Path
          fill={color}
          d="M0,160 C320,300 960,80 1440,220 L1440,320 L0,320 Z"
        />
        {/* 3D Rolled Edge Highlight (light reflection) */}
        <Path
          stroke="rgba(255, 255, 255, 0.35)"
          strokeWidth="6"
          fill="none"
          d="M0,161 C320,301 960,81 1440,221"
        />
        {/* 3D Rolled Edge Shadow (crease shadow) */}
        <Path
          stroke="rgba(18, 14, 16, 0.15)"
          strokeWidth="3"
          fill="none"
          d="M0,163 C320,303 960,83 1440,223"
        />
      </Svg>
    </View>
  );
};

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
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Top Light Area Container */}
            <View style={styles.topArea}>
              {/* Back Button and Circular Image */}
              <View style={styles.topSection}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  accessibilityLabel="Go back"
                  accessibilityRole="button"
                >
                  <Ionicons name="arrow-back" size={24} color={C.primary} />
                </TouchableOpacity>

                <View style={styles.circularImageContainer}>
                  <Image
                    source={TRUST_LOGO}
                    style={styles.circularImage}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Form Content wrapped in Card */}
              <View style={styles.card}>
                {authMode === 'signIn' && (
                  <>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your AutoNXT account</Text>

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
                  </>
                )}

                {authMode === 'forgotPassword' && (
                  <>
                    <Text style={styles.title}>Forgot Password</Text>
                    <Text style={styles.subtitle}>
                      Enter your email and we will send you a verification code. If you don't receive it in your inbox, check your spam folder for the OTP.
                    </Text>

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
                  </>
                )}

                {authMode === 'confirmReset' && (
                  <>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                      Enter the verification code sent to {codeDestination || email}. If you don't see it in your inbox, check your spam folder for the OTP.
                    </Text>

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
                  </>
                )}
              </View>
            </View>

            {/* Wave Transition SVG */}
            <WaveSvg color={C.primary} />

            {/* Bottom Dark Area Container */}
            <View style={[styles.bottomArea, { backgroundColor: C.primary, paddingBottom: insets.bottom + 102 }]}>
              {authMode === 'signIn' && (
                <>
                  <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} color={C.primary} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={20} color={C.primary} />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.linkButton} onPress={handleForgotPasswordPress}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </>
              )}

              {authMode === 'forgotPassword' && (
                <>
                  <TouchableOpacity style={styles.primaryButton} onPress={handleSendResetCode} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} color={C.primary} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Send Reset Code</Text>
                        <Ionicons name="mail-outline" size={20} color={C.primary} />
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
                  <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmResetPassword} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} color={C.primary} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Reset Password</Text>
                        <Ionicons name="checkmark" size={20} color={C.primary} />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.linkButton} onPress={handleSendResetCode} disabled={isLoading}>
                    <Text style={styles.linkText}>Resend Code</Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: '#F5F6F8',
  },
  safe: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F5F6F8',
  },
  topArea: {
    backgroundColor: '#F5F6F8',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 50,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  circularImageContainer: {
    width: 120,
    height: 120,
  },
  circularImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 80,
    width: '100%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: -60,
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    marginBottom: 6,
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    flex: 1,
    color: '#0F172A',
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  waveContainer: {
    width: '100%',
    height: 80,
    backgroundColor: 'transparent',
    marginBottom: -1,
    zIndex: 2,
  },
  waveSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  bottomArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 14,
    borderRadius: 24,
    gap: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#7E152F',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  linkButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

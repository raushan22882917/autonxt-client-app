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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  confirmResetPassword,
  fetchAuthSession,
  resetPassword,
  signIn,
} from 'aws-amplify/auth';
import Loader from '../../../components/Loader';
import colors from '../../../constants/colors';

const LOGO = require('../../../assets/images/small-logo-white.png');
const C = colors.light;
const BRAND = C.primary;
const WELCOME_DARK = '#1a0a0a';
const TEXT_MUTED = 'rgba(255,255,255,0.65)';
const INPUT_BG = 'rgba(255,255,255,0.08)';
const INPUT_BORDER = 'rgba(255,255,255,0.22)';

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
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await signIn({
        username: email,
        password: password,
      });

      const session = await fetchAuthSession();
      if (session.tokens?.accessToken) {
        await onSuccess();
      } else {
        throw new Error('Failed to establish session');
      }
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      const err = error as { name?: string; message?: string };
      let errorMessage = 'Failed to sign in. Please try again.';

      if (err.name === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your email address before signing in.';
      } else if (err.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password.';
      } else if (err.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      Alert.alert('Sign In Error', errorMessage);
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
        <Ionicons name={icon} size={20} color={TEXT_MUTED} style={styles.inputIcon} />
        {input}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <Image
        source={require('../../../assets/images/splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={[
          'rgba(0,0,0,0.55)',
          'rgba(0,0,0,0.45)',
          'rgba(0,0,0,0.75)',
          'rgba(0,0,0,0.95)',
        ]}
        locations={[0, 0.25, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.formContainer}>
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
                      placeholderTextColor={TEXT_MUTED}
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
                        placeholderTextColor={TEXT_MUTED}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={TEXT_MUTED}
                        />
                      </TouchableOpacity>
                    </>,
                  )}

                  <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Sign In</Text>
                        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
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
                      placeholderTextColor={TEXT_MUTED}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />,
                  )}

                  <TouchableOpacity style={styles.primaryButton} onPress={handleSendResetCode} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Send Reset Code</Text>
                        <Ionicons name="mail-outline" size={20} color="#ffffff" />
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
                      placeholderTextColor={TEXT_MUTED}
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
                        placeholderTextColor={TEXT_MUTED}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                      />
                      <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                        <Ionicons
                          name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color={TEXT_MUTED}
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
                        placeholderTextColor={TEXT_MUTED}
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
                          color={TEXT_MUTED}
                        />
                      </TouchableOpacity>
                    </>,
                  )}

                  <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmResetPassword} disabled={isLoading}>
                    {isLoading ? (
                      <Loader size={20} />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>Reset Password</Text>
                        <Ionicons name="checkmark" size={20} color="#ffffff" />
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
    backgroundColor: WELCOME_DARK,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    top: -80,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 8,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  logo: {
    width: 220,
    height: 52,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
    textAlign: 'center',
    color: TEXT_MUTED,
  },
  inputContainer: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#ffffff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: INPUT_BG,
    borderColor: INPUT_BORDER,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    flex: 1,
    color: '#ffffff',
  },
  eyeIcon: {
    padding: 4,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 8,
    gap: 10,
    backgroundColor: BRAND,
    shadowColor: BRAND,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  linkButton: {
    alignSelf: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND,
  },
});

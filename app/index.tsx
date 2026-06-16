import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const c = useColors();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-20)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const sloganTranslateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // If user is already logged in, redirect immediately to dashboard
    if (!isLoading && user) {
      router.replace('/(main)/dashboard');
      return;
    }

    // Run welcome animations
    if (!isLoading && !user) {
      Animated.stagger(250, [
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(logoTranslateY, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(sloganOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(sloganTranslateX, {
            toValue: 0,
            friction: 6,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <View style={styles.container} />
    );
  }

  // Prevent flash of screen if user is logged in
  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/LaunchPage.png')}
        style={styles.backgroundImage}
        resizeMode="contain"
      />

      {/* Screen Overlay Content */}
      <View
        style={[
          styles.overlay,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          },
        ]}
      >
        {/* Top Section: Brand Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ translateY: logoTranslateY }],
            },
          ]}
        >
          <Image
            source={require('../assets/images/hero-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoTextMain}>
            Auto<Text style={{ color: c.primary }}>Nxt</Text>
          </Text>
          <Text style={styles.logoTextSub}>FLEET</Text>
        </Animated.View>

        {/* Slogan Text (positioned at the top, directly under the logo) */}
        <Animated.Text
          style={[
            styles.sloganText,
            {
              opacity: sloganOpacity,
              transform: [{ translateX: sloganTranslateX }],
            },
          ]}
        >
          Revolutionizing Your Ride,{"\n"}
          One <Text style={{ color: c.primary }}>Smart Vehicle</Text>{"\n"}
          at a Time.
        </Animated.Text>

        {/* Spacer to push button to the bottom */}
        <View style={{ flex: 1 }} />

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            styles.signInButton,
            {
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.45)',
              shadowColor: '#120E10',
            },
          ]}
          activeOpacity={0.8}
          onPress={() => router.push('/login')}
        >
          <Text style={[styles.signInButtonText, { color: c.primaryForeground }]}>Start Now</Text>
          <Feather name="arrow-right" size={18} color={c.primaryForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },
  backgroundImage: {
    position: 'absolute',
    bottom: -12,
    width: '100%',
    height: screenHeight * 0.65 + 60,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop: -84,
  },
  logoImage: {
    width: 284,
    height: 284,
    borderRadius: 142,
    overflow: 'hidden',
  },
  logoTextMain: {
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
    marginTop: -62,
    textAlign: 'center',
  },
  logoTextSub: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    fontWeight: '800',
    color: '#7E152F', // Brand red
    letterSpacing: 4,
    marginTop: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  sloganText: {
    width: '100%',
    fontSize: 19,
    fontFamily: 'Inter_700Bold',
    color: '#1E293B',
    lineHeight: 26,
    letterSpacing: -0.2,
    textAlign: 'left',
    marginTop: -1,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1.2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
});

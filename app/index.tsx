import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function SplashScreen() {
  const c = useColors();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const decorOpacity = useRef(new Animated.Value(0)).current;
  const decorScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 55,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(decorScale, {
          toValue: 1,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(decorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(main)/dashboard');
      } else {
        router.replace('/login');
      }
    }, 2400);
    return () => clearTimeout(timer);
  }, [isLoading, user, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[c.primary, c.gradientEnd, '#060E24']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative radial glow behind logo */}
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: decorOpacity,
            transform: [{ scale: decorScale }],
            backgroundColor: c.primary + '40',
          },
        ]}
      />

      <Animated.View
        style={[
          styles.logoWrap,
          {
            shadowColor: c.accent,
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={[styles.logoRing, { borderColor: c.card + '30' }]}>
          <View style={[styles.logoInner, { backgroundColor: c.card }]}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.appName, { color: c.card, opacity: textOpacity }]}>
        AutoNXT Fleet
      </Animated.Text>

      <Animated.View
        style={[styles.taglineRow, { opacity: taglineOpacity }]}
      >
        <View style={[styles.taglineDot, { backgroundColor: c.accent }]} />
        <Text style={[styles.tagline, { color: c.card + 'BB' }]}>
          Smart Fleet · Total Control
        </Text>
        <View style={[styles.taglineDot, { backgroundColor: c.accent }]} />
      </Animated.View>

      {/* Loading indicator dots */}
      <Animated.View style={[styles.dotsRow, { opacity: taglineOpacity }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, { backgroundColor: c.card + '55' }]} />
        ))}
      </Animated.View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: c.card + '66' }]}>
          Powered by AutoNXT Technology
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    top: '50%',
    left: '50%',
    marginTop: -180,
    marginLeft: -130,
  },
  logoWrap: {
    marginBottom: 28,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 16,
  },
  logoRing: {
    width: 140,
    height: 140,
    borderRadius: 38,
    borderWidth: 1.5,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 114,
    height: 114,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 114,
    height: 114,
  },
  appName: {
    fontSize: 36,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
    marginBottom: 14,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 36,
  },
  taglineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 52,
  },
  footerText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
});

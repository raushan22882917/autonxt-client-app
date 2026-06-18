import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LoadingRing } from '@/components/LoadingRing';
import { useColors } from '@/hooks/useColors';

const companyLogo = require('../assets/images/small-logo-black.png');

export interface FleetLoaderProps {
  visible: boolean;
  title?: string;
  message?: string;
  /** 0–1 progress for an optional bar (e.g. plants loaded). */
  progress?: number;
  progressLabel?: string;
  /** Inline card (no modal) for tabs and detail sections. */
  inline?: boolean;
}

export function FleetLoader({
  visible,
  title = 'Loading fleet',
  message = 'Please wait…',
  progress,
  progressLabel,
  inline = false,
}: FleetLoaderProps) {
  const c = useColors();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => {
      pulseLoop.stop();
      pulse.setValue(0);
    };
  }, [visible, pulse]);

  const logoScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const clampedProgress =
    progress !== undefined ? Math.min(1, Math.max(0, progress)) : undefined;

  if (!visible) return null;

  const card = (
        <View style={[styles.card, inline && styles.cardInline, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadowStrong }]}>
          <View style={styles.spinnerWrap}>
            <LoadingRing size="lg" color={c.primary} dual />
            <Animated.View style={[styles.logoWrap, { transform: [{ scale: logoScale }] }]}>
              <Image source={companyLogo} style={styles.logo} resizeMode="contain" />
            </Animated.View>
          </View>

          <Text style={[styles.title, { color: c.foreground }]}>{title}</Text>
          <Text style={[styles.message, { color: c.mutedForeground }]}>{message}</Text>

          {clampedProgress !== undefined ? (
            <View style={styles.progressBlock}>
              <View style={[styles.track, { backgroundColor: c.track }]}>
                <View
                  style={[
                    styles.fill,
                    { backgroundColor: c.primary, width: `${clampedProgress * 100}%` },
                  ]}
                />
              </View>
              {progressLabel ? (
                <Text style={[styles.progressLabel, { color: c.mutedForeground }]}>
                  {progressLabel}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.dotsRow}>
            {[0, 1, 2].map(i => (
              <LoadingDot key={i} delay={i * 180} color={c.primary} />
            ))}
          </View>
        </View>
  );

  if (inline) return card;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={[styles.backdrop, { backgroundColor: c.background + 'F2' }]}>{card}</View>
    </Modal>
  );
}

function LoadingDot({ delay, color }: { delay: number; color: string }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, opacity]);

  return <Animated.View style={[styles.dot, { backgroundColor: color, opacity }]} />;
}

/** Slim non-blocking bar while more plants load in the background. */
export function FleetLoadingBar({
  visible,
  loaded,
  total,
}: {
  visible: boolean;
  loaded: number;
  total: number;
}) {
  const c = useColors();
  const widthAnim = useRef(new Animated.Value(0)).current;

  const ratio = total > 0 ? loaded / total : 0;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: ratio,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [ratio, widthAnim]);

  if (!visible || total <= 0) return null;

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.barWrap, { backgroundColor: c.card, borderBottomColor: c.border }]}>
      <Animated.View style={[styles.barFill, { backgroundColor: c.primary, width: barWidth }]} />
      <Text style={[styles.barText, { color: c.mutedForeground }]}>
        Syncing plants {loaded} of {total}…
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  cardInline: {
    maxWidth: undefined,
    width: '100%',
    paddingVertical: 28,
  },
  cardModal: {
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 26,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 36,
    elevation: 8,
  },
  spinnerWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoWrap: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    minHeight: 40,
  },
  progressBlock: {
    width: '100%',
    gap: 6,
    marginTop: 8,
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  barWrap: {
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
  },
  barText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    paddingVertical: 6,
  },
});

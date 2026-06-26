import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

export type LoadingRingSize = 'sm' | 'md' | 'lg';

const DIMENSIONS: Record<LoadingRingSize, number> = {
  sm: 22,
  md: 36,
  lg: 58,
};

const STROKES: Record<LoadingRingSize, number> = {
  sm: 2.5,
  md: 3,
  lg: 3.5,
};

const SPEEDS: Record<LoadingRingSize, number> = {
  sm: 900,
  md: 1000,
  lg: 1100,
};

interface Props {
  size?: LoadingRingSize | number;
  color?: string;
  style?: ViewStyle;
  /** Counter-rotating inner ring */
  dual?: boolean;
}

export function LoadingRing({ size = 'md', color, style, dual = false }: Props) {
  const c = useColors();
  const tint = color || c.primary;
  const isNumeric = typeof size === 'number';
  const dim = isNumeric ? size : DIMENSIONS[size];
  const stroke = isNumeric ? 3 : STROKES[size as LoadingRingSize];
  const speed = isNumeric ? 1000 : SPEEDS[size as LoadingRingSize];

  const spin = useRef(new Animated.Value(0)).current;
  const spinRev = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const outer = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    outer.start();

    let inner: Animated.CompositeAnimation | undefined;
    if (dual) {
      inner = Animated.loop(
        Animated.timing(spinRev, {
          toValue: 1,
          duration: speed * 1.6,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      inner.start();
    }

    return () => {
      outer.stop();
      inner?.stop();
      spin.setValue(0);
      spinRev.setValue(0);
    };
  }, [dual, spin, spinRev, speed]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotateRev = spinRev.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });

  const innerDim = dim * 0.6;
  const innerStroke = stroke - 0.5;

  return (
    <View style={[{ width: dim, height: dim }, styles.wrap, style]}>
      {/* Outer track */}
      <View
        style={{
          position: 'absolute',
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderWidth: stroke,
          borderColor: c.border,
        }}
      />
      {/* Outer spinner */}
      <Animated.View
        style={{
          position: 'absolute',
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          borderWidth: stroke,
          borderTopColor: tint,
          borderRightColor: tint + '55',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent',
          transform: [{ rotate }],
        }}
      />

      {dual ? (
        <>
          {/* Inner track */}
          <View
            style={{
              width: innerDim,
              height: innerDim,
              borderRadius: innerDim / 2,
              borderWidth: innerStroke,
              borderColor: c.border,
            }}
          />
          {/* Inner spinner */}
          <Animated.View
            style={{
              position: 'absolute',
              width: innerDim,
              height: innerDim,
              borderRadius: innerDim / 2,
              borderWidth: innerStroke,
              borderTopColor: tint + 'BB',
              borderRightColor: 'transparent',
              borderBottomColor: tint + '33',
              borderLeftColor: 'transparent',
              transform: [{ rotate: rotateRev }],
            }}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

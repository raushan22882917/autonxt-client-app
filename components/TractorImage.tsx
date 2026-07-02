import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  defaultTractorImage,
  getTractorAccentPalette,
  getTractorListRowImageSource,
  type TractorImageFields,
} from '@/lib/tractorImages';

interface Props {
  tractor: TractorImageFields;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  /** Gradient frame + colored border for list & detail cards */
  colorful?: boolean;
}

export function TractorImage({
  tractor,
  style,
  resizeMode = 'contain',
  colorful = true,
}: Props) {
  const resolved = getTractorListRowImageSource(tractor);
  const source = resolved ?? defaultTractorImage;
  const hasAsset = resolved != null;
  const accent = getTractorAccentPalette(tractor);

  if (!colorful) {
    return (
      <View style={styles.plainWrap}>
        <Image
          source={source}
          style={[styles.image, style]}
          resizeMode={resizeMode}
        />
      </View>
    );
  }

  return (
    <View style={[styles.frame, { borderColor: accent.border }]}>
      <LinearGradient
        colors={accent.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Subtle inner glow overlay */}
        <View style={styles.innerGlow} pointerEvents="none" />

        {hasAsset ? (
          <Image
            source={source}
            style={[styles.imageInner, style]}
            resizeMode={resizeMode}
          />
        ) : (
          <View style={styles.fallback}>
            <MaterialCommunityIcons name="tractor" size={38} color={accent.icon} />
          </View>
        )}
      </LinearGradient>

      {/* Corner shine */}
      <View style={[styles.cornerShine, { backgroundColor: accent.icon + '22' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  plainWrap: {
    width: '100%',
    height: '100%',
  },
  frame: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageInner: {
    width: '100%',
    height: '100%',
    minHeight: 72,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 72,
  },
  cornerShine: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderBottomLeftRadius: 32,
  },
});

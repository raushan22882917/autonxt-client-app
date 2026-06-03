import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  defaultTractorImage,
  getTractorListRowImageSource,
  type TractorImageFields,
} from '@/lib/tractorImages';

interface Props {
  tractor: TractorImageFields;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

export function TractorImage({ tractor, style, resizeMode = 'contain' }: Props) {
  const c = useColors();
  const resolved = getTractorListRowImageSource(tractor);
  const source = resolved ?? defaultTractorImage;

  return (
    <View style={styles.wrap}>
      <Image source={source} style={[styles.image, style]} resizeMode={resizeMode} />
      {!resolved ? (
        <View style={[styles.fallbackBadge, { backgroundColor: c.surfaceAlt }]}>
          <Feather name="truck" size={14} color={c.mutedForeground} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallbackBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

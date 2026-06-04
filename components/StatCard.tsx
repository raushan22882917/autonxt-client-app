import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LoadingRing } from '@/components/LoadingRing';
import { useColors } from '@/hooks/useColors';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  subtitle?: string;
  loading?: boolean;
}

export function StatCard({ title, value, icon, iconColor, subtitle, loading }: Props) {
  const c = useColors();
  const tint = iconColor || c.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.card,
          borderColor: c.border,
          shadowColor: c.shadowStrong,
        },
      ]}
    >
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: tint + '14' }]}>
          {loading ? (
            <LoadingRing size="sm" color={tint} />
          ) : (
            <Feather name={icon as keyof typeof Feather.glyphMap} size={18} color={tint} />
          )}
        </View>
        <View style={[styles.indicatorDot, { backgroundColor: loading ? c.border : tint + 'AA' }]} />
      </View>

      {/* Value */}
      {loading ? (
        <View style={styles.valueLoader}>
          <LoadingRing size="md" color={tint} dual />
        </View>
      ) : (
        <Text
          style={[styles.value, { color: c.foreground }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
        >
          {value}
        </Text>
      )}

      {/* Labels */}
      <Text style={[styles.title, { color: c.foreground }]} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: c.mutedForeground }]} numberOfLines={2}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  valueLoader: {
    height: 38,
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    lineHeight: 15,
    marginTop: 1,
  },
});

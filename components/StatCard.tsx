import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  iconColor?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, iconColor, subtitle }: Props) {
  const c = useColors();
  const tint = iconColor || c.primary;
  return (
    <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: tint + '18' }]}>
          <Feather name={icon as keyof typeof Feather.glyphMap} size={18} color={tint} />
        </View>
        <View style={[styles.accentDot, { backgroundColor: tint }]} />
      </View>
      <Text style={[styles.value, { color: c.foreground }]}>{value}</Text>
      <Text style={[styles.title, { color: c.mutedForeground }]} numberOfLines={1}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: c.mutedForeground }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    opacity: 0.5,
  },
  value: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 12.5,
    fontFamily: 'Inter_500Medium',
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
});

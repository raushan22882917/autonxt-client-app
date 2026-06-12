import React, { useMemo } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantAnalysisCard } from '@/components/PlantAnalysisCard';
import { buildPlantSummaries } from '@/lib/plantAnalysis';

export default function PlantAnalysisScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { plants, tractors, complaints, runtimeRecords, isLoading, refresh, organization } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const summaries = useMemo(
    () => buildPlantSummaries(plants, tractors, complaints, runtimeRecords),
    [plants, tractors, complaints, runtimeRecords]
  );

  const openPlant = (plantID: string) =>
    router.push(`/plant/${encodeURIComponent(plantID)}`);

  const ListHeader = (
    <View style={[styles.header, { paddingTop: topPad + 16 }]}>
      <View style={styles.headerTitleContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.mainTitleText, { color: c.foreground }]}>All Plants</Text>
          <View style={styles.skewWrapper}>
            <View style={styles.skewSolid} />
            <View style={styles.skewDivider} />
            <LinearGradient
              colors={['#FF0000', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.skewGradient}
            />
          </View>
        </View>
        <Text style={[styles.subtitleText, { color: c.mutedForeground }]}>Choose your plant</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <FlatList
        data={summaries}
        keyExtractor={s => s.plant.plantID}
        renderItem={({ item }) => (
          <PlantAnalysisCard summary={item} onPress={() => openPlant(item.plant.plantID)} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="home" size={32} color={c.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>No Plants Found</Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {isLoading ? 'Loading plant data…' : 'No plants found for this organization'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: { paddingHorizontal: 16 },
  header: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },

  headerTitleContainer: {
    flexDirection: 'column',
    gap: 4,
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainTitleText: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    letterSpacing: -0.1,
  },
  skewWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    height: 20,
    marginLeft: 12,
    overflow: 'hidden',
    transform: [{ skewX: '-25deg' }],
  },
  skewSolid: {
    width: 16,
    height: '100%',
    backgroundColor: '#FF0000',
  },
  skewDivider: {
    width: 3,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  skewGradient: {
    flex: 1,
    height: '100%',
  },

  // ── Empty ──
  empty: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 8,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});

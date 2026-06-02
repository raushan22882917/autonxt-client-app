import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { PlantFilter } from '@/components/PlantFilter';
import { StatusBadge } from '@/components/StatusBadge';
import { Tractor } from '@/lib/appsync';

export default function TractorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filteredTractors, isLoading, refresh } = useApp();
  const [search, setSearch] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const displayed = search.trim()
    ? filteredTractors.filter(
        t =>
          t.model.toLowerCase().includes(search.toLowerCase()) ||
          t.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
          (t.plantName || '').toLowerCase().includes(search.toLowerCase())
      )
    : filteredTractors;

  const renderTractor = ({ item }: { item: Tractor }) => (
    <View style={[styles.card, { backgroundColor: '#111827', borderColor: '#1E293B' }]}>
      <View style={styles.cardTop}>
        <View style={styles.iconWrap}>
          <Feather name="truck" size={22} color="#F97316" />
        </View>
        <View style={styles.info}>
          <Text style={styles.model}>{item.model}</Text>
          <Text style={styles.serial}>{item.serialNumber}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Feather name="clock" size={13} color="#64748B" />
          <Text style={styles.metricLabel}>Runtime</Text>
          <Text style={styles.metricValue}>{item.totalRuntime}h</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Feather name="battery" size={13} color="#64748B" />
          <Text style={styles.metricLabel}>Fuel</Text>
          <Text style={styles.metricValue}>{item.fuelLevel ?? '--'}%</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Feather name="settings" size={13} color="#64748B" />
          <Text style={styles.metricLabel}>Eng. Hrs</Text>
          <Text style={styles.metricValue}>{item.engineHours ?? '--'}</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metric}>
          <Feather name="map-pin" size={13} color="#64748B" />
          <Text style={styles.metricLabel}>Plant</Text>
          <Text style={styles.metricValue} numberOfLines={1}>{item.plantName || '--'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: '#0A1628' }]}>
      {/* Search bar */}
      <View style={[styles.searchWrap, { paddingTop: topPad + 12 }]}>
        <View style={[styles.searchBox, { borderColor: '#1E293B' }]}>
          <Feather name="search" size={16} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tractors..."
            placeholderTextColor="#475569"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Feather name="x" size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <PlantFilter />

      <FlatList
        data={displayed}
        keyExtractor={t => t.tractorID}
        renderItem={renderTractor}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#F97316" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="truck" size={36} color="#1E293B" />
            <Text style={styles.emptyText}>No tractors found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F9731618',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  model: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  serial: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  metricValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
    maxWidth: 60,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1E293B',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

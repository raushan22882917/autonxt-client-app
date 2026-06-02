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
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { AppUser } from '@/lib/appsync';

export default function UsersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { users, organization, isLoading, refresh } = useApp();
  const [search, setSearch] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : 0;

  const displayed = search.trim()
    ? users.filter(
        u =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()) ||
          (u.role || '').toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const roleColors: Record<string, string> = {
    admin: '#F97316',
    supervisor: '#8B5CF6',
    driver: '#10B981',
    operator: '#3B82F6',
    default: '#64748B',
  };

  const getRoleColor = (role: string) =>
    roleColors[role.toLowerCase()] || roleColors.default;

  const renderUser = ({ item }: { item: AppUser }) => (
    <View style={[styles.card, { backgroundColor: '#111827', borderColor: '#1E293B' }]}>
      <View style={styles.avatarWrap}>
        <Text style={styles.avatarText}>
          {item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>{item.role}</Text>
          </View>
          {item.status && (
            <View style={[styles.statusDot, { backgroundColor: item.status === 'ACTIVE' ? '#10B981' : '#6B7280' }]} />
          )}
          {item.phone ? (
            <Text style={styles.phone}>{item.phone}</Text>
          ) : null}
        </View>
      </View>
      {item.cognitoGroups && item.cognitoGroups.length > 0 && (
        <View style={styles.groupsCol}>
          {item.cognitoGroups.slice(0, 2).map(g => (
            <View key={g} style={styles.groupChip}>
              <Text style={styles.groupText} numberOfLines={1}>{g}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: '#0A1628' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={20} color="#94A3B8" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Users</Text>
          <Text style={styles.headerSub}>{organization?.name || 'Organization'}</Text>
        </View>
        <Text style={styles.count}>{displayed.length}</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { borderColor: '#1E293B' }]}>
          <Feather name="search" size={16} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
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

      <FlatList
        data={displayed}
        keyExtractor={u => u.id}
        renderItem={renderUser}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#F97316" />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={36} color="#1E293B" />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#F8FAFC',
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  count: {
    marginLeft: 'auto',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
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
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#F8FAFC',
  },
  email: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  phone: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#475569',
  },
  groupsCol: {
    gap: 4,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  groupChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: 90,
  },
  groupText: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
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

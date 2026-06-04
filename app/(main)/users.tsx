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
import { AppUser } from '@/lib/appsync';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  admin: { bg: '#FDECEC', text: '#C1121F' },
  supervisor: { bg: '#E0F2F8', text: '#0B7599' },
  driver: { bg: '#E4F7EC', text: '#0A9040' },
  operator: { bg: '#E8EFFD', text: '#1246C8' },
};

function getRoleColor(role: string): { bg: string; text: string } {
  return ROLE_COLORS[role.toLowerCase()] ?? { bg: '#EEF3FB', text: '#5A6A85' };
}

export default function UsersScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
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

  const renderUser = ({ item, index }: { item: AppUser; index: number }) => {
    const roleColor = getRoleColor(item.role);
    const initials = item.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    // Cycle through accent colors for avatars
    const avatarColors = [c.primary, c.accent, c.success, c.info, c.warning];
    const avatarBg = avatarColors[index % avatarColors.length];

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
        {/* Avatar */}
        <View style={[styles.avatarWrap, { backgroundColor: avatarBg }]}>
          <Text style={[styles.avatarText, { color: c.primaryForeground }]}>{initials}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: c.foreground }]}>{item.name}</Text>
          <Text style={[styles.email, { color: c.mutedForeground }]} numberOfLines={1}>
            {item.email}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.roleBadge, { backgroundColor: roleColor.bg }]}>
              <Text style={[styles.roleText, { color: roleColor.text }]}>
                {item.role}
              </Text>
            </View>

            {item.status ? (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: item.status === 'ACTIVE' ? c.successSoft : c.surfaceAlt,
                    borderColor: item.status === 'ACTIVE' ? c.success + '40' : c.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'ACTIVE' ? c.success : c.mutedForeground },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: item.status === 'ACTIVE' ? c.success : c.mutedForeground },
                  ]}
                >
                  {item.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            ) : null}
          </View>

          {item.phone ? (
            <View style={styles.phoneRow}>
              <Feather name="phone" size={11} color={c.mutedForeground} />
              <Text style={[styles.phone, { color: c.mutedForeground }]}>{item.phone}</Text>
            </View>
          ) : null}
        </View>

        {/* Groups */}
        {item.cognitoGroups && item.cognitoGroups.length > 0 ? (
          <View style={styles.groupsCol}>
            {item.cognitoGroups.slice(0, 2).map(g => (
              <View key={g} style={[styles.groupChip, { backgroundColor: c.primary + '10', borderColor: c.primary + '25' }]}>
                <Text style={[styles.groupText, { color: c.primary }]} numberOfLines={1}>
                  {g}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 14,
            backgroundColor: c.card,
            borderBottomColor: c.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={c.foreground} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: c.foreground }]}>Team Members</Text>
          <Text style={[styles.headerSub, { color: c.mutedForeground }]}>
            {organization?.name || 'Organization'} · {displayed.length} member{displayed.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: c.card, borderBottomColor: c.hairline }]}>
        <View style={[styles.searchBox, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Feather name="search" size={17} color={c.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: c.foreground }]}
            placeholder="Search by name, email, role…"
            placeholderTextColor={c.mutedForeground + '88'}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <View style={[styles.clearBtn, { backgroundColor: c.border }]}>
                <Feather name="x" size={12} color={c.mutedForeground} />
              </View>
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
          <RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor={c.primary} />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={[styles.empty, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.emptyIconWrap, { backgroundColor: c.surfaceAlt }]}>
              <Feather name="users" size={32} color={c.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: c.foreground }]}>
              {search ? 'No Results' : 'No Users Found'}
            </Text>
            <Text style={[styles.emptyText, { color: c.mutedForeground }]}>
              {search ? `No users match "${search}"` : 'No team members found'}
            </Text>
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
    paddingBottom: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, gap: 2 },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
  },
  info: { flex: 1, gap: 4 },
  name: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  phone: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  groupsCol: {
    gap: 5,
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  groupChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 90,
  },
  groupText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
  },
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
  },
});

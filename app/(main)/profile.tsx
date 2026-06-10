import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useDrawer } from '@/context/DrawerContext';

// ── Option Row Component ───────────────────────────────────────────────────
function OptionRow({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  onPress,
  isLast,
  isDanger,
}: {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  isDanger?: boolean;
}) {
  const c = useColors();
  return (
    <TouchableOpacity
      style={[
        styles.row,
        !isLast && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.rowIconWrap, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={15} color={iconColor} />
      </View>
      <View style={styles.rowBody}>
        <Text style={[styles.rowLabel, isDanger && { color: c.primary, fontFamily: 'Inter_700Bold' }]}>
          {label}
        </Text>
      </View>
      {value ? (
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      <Feather name="chevron-right" size={16} color={isDanger ? c.primary : '#94A3B8'} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const { organization, plants, tractors } = useApp();

  const topPad = Platform.OS === 'web' ? 12 : insets.top;
  const roleLabel = isAdmin ? 'Administrator' : user?.role?.trim() || 'User';

  // Redirect to login when user signs out
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  const displayName = user?.name?.trim() || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const { isDrawerOpen, closeDrawer } = useDrawer();

  const goBack = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      if (router.canGoBack()) router.back();
      else router.replace('/(main)/dashboard');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      
      {/* ── Dark Header Section ── */}
      <View style={[styles.darkHeader, { paddingTop: Math.max(4, topPad - 12) }]}>
        {/* Navigation Row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={goBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Circular Avatar with Camera Badge */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {/* Camera badge overlay */}
            <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
              <Feather name="camera" size={8} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Name and Email */}
        <Text style={styles.userName}>{displayName}</Text>
        {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}
      </View>

      {/* ── Scrollable Options Body ── */}
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Group 1: Fleet Assets */}
        <View style={[styles.optionsGroupCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
          <OptionRow
            icon="layers"
            iconColor={c.accent}
            iconBg={c.accent + '15'}
            label="Registered Plants"
            value={`${plants.length} plant(s)`}
          />
          <OptionRow
            icon="truck"
            iconColor={c.secondary}
            iconBg={c.secondary + '15'}
            label="Registered Tractors"
            value={`${tractors.length} tractor(s)`}
          />
          <OptionRow
            icon="activity"
            iconColor={c.success}
            iconBg={c.success + '15'}
            label="Access Status"
            value={roleLabel}
            isLast={true}
          />
        </View>

        {/* Group 2: Personal Account details */}
        <View style={[styles.optionsGroupCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
          <OptionRow
            icon="mail"
            iconColor={c.secondary}
            iconBg={c.secondary + '15'}
            label="Email Address"
            value={user?.email || '—'}
          />
          <OptionRow
            icon="user"
            iconColor={c.primary}
            iconBg={c.primary + '15'}
            label="Display Name"
            value={user?.name?.trim() || '—'}
          />
          <OptionRow
            icon="shield"
            iconColor={c.accent}
            iconBg={c.accent + '15'}
            label="Access Role"
            value={roleLabel}
            isLast={true}
          />
        </View>

        {/* Group 3: Organization Details */}
        <View style={[styles.optionsGroupCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
          <OptionRow
            icon="briefcase"
            iconColor={c.accent}
            iconBg={c.accent + '15'}
            label="Organization"
            value={organization?.name || '—'}
          />
          {organization?.location ? (
            <OptionRow
              icon="map-pin"
              iconColor={c.secondary}
              iconBg={c.secondary + '15'}
              label="Location"
              value={organization.location}
            />
          ) : null}
          <OptionRow
            icon="hash"
            iconColor={c.primary}
            iconBg={c.primary + '15'}
            label="Org Identifier"
            value={organization?.orgID || '—'}
            isLast={true}
          />
        </View>

        {/* Group 4: Admin Tools */}
        {isAdmin ? (
          <View style={[styles.optionsGroupCard, { backgroundColor: c.card, shadowColor: c.shadowStrong }]}>
            <OptionRow
              icon="users"
              iconColor={c.primary}
              iconBg={c.primary + '15'}
              label="Manage Organization Users"
              onPress={() => router.push('/(main)/users')}
              isLast={true}
            />
          </View>
        ) : null}

        {/* Group 5: Sign Out */}
        <View style={[styles.optionsGroupCard, { backgroundColor: c.primary, borderColor: c.primary, shadowColor: c.primary, shadowOpacity: 0.12 }]}>
          <TouchableOpacity
            style={styles.row}
            onPress={signOut}
            activeOpacity={0.8}
          >
            <View style={[styles.rowIconWrap, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
              <Feather name="log-out" size={15} color="#FFFFFF" />
            </View>
            <View style={styles.rowBody}>
              <Text style={[styles.rowLabel, { color: '#FFFFFF', fontFamily: 'Inter_700Bold' }]}>
                Logout
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  
  // ── Dark Header Section ──
  darkHeader: {
    backgroundColor: '#2A1A1D',
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarOuter: {
    position: 'relative',
  },
  avatarInner: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(126, 21, 47, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#7E152F',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7E152F',
    borderWidth: 1.5,
    borderColor: '#2A1A1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 1,
  },
  userEmail: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    textAlign: 'center',
  },

  // ── Options Cards ──
  content: {
    padding: 16,
    gap: 16,
  },
  optionsGroupCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 4,
  },

  // ── Option Rows ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  rowValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginRight: 4,
  },
});

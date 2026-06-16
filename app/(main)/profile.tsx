import React, { useEffect } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { useDrawer } from '@/context/DrawerContext';
import { ConfirmModal } from '@/components/ConfirmModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function BadgePill({
  label,
  color,
  bg,
}: {
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Feather name="shield" size={10} color={color} style={{ marginRight: 4 }} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

function CountPill({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.countPill, { borderColor: color }]}>
      <Text style={[styles.countPillText, { color }]}>{label}</Text>
    </View>
  );
}

// ── Row Components ────────────────────────────────────────────────────────────

type InfoRowProps = {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  rightLabel?: string;
  rightBadge?: { label: string; color: string; bg: string };
  rightCount?: { label: string; color: string };
  isLast?: boolean;
  isDanger?: boolean;
  onPress?: () => void;
  gradientColors?: [string, string, ...string[]];
  useWhiteText?: boolean;
  hideChevron?: boolean;
  style?: any;
};

function InfoRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  rightLabel,
  rightBadge,
  rightCount,
  isLast,
  isDanger,
  onPress,
  gradientColors,
  useWhiteText,
  hideChevron = !onPress,
  style,
}: InfoRowProps) {
  const finalIconColor = useWhiteText ? '#FFFFFF' : iconColor;
  const finalIconBg = useWhiteText ? 'rgba(255, 255, 255, 0.15)' : iconBg;
  const titleColor = useWhiteText ? '#FFFFFF' : (isDanger ? '#7E152F' : '#0F172A');
  const subtitleColor = useWhiteText ? 'rgba(255, 255, 255, 0.7)' : '#94A3B8';
  const chevronColor = useWhiteText ? '#FFFFFF' : (isDanger ? '#7E152F' : '#CBD5E1');

  return (
    <TouchableOpacity
      style={[styles.infoRow, !isLast && styles.infoRowDivider, { overflow: 'hidden' }, style]}
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      {gradientColors && (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {/* Left icon */}
      <View style={[styles.infoRowIcon, { backgroundColor: finalIconBg, zIndex: 1 }]}>
        <Feather name={icon} size={16} color={finalIconColor} />
      </View>

      {/* Text block */}
      <View style={[styles.infoRowBody, { zIndex: 1 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 8 }}>
          <Text
            style={[
              styles.infoRowTitle,
              { color: titleColor },
              isDanger && { fontFamily: 'Inter_700Bold' },
            ]}
          >
            {title}
          </Text>
          
          {rightLabel && (
            <Text 
              style={[
                styles.infoRowValue, 
                { 
                  zIndex: 1, 
                  color: useWhiteText ? 'rgba(255, 255, 255, 0.8)' : '#64748B',
                  maxWidth: undefined,
                }
              ]} 
              numberOfLines={1}
            >
              {rightLabel}
            </Text>
          )}
        </View>

        {subtitle ? (
          <Text style={[styles.infoRowSubtitle, { color: subtitleColor, marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right area for Badge or Count */}
      {rightCount && (
        <View style={{ zIndex: 1 }}>
          <CountPill label={rightCount.label} color={rightCount.color} />
        </View>
      )}
      {rightBadge && (
        <View style={{ zIndex: 1 }}>
          <BadgePill
            label={rightBadge.label}
            color={rightBadge.color}
            bg={rightBadge.bg}
          />
        </View>
      )}

      {/* Chevron */}
      {!hideChevron && (
        <Feather
          name="chevron-right"
          size={16}
          color={chevronColor}
          style={{ zIndex: 1 }}
        />
      )}
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
  const { isDrawerOpen, closeDrawer } = useDrawer();
  const [signOutModalVisible, setSignOutModalVisible] = React.useState(false);

  const topPad = Platform.OS === 'web' ? 12 : Math.max(0, insets.top + 3);
  const roleLabel = isAdmin ? 'Administrator' : user?.role?.trim() || 'User';

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user]);

  const displayName = user?.name?.trim() || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const goBack = () => {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      if (router.canGoBack()) router.back();
      else router.replace('/(main)/dashboard');
    }
  };

  const handleSignOut = () => {
    setSignOutModalVisible(true);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* ── Burgundy Header (matches Fleet page) ── */}
      <View
        style={[styles.header, { paddingTop: topPad }]}
      >
        {/* Top nav row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={goBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <Feather name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* AutoNxt Fleet brand */}
          <View style={styles.brandBlock}>
            <Text style={styles.brandAuto}>Auto</Text>
            <Text style={styles.brandNxt}>Nxt</Text>
            <Text style={styles.brandFleet}>{'  '}FLEET</Text>
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            accessibilityLabel="Profile"
          >
            <Feather name="user" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Account title */}
        <View style={styles.accountTitleBlock}>
          <Text style={styles.accountTitle}>Account</Text>
          <Text style={styles.accountSubtitle}>
            Manage your profile and preferences
          </Text>
        </View>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ─ Profile Card (scrolls with content) ─ */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardInner}>
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={['#7E152F', '#A82C48']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarInitials}>{initials}</Text>
              </LinearGradient>
              <View style={styles.cameraBadge}>
                <Feather name="camera" size={8} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.profileCardTextBlock}>
              <Text style={styles.profileName} numberOfLines={1}>
                {displayName}
              </Text>
              {user?.email ? (
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user.email}
                </Text>
              ) : null}
              <BadgePill label={roleLabel} color="#10B981" bg="#D1FAE5" />
            </View>
          </View>
        </View>

        {/* ─ Assets & Access ─ */}
        <SectionLabel>ASSETS & ACCESS</SectionLabel>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <InfoRow
            icon="layers"
            iconColor="#7E152F"
            iconBg="#FDF2F4"
            title="Registered Plants"
            subtitle="View and manage your plants"
            rightCount={{
              label: `${plants.length} plant(s)`,
              color: '#7E152F',
            }}
            onPress={() => router.push('/(main)/runtime?from=profile')}
          />
          <InfoRow
            icon="truck"
            iconColor="#E2A93E"
            iconBg="#FEF3C7"
            title="Registered Tractors"
            subtitle="View and manage your tractors"
            rightCount={{
              label: `${tractors.length} tractor(s)`,
              color: '#E2A93E',
            }}
            onPress={() => router.push('/(main)/tractors?from=profile')}
          />
          <InfoRow
            icon="activity"
            iconColor="#10B981"
            iconBg="#D1FAE5"
            title="Access Status"
            subtitle="Your current access level"
            rightBadge={{
              label: roleLabel,
              color: '#10B981',
              bg: '#D1FAE5',
            }}
            isLast
          />
        </View>

        {/* ─ Profile Information ─ */}
        <SectionLabel>PROFILE INFORMATION</SectionLabel>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <InfoRow
            icon="mail"
            iconColor="#E2A93E"
            iconBg="#FEF3C7"
            title="Email Address"
            subtitle="Your registered email"
            rightLabel={user?.email || '—'}
          />
          <InfoRow
            icon="user"
            iconColor="#7E152F"
            iconBg="#FDF2F4"
            title="Display Name"
            subtitle="Name shown in the app"
            rightLabel={user?.name?.trim() || '—'}
          />
          <InfoRow
            icon="shield"
            iconColor="#3B82F6"
            iconBg="#DBEAFE"
            title="Access Role"
            subtitle="Your role in the organization"
            rightLabel={roleLabel}
            isLast={true}
          />
        </View>

        {/* Sign Out (standalone block with red border) */}
        <InfoRow
          icon="log-out"
          iconColor="#7E152F"
          iconBg="#FDF2F4"
          title="Sign Out"
          subtitle=""
          isDanger
          isLast
          onPress={handleSignOut}
          hideChevron={true}
          style={{
            borderWidth: 1.5,
            borderColor: '#7E152F',
            borderRadius: 18,
            backgroundColor: '#FFFFFF',
            marginTop: 12,
          }}
        />
      </ScrollView>

      <ConfirmModal
        visible={signOutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        onCancel={() => setSignOutModalVisible(false)}
        onConfirm={() => {
          setSignOutModalVisible(false);
          signOut();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F6F8' },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: '#7E152F',
    paddingHorizontal: 16,
    paddingBottom: 44, // visual space for the overlapping card
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#7E152F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Brand
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  brandAuto: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  brandNxt: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#E2A93E',
    letterSpacing: -0.4,
  },
  brandFleet: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    color: '#E2A93E',
    letterSpacing: 2.5,
    marginBottom: 2,
  },

  // Account title block
  accountTitleBlock: {
    marginBottom: 14,
  },
  accountTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  accountSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },

  // Profile card — first scroll item, pulled up with negative marginTop to overlap header
  profileCard: {
    marginTop: 0,
    marginHorizontal: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 16,   // must exceed header's elevation:6 to draw on top on Android
    zIndex: 20,
  },
  profileCardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarGradient: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7E152F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCardTextBlock: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },

  // ── Badge / Pills ─────────────────────────────────────────────────────────
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 6,
  },
  countPillText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },

  // ── Scroll area ────────────────────────────────────────────────────────────
  scrollArea: { flex: 1, zIndex: 10, elevation: 12, marginTop: -44 },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 0,
  },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 4,
  },

  // ── Card container ────────────────────────────────────────────────────────
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 4,
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRowBody: {
    flex: 1,
    gap: 2,
  },
  infoRowTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  infoRowSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },
  infoRowValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    maxWidth: 120,
    textAlign: 'right',
    marginRight: 4,
  },
});

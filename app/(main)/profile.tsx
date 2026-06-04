import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

function InfoRow({
  icon,
  label,
  value,
  c,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  c: ReturnType<typeof useColors>;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && { borderBottomWidth: 1, borderBottomColor: c.hairline },
      ]}
    >
      <View style={[styles.infoIcon, { backgroundColor: c.primary + '12' }]}>
        <Feather name={icon} size={15} color={c.primary} />
      </View>
      <View style={styles.infoBody}>
        <Text style={[styles.infoLabel, { color: c.mutedForeground }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: c.foreground }]} selectable numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({ title, c }: { title: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={[styles.sectionAccent, { backgroundColor: c.primary }]} />
      <Text style={[styles.sectionTitle, { color: c.foreground }]}>{title}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const { organization, plants, tractors } = useApp();

  const topPad = Platform.OS === 'web' ? 67 : 0;
  const roleLabel = isAdmin ? 'Administrator' : user?.role?.trim() || 'User';
  const displayName = user?.name?.trim() || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(main)/dashboard');
  };

  const accountRows: [keyof typeof Feather.glyphMap, string, string][] = [
    ['mail', 'Email', user?.email || '—'],
    ['user', 'Display name', user?.name?.trim() || '—'],
    ['shield', 'Role', roleLabel],
  ];
  if (user?.orgID) {
    accountRows.push(['hash', 'User org ID', user.orgID]);
  }

  const orgRows: [keyof typeof Feather.glyphMap, string, string][] = [
    ['briefcase', 'Organization', organization?.name || '—'],
  ];
  if (organization?.location) orgRows.push(['map-pin', 'Location', organization.location]);
  if (organization?.industry) orgRows.push(['layers', 'Industry', organization.industry]);
  if (organization?.orgID) orgRows.push(['hash', 'Org ID', organization.orgID]);
  if (organization?.contactEmail) orgRows.push(['at-sign', 'Contact email', organization.contactEmail]);
  if (organization?.contactPhone) orgRows.push(['phone', 'Contact phone', organization.contactPhone]);

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Top bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: topPad + 8,
            backgroundColor: c.card,
            borderBottomColor: c.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: c.surfaceAlt }]}
          onPress={goBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={20} color={c.foreground} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: c.foreground }]}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero card */}
        <View style={[styles.heroCard, { shadowColor: c.primary }]}>
          <LinearGradient
            colors={[c.primary, c.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: 20 }]}
          >
            {/* Avatar */}
            <View style={styles.heroTop}>
              <View style={[styles.avatar, { backgroundColor: c.primaryForeground + '22' }]}>
                <Text style={[styles.avatarText, { color: c.primaryForeground }]}>{initials}</Text>
              </View>
            </View>

            <Text style={[styles.heroName, { color: c.primaryForeground }]}>{displayName}</Text>

            {user?.email && user.name?.trim() ? (
              <Text style={[styles.heroEmail, { color: c.primaryForeground + 'BB' }]}>
                {user.email}
              </Text>
            ) : null}

            <View style={styles.heroMeta}>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: c.primaryForeground + '20', borderColor: c.primaryForeground + '35' },
                ]}
              >
                <Feather
                  name={isAdmin ? 'shield' : 'user'}
                  size={13}
                  color={c.primaryForeground}
                />
                <Text style={[styles.roleText, { color: c.primaryForeground }]}>
                  {roleLabel}
                </Text>
              </View>

              {organization?.name ? (
                <View
                  style={[
                    styles.orgBadge,
                    { backgroundColor: c.primaryForeground + '20', borderColor: c.primaryForeground + '35' },
                  ]}
                >
                  <Feather name="briefcase" size={12} color={c.primaryForeground + 'CC'} />
                  <Text style={[styles.orgText, { color: c.primaryForeground + 'CC' }]}>
                    {organization.name}
                  </Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>
        </View>

        {/* Fleet Stats row */}
        <View style={[styles.fleetStats, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}>
          <View style={styles.fleetStatItem}>
            <Feather name="home" size={16} color={c.primary} />
            <Text style={[styles.fleetStatNum, { color: c.foreground }]}>{plants.length}</Text>
            <Text style={[styles.fleetStatLabel, { color: c.mutedForeground }]}>Plants</Text>
          </View>
          <View style={[styles.fleetStatDivider, { backgroundColor: c.border }]} />
          <View style={styles.fleetStatItem}>
            <Feather name="truck" size={16} color={c.primary} />
            <Text style={[styles.fleetStatNum, { color: c.foreground }]}>{tractors.length}</Text>
            <Text style={[styles.fleetStatLabel, { color: c.mutedForeground }]}>Tractors</Text>
          </View>
          <View style={[styles.fleetStatDivider, { backgroundColor: c.border }]} />
          <View style={styles.fleetStatItem}>
            <Feather name={isAdmin ? 'shield' : 'user'} size={16} color={isAdmin ? c.accent : c.primary} />
            <Text style={[styles.fleetStatNum, { color: c.foreground }]}>
              {isAdmin ? 'Admin' : 'User'}
            </Text>
            <Text style={[styles.fleetStatLabel, { color: c.mutedForeground }]}>Access</Text>
          </View>
        </View>

        {/* Account section */}
        <SectionHeader title="Account" c={c} />
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {accountRows.map(([icon, label, value], i) => (
            <InfoRow
              key={label}
              icon={icon}
              label={label}
              value={value}
              c={c}
              last={i === accountRows.length - 1}
            />
          ))}
        </View>

        {/* Organization section */}
        <SectionHeader title="Organization" c={c} />
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {orgRows.map(([icon, label, value], i) => (
            <InfoRow
              key={label}
              icon={icon}
              label={label}
              value={value}
              c={c}
              last={i === orgRows.length - 1}
            />
          ))}
        </View>

        {/* Admin actions */}
        {isAdmin ? (
          <>
            <SectionHeader title="Admin Tools" c={c} />
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: c.card, borderColor: c.border, shadowColor: c.shadow }]}
              onPress={() => router.push('/(main)/users')}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIcon, { backgroundColor: c.primary + '12' }]}>
                <Feather name="users" size={20} color={c.primary} />
              </View>
              <View style={styles.actionBody}>
                <Text style={[styles.actionLabel, { color: c.foreground }]}>Manage Users</Text>
                <Text style={[styles.actionSub, { color: c.mutedForeground }]}>
                  View and manage organization members
                </Text>
              </View>
              <View style={[styles.actionArrow, { backgroundColor: c.surfaceAlt }]}>
                <Feather name="chevron-right" size={18} color={c.mutedForeground} />
              </View>
            </TouchableOpacity>
          </>
        ) : null}

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: c.redSoft, borderColor: c.redBorder }]}
          onPress={signOut}
          activeOpacity={0.85}
        >
          <Feather name="log-out" size={20} color={c.red} />
          <Text style={[styles.logoutText, { color: c.red }]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 13,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  content: {
    padding: 16,
    gap: 10,
  },
  heroCard: {
    borderRadius: 20,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 6,
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  heroTop: {
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  heroName: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  heroEmail: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  orgBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
  },
  orgText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  fleetStats: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  fleetStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  fleetStatDivider: {
    width: 1,
    height: 40,
  },
  fleetStatNum: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.3,
  },
  fleetStatLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 2,
    paddingLeft: 2,
  },
  sectionAccent: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoBody: { flex: 1, gap: 2 },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBody: { flex: 1, gap: 2 },
  actionLabel: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.1,
  },
  actionSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  actionArrow: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 18,
    marginTop: 14,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.2,
  },
});

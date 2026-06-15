import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { useDrawer } from '@/context/DrawerContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ConfirmModal } from './ConfirmModal';

export function NavigationDrawerContent() {
  const c = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { closeDrawer } = useDrawer();
  const [signOutModalVisible, setSignOutModalVisible] = React.useState(false);

  const displayName = user?.name?.trim() || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const navigateTo = (route: string) => {
    closeDrawer();
    // Delay routing slightly to allow drawer closing animation to run smoothly
    setTimeout(() => {
      router.push(route as any);
    }, 250);
  };

  const handleSignOut = () => {
    setSignOutModalVisible(true);
  };

  const menuItems = [
    { label: 'Home', icon: 'home', route: '/(main)/dashboard' },
    { label: 'My Account', icon: 'user', route: '/(main)/profile' },
    { label: 'Complaints', icon: 'alert-triangle', route: '/(main)/complaints' },
    { label: 'Reports', icon: 'file-text', route: '/(main)/reports' },
  ] as const;

  const isActive = (route: string) => {
    if (route === '/(main)/dashboard') return pathname.includes('dashboard');
    if (route === '/(main)/profile') return pathname.includes('profile');
    if (route === '/(main)/complaints') return pathname.includes('complaints') || pathname.includes('complaint/');
    if (route === '/(main)/reports') return pathname.includes('reports');
    return false;
  };

  return (
    <View style={styles.container}>
      {/* ── Profile Header Section ── */}
      <TouchableOpacity
        style={styles.profileHeader}
        onPress={() => navigateTo('/(main)/profile')}
        activeOpacity={0.8}
      >
        <View style={styles.avatarInner}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.viewProfile}>View Profile</Text>
        </View>
      </TouchableOpacity>

      {/* ── Menu List ── */}
      <View style={styles.menuList}>
        {menuItems.map(item => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, active && styles.menuItemActive]}
              onPress={() => navigateTo(item.route)}
              activeOpacity={0.7}
            >
              <Feather
                name={item.icon as any}
                size={18}
                color={active ? '#7E152F' : '#64748B'}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuLabel, active ? styles.menuLabelActive : { color: '#64748B' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Feather
            name="log-out"
            size={18}
            color="#7E152F"
            style={styles.menuIcon}
          />
          <Text style={[styles.menuLabel, { color: '#7E152F' }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer Section ── */}
      <View style={styles.footer}>
        <Text style={styles.versionText}>App v.1.0.0</Text>
        <View style={styles.logoRow}>
          <Text style={styles.logoMain}>Auto</Text>
          <Text style={styles.logoSub}>Nxt</Text>
        </View>
      </View>

      <ConfirmModal
        visible={signOutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        onCancel={() => setSignOutModalVisible(false)}
        onConfirm={() => {
          setSignOutModalVisible(false);
          closeDrawer();
          setTimeout(() => {
            signOut();
          }, 250);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingLeft: 8,
    paddingRight: 24,
    justifyContent: 'space-between',
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarInner: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#7E152F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  viewProfile: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7E152F',
  },
  menuList: {
    flex: 1,
    paddingTop: 32,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 14,
  },
  menuItemActive: {
    backgroundColor: 'rgba(126, 21, 47, 0.08)',
  },
  menuIcon: {
    width: 20,
  },
  menuLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  menuLabelActive: {
    color: '#7E152F',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  footer: {
    gap: 8,
  },
  versionText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoMain: {
    fontSize: 18,
    fontFamily: 'SpaceMono_700Bold',
    color: '#7E152F',
  },
  logoSub: {
    fontSize: 18,
    fontFamily: 'SpaceMono_700Bold',
    color: '#E2A93E',
  },
});

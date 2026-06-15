import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { FleetHeader } from '@/components/FleetHeader';
import { FleetLoader, FleetLoadingBar } from '@/components/FleetLoader';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DrawerProvider, useDrawer } from '@/context/DrawerContext';
import { NavigationDrawerContent } from '@/components/NavigationDrawerContent';

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="dashboard">
        <Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} />
        <Label>Fleet</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tractors">
        <Icon sf={{ default: 'car', selected: 'car.fill' }} />
        <Label>Tractors</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="complaints">
        <Icon sf={{ default: 'exclamationmark.triangle', selected: 'exclamationmark.triangle.fill' }} />
        <Label>Complaints</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="runtime">
        <Icon sf={{ default: 'building.2', selected: 'building.2.fill' }} />
        <Label>Plants</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="reports">
        <Icon sf={{ default: 'doc.text', selected: 'doc.text.fill' }} />
        <Label>Reports</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabsLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: 'Inter_700Bold', fontSize: 17 },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: isIOS ? 'transparent' : colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            shadowColor: colors.shadowStrong,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            ...(isWeb ? { height: 84 } : {}),
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 10,
            letterSpacing: 0.2,
          },
          tabBarItemStyle: {
            paddingTop: 4,
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={95}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
            ) : isWeb ? (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} />
            ) : null,
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Fleet Overview',
            tabBarLabel: 'Fleet',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="square.grid.2x2" tintColor={color} size={22} />
              ) : (
                <Feather name="grid" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="tractors"
          options={{
            title: 'All Tractors',
            tabBarLabel: 'Tractors',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="car" tintColor={color} size={22} />
              ) : (
                <Feather name="truck" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="complaints"
          options={{
            title: 'Complaints',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="exclamationmark.triangle" tintColor={color} size={22} />
              ) : (
                <Feather name="alert-triangle" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="runtime"
          options={{
            title: 'Plant Analysis',
            tabBarLabel: 'Plants',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="building.2" tintColor={color} size={22} />
              ) : (
                <Feather name="home" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="doc.text" tintColor={color} size={22} />
              ) : (
                <Feather name="file-text" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            href: null,
          }}
        />
      </Tabs>
  );
}

const { width: screenWidth } = Dimensions.get('window');

function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const colors = useColors();
  const {
    isLoading,
    isLoadingMorePlants,
    loadingMessage,
    plants,
    loadedPlantIDs,
    organization,
  } = useApp();

  const { isDrawerOpen, closeDrawer } = useDrawer();
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Intercept Android hardware back when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return;

    const onBackPress = () => {
      closeDrawer();
      if (!pathname.includes('dashboard')) {
        router.push('/(main)/dashboard');
      }
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isDrawerOpen, closeDrawer, pathname, router]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isDrawerOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // Set to false to support borderRadius/scale animations on all devices
    }).start();
  }, [isDrawerOpen]);

  const drawerWidth = Math.min(320, screenWidth * 0.78);

  const drawerTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [drawerWidth, 0],
  });

  const contentTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -drawerWidth],
  });

  const contentScale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const contentBorderRadius = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  const dimOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const plantProgress =
    plants.length > 0 ? loadedPlantIDs.length / plants.length : undefined;

  return (
    <View
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
    >
      {/* ── Side Drawer Panel ── */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            width: drawerWidth,
            transform: [{ translateX: drawerTranslateX }],
          },
        ]}
      >
        <NavigationDrawerContent />
      </Animated.View>

      {/* ── Main Shiftable & Scalable Content View ── */}
      <Animated.View
        style={[
          styles.mainContentContainer,
          {
            transform: [{ translateX: contentTranslateX }, { scale: contentScale }],
            borderRadius: contentBorderRadius,
            backgroundColor: colors.background,
          },
        ]}
      >
        {!pathname.endsWith('/profile') && <FleetHeader />}
        <FleetLoadingBar
          visible={isLoadingMorePlants && !isLoading}
          loaded={loadedPlantIDs.length}
          total={plants.length}
        />
        <View style={{ flex: 1 }}>{children}</View>

        {/* Dimming overlay when drawer is open */}
        {isDrawerOpen && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeDrawer}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: '#000000',
                  opacity: dimOpacity,
                },
              ]}
            />
          </Pressable>
        )}
      </Animated.View>

      <FleetLoader
        visible={isLoading}
        title={organization?.name ? `Loading ${organization.name}` : 'Loading fleet'}
        message={loadingMessage}
        progress={plantProgress}
        progressLabel={
          plants.length > 0
            ? `${loadedPlantIDs.length} of ${plants.length} plants ready`
            : undefined
        }
      />
    </View>
  );
}

export default function MainLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  const tabs = isLiquidGlassAvailable() ? <NativeTabsLayout /> : <ClassicTabsLayout />;
  return (
    <DrawerProvider>
      <MainShell>{tabs}</MainShell>
    </DrawerProvider>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  mainContentContainer: {
    flex: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
});

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs, useRouter } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

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
        <Icon sf={{ default: 'clock', selected: 'clock.fill' }} />
        <Label>Runtime</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ai">
        <Icon sf={{ default: 'sparkles', selected: 'sparkles' }} />
        <Label>AI</Label>
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 17 },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: isIOS ? 'transparent' : colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            ...(isWeb ? { height: 84 } : {}),
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter_500Medium',
            fontSize: 11,
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={80}
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
            title: 'Runtime',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="clock" tintColor={color} size={22} />
              ) : (
                <Feather name="clock" size={20} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="ai"
          options={{
            title: 'AI Insights',
            tabBarLabel: 'AI',
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="sparkles" tintColor={color} size={22} />
              ) : (
                <Feather name="cpu" size={20} color={color} />
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
      </Tabs>
  );
}

export default function MainLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabsLayout />;
  return <ClassicTabsLayout />;
}

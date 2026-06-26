import { Feather } from "@expo/vector-icons";
import { reloadAppAsync } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

export type ErrorFallbackProps = {
  error: Error;
  resetError: () => void;
};

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [showDetails, setShowDetails] = useState(false);

  const handleRestart = async () => {
    try {
      await reloadAppAsync();
    } catch {
      resetError();
    }
  };

  const monoFont = Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  });

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      {/* Subtle gradient accent at top */}
      <LinearGradient
        colors={[c.primary + "22", "transparent"]}
        style={styles.topGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        pointerEvents="none"
      />

      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconOuter, { backgroundColor: c.redSoft, borderColor: c.redBorder }]}>
          <View style={[styles.iconInner, { backgroundColor: c.red + "14" }]}>
            <Feather name="alert-octagon" size={36} color={c.red} />
          </View>
        </View>

        {/* Text */}
        <Text style={[styles.title, { color: c.foreground }]}>Something went wrong</Text>
        <Text style={[styles.message, { color: c.mutedForeground }]}>
          An unexpected error occurred. You can try reloading the app — your fleet data will
          sync again automatically.
        </Text>

        {/* Error preview */}
        <View style={[styles.errorPreview, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <View style={styles.errorPreviewHeader}>
            <Feather name="code" size={13} color={c.mutedForeground} />
            <Text style={[styles.errorPreviewLabel, { color: c.mutedForeground }]}>Error</Text>
          </View>
          <Text
            style={[styles.errorMessage, { color: c.foreground, fontFamily: monoFont }]}
            numberOfLines={3}
          >
            {error.message}
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: c.primary, shadowColor: c.primary }]}
          onPress={handleRestart}
          activeOpacity={0.85}
        >
          <Feather name="refresh-cw" size={18} color={c.primaryForeground} />
          <Text style={[styles.primaryBtnText, { color: c.primaryForeground }]}>
            Reload App
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: c.surfaceAlt, borderColor: c.border }]}
          onPress={resetError}
          activeOpacity={0.8}
        >
          <Text style={[styles.secondaryBtnText, { color: c.foreground }]}>Try without reload</Text>
        </TouchableOpacity>

        {__DEV__ ? (
          <TouchableOpacity
            style={styles.detailsLink}
            onPress={() => setShowDetails(true)}
            activeOpacity={0.7}
          >
            <Feather name="terminal" size={13} color={c.mutedForeground} />
            <Text style={[styles.detailsLinkText, { color: c.mutedForeground }]}>
              View stack trace
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Dev stack trace modal */}
      {__DEV__ ? (
        <Modal
          visible={showDetails}
          animationType="slide"
          transparent
          onRequestClose={() => setShowDetails(false)}
        >
          <Pressable style={styles.overlay} onPress={() => setShowDetails(false)}>
            <Pressable
              style={[
                styles.detailSheet,
                { backgroundColor: c.card, borderColor: c.border, paddingBottom: insets.bottom + 16 },
              ]}
              onPress={e => e.stopPropagation()}
            >
              <View style={[styles.sheetHandle, { backgroundColor: c.border }]} />
              <View style={[styles.sheetHeader, { borderBottomColor: c.hairline }]}>
                <View style={[styles.sheetIcon, { backgroundColor: c.red + "12" }]}>
                  <Feather name="terminal" size={18} color={c.red} />
                </View>
                <Text style={[styles.sheetTitle, { color: c.foreground }]}>Stack Trace</Text>
                <TouchableOpacity
                  onPress={() => setShowDetails(false)}
                  style={[styles.sheetClose, { backgroundColor: c.surfaceAlt }]}
                  hitSlop={8}
                >
                  <Feather name="x" size={18} color={c.foreground} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[
                  styles.sheetContent,
                  { paddingBottom: insets.bottom + 16 },
                ]}
                showsVerticalScrollIndicator
              >
                <View style={[styles.stackWrap, { backgroundColor: c.foreground + "08", borderColor: c.border }]}>
                  <Text
                    style={[styles.stackText, { color: c.foreground, fontFamily: monoFont }]}
                    selectable
                  >
                    {`${error.message}\n\n${error.stack ?? ""}`}
                  </Text>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 16,
  },
  iconOuter: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconInner: {
    width: 76,
    height: 76,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 320,
  },
  errorPreview: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    marginTop: 4,
  },
  errorPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  errorPreviewLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  errorMessage: {
    fontSize: 12,
    lineHeight: 18,
  },
  primaryBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.2,
  },
  secondaryBtn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  detailsLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  detailsLinkText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(8, 16, 43, 0.55)",
    justifyContent: "flex-end",
  },
  detailSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    height: "80%",
    paddingTop: 8,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  sheetIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContent: {
    padding: 16,
  },
  stackWrap: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  stackText: {
    fontSize: 11,
    lineHeight: 18,
  },
});

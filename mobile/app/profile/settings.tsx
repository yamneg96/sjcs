import React, { useState } from "react";
import { View, ScrollView, Pressable, Switch, Alert } from "react-native";
import { router } from "expo-router";
import { useTheme } from "@/hooks/use-theme";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { BottomSheet, SheetOptions, ConfirmSheet } from "@/components/ui/sheet";
import { listDecks } from "@/modules/flashcards/flashcards.service";
import * as modelManager from "@/modules/ai/manager/model-manager";
import {
  MoonIcon,
  LanguagesIcon,
  BellIcon,
  CpuIcon,
  HardDriveIcon,
  ChevronRightIcon,
} from "lucide-react-native";

/**
 * Settings (progress&profile/settings). The theme + language pickers are the
 * shared BottomSheet, not separate screens.
 */

type Language = "en" | "am";
type Theme = "light" | "dark" | "system";

function Row({
  icon: Icon,
  label,
  value,
  onPress,
  right,
}: {
  icon: typeof MoonIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  const content = (
    <View className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-2">
      <View className="bg-primary/10 p-2.5 rounded-xl">
        <Icon className="text-primary size-4" />
      </View>
      <Text className="text-sm font-semibold text-foreground flex-1">{label}</Text>
      {value ? <Text className="text-xs text-muted-foreground mr-1">{value}</Text> : null}
      {right ?? (onPress ? <ChevronRightIcon className="text-muted-foreground size-4" /> : null)}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}

export default function Settings() {
  const { colorScheme, preference, setTheme } = useTheme();
  const [language, setLanguage] = useState<Language>("en");
  const [notifications, setNotifications] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);

  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  /** Frees the biggest thing on the device: downloaded models. */
  const clearModels = async () => {
    const installed = await modelManager.listInstalled();
    for (const m of installed) await modelManager.removeModel(m.id);
    const decks = await listDecks();
    Alert.alert(
      "Storage freed",
      `Removed ${installed.length} model${installed.length === 1 ? "" : "s"}. Your ${decks.length} flashcard deck${decks.length === 1 ? "" : "s"} were kept.`
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Settings" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Appearance
        </Text>
        <Row
          icon={MoonIcon}
          label="Theme"
          value={colorScheme === "dark" ? "Dark" : "Light"}
          onPress={() => setThemeOpen(true)}
        />
        <Row
          icon={LanguagesIcon}
          label="Language"
          value={language === "am" ? "አማርኛ" : "English"}
          onPress={() => setLangOpen(true)}
        />

        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-5 mb-2">
          Notifications
        </Text>
        <Row
          icon={BellIcon}
          label="Result & appeal alerts"
          right={<Switch value={notifications} onValueChange={setNotifications} />}
        />

        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-5 mb-2">
          Offline AI
        </Text>
        <Row
          icon={CpuIcon}
          label="AI models"
          value="Manage"
          onPress={() => router.push("/models" as never)}
        />
        <Row
          icon={HardDriveIcon}
          label="Download on Wi-Fi only"
          right={<Switch value={wifiOnly} onValueChange={setWifiOnly} />}
        />
        <Pressable onPress={() => setConfirmClear(true)}>
          <View className="bg-card border border-border/40 rounded-2xl p-4">
            <Text className="text-sm font-semibold text-destructive">Free up storage</Text>
            <Text className="text-[11px] text-muted-foreground mt-0.5">
              Removes downloaded AI models. Your notes, decks and progress are kept.
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      <BottomSheet visible={themeOpen} onClose={() => setThemeOpen(false)} title="Theme">
        <SheetOptions<Theme>
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "system", label: "Match device" },
          ]}
          selected={(preference as Theme) ?? "system"}
          onSelect={(v) => {
            setTheme(v);
            setThemeOpen(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        visible={langOpen}
        onClose={() => setLangOpen(false)}
        title="Language"
        subtitle="Used for the app and AI answers"
      >
        <SheetOptions<Language>
          options={[
            { value: "en", label: "English" },
            { value: "am", label: "አማርኛ (Amharic)" },
          ]}
          selected={language}
          onSelect={(v) => {
            setLanguage(v);
            setLangOpen(false);
          }}
        />
      </BottomSheet>

      <ConfirmSheet
        visible={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Free up storage?"
        body="Downloaded AI models will be removed. Offline AI stops working until you download again — your flashcards and progress are untouched."
        confirmLabel="Remove models"
        destructive
        onConfirm={clearModels}
      />
    </View>
  );
}

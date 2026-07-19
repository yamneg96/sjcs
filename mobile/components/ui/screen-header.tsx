import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Text } from "./text";
import { Button } from "./button";
import { ArrowLeftIcon } from "lucide-react-native";

/**
 * The standard stack-screen header (back + title + optional subtitle/action).
 * Every non-tab screen uses this so the back affordance and spacing are
 * identical across the app.
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
  onBack,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
      <Button variant="ghost" size="icon" onPress={onBack ?? (() => router.back())}>
        <ArrowLeftIcon className="text-foreground size-5" />
      </Button>
      <View className="flex-1">
        <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

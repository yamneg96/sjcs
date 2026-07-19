import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "./text";
import { Button } from "./button";
import { GradientButton } from "./gradient-button";
import type { LucideIcon } from "lucide-react-native";
import { WifiOffIcon, AlertTriangleIcon } from "lucide-react-native";

/**
 * Shared screen states (the loading / empty / error designs).
 *
 * These exist once, as components, rather than as ~20 separate screens: an
 * "empty" state is a state of a screen, not a destination. Every list/detail
 * screen composes these so the copy and spacing stay consistent.
 */

/** Full-screen spinner with an optional label. */
export function LoadingState({ label }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator />
      {label ? <Text className="text-xs text-muted-foreground mt-3">{label}</Text> : null}
    </View>
  );
}

/** "AI is thinking" — used wherever a model call is in flight. */
export function ThinkingState({ label = "Thinking…" }: { label?: string }) {
  return (
    <View className="flex-row items-center gap-2 py-2">
      <ActivityIndicator size="small" />
      <Text className="text-xs text-muted-foreground italic">{label}</Text>
    </View>
  );
}

/**
 * Empty state: an icon, a plain-language explanation, and (ideally) the action
 * that resolves it. Never a dead end.
 */
export function EmptyState({
  icon: Icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <Icon size={56} className="text-muted-foreground/60 mb-3" />
      <Text className="text-base font-bold text-foreground text-center mb-1">{title}</Text>
      <Text className="text-sm text-muted-foreground text-center">{body}</Text>
      {actionLabel && onAction ? (
        <GradientButton className="h-11 px-6 mt-5" onPress={onAction}>
          <Text className="text-white font-semibold text-sm">{actionLabel}</Text>
        </GradientButton>
      ) : null}
    </View>
  );
}

/** Error state with a retry affordance. */
export function ErrorState({
  title = "Something went wrong",
  body,
  onRetry,
}: {
  title?: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <AlertTriangleIcon size={48} className="text-destructive/70 mb-3" />
      <Text className="text-base font-bold text-foreground text-center mb-1">{title}</Text>
      <Text className="text-sm text-muted-foreground text-center">{body}</Text>
      {onRetry ? (
        <Button variant="outline" className="h-11 rounded-xl px-6 mt-5" onPress={onRetry}>
          <Text className="text-sm font-semibold">Try again</Text>
        </Button>
      ) : null}
    </View>
  );
}

/**
 * Offline state. Deliberately names what STILL works — connectivity narrows the
 * app, it never breaks it (§4.4).
 */
export function OfflineState({
  body = "You're offline. Downloaded lessons, flashcards and saved quizzes still work.",
  onRetry,
}: {
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <WifiOffIcon size={48} className="text-muted-foreground/60 mb-3" />
      <Text className="text-base font-bold text-foreground text-center mb-1">No connection</Text>
      <Text className="text-sm text-muted-foreground text-center">{body}</Text>
      {onRetry ? (
        <Button variant="outline" className="h-11 rounded-xl px-6 mt-5" onPress={onRetry}>
          <Text className="text-sm font-semibold">Retry</Text>
        </Button>
      ) : null}
    </View>
  );
}

/** Success panel used after a completed action (quiz done, cards generated…). */
export function SuccessState({
  icon: Icon,
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-8">
      <Icon size={64} className="text-chart-3 mb-3" />
      <Text className="text-xl font-bold text-foreground text-center mb-1">{title}</Text>
      <Text className="text-sm text-muted-foreground text-center mb-6">{body}</Text>
      <View className="flex-row gap-2">
        {secondaryLabel && onSecondary ? (
          <Button variant="outline" className="h-11 rounded-xl px-5" onPress={onSecondary}>
            <Text className="text-sm font-semibold">{secondaryLabel}</Text>
          </Button>
        ) : null}
        {primaryLabel && onPrimary ? (
          <GradientButton className="h-11 px-5" onPress={onPrimary}>
            <Text className="text-white font-semibold text-sm">{primaryLabel}</Text>
          </GradientButton>
        ) : null}
      </View>
    </View>
  );
}

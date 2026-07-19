import React from "react";
import { View, Modal, Pressable, ScrollView } from "react-native";
import { Text } from "./text";
import { Button } from "./button";
import { GradientButton } from "./gradient-button";
import { CheckIcon } from "lucide-react-native";

/**
 * Bottom sheet + confirmation primitives.
 *
 * The design set has ~11 bottom sheets (subject/grade/theme/language pickers,
 * quiz settings, confirmations…). They're all the same two shapes, so they live
 * here once and take their content as props rather than becoming 11 screens.
 */

export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Tapping the scrim dismisses — expected on Android + iOS alike. */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="bg-card rounded-t-3xl p-5 pb-8 max-h-[75%]">
        <View className="items-center mb-4">
          <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </View>
        <Text className="text-base font-bold text-foreground">{title}</Text>
        {subtitle ? (
          <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>
        ) : null}
        <ScrollView className="mt-4">{children}</ScrollView>
      </View>
    </Modal>
  );
}

export interface SheetOption<T> {
  value: T;
  label: string;
  hint?: string;
}

/** A single-select list — the shape behind every picker sheet in the designs. */
export function SheetOptions<T extends string | number>({
  options,
  selected,
  onSelect,
}: {
  options: SheetOption<T>[];
  selected?: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View className="gap-1">
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => onSelect(opt.value)}
            className={`flex-row items-center justify-between p-4 rounded-2xl ${
              active ? "bg-primary/10" : ""
            }`}
          >
            <View className="flex-1">
              <Text className={`text-sm ${active ? "font-bold text-primary" : "text-foreground"}`}>
                {opt.label}
              </Text>
              {opt.hint ? (
                <Text className="text-[11px] text-muted-foreground mt-0.5">{opt.hint}</Text>
              ) : null}
            </View>
            {active ? <CheckIcon size={16} className="text-primary" /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Confirmation sheet (delete chat, log out, bookmark…). Destructive actions get
 * a destructive-styled confirm so the consequence is legible before tapping.
 */
export function ConfirmSheet({
  visible,
  onClose,
  title,
  body,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  body: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40 items-center justify-center p-8" onPress={onClose}>
        {/* Stop propagation so taps inside the card don't dismiss it. */}
        <Pressable className="bg-card rounded-3xl p-6 w-full" onPress={() => {}}>
          <Text className="text-base font-bold text-foreground mb-1">{title}</Text>
          <Text className="text-sm text-muted-foreground mb-5">{body}</Text>
          <View className="flex-row gap-2">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onPress={onClose}>
              <Text className="text-sm font-semibold">Cancel</Text>
            </Button>
            {destructive ? (
              // Destructive actions stay solid red so the consequence reads clearly.
              <Button
                className="flex-1 h-11 rounded-xl bg-destructive"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Text className="text-sm font-semibold text-white">{confirmLabel}</Text>
              </Button>
            ) : (
              <GradientButton
                className="flex-1 h-11"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Text className="text-sm font-semibold text-white">{confirmLabel}</Text>
              </GradientButton>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

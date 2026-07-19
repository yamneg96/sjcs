import React from "react";
import { Pressable, View, StyleSheet, type PressableProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { LEADERSHIP_GRADIENT, GRADIENT_DIRECTION } from "@/lib/gradient";

/**
 * Primary CTA rendered with the Leadership Gradient (red → blue). A drop-in for
 * the app's `<Button className="bg-primary">` pattern: pass sizing via
 * `className` (e.g. "h-12 rounded-xl") and put a <Text> inside — child text
 * defaults to white/semibold via TextClassContext, so callers rarely need to
 * style it.
 *
 * Implementation note: the gradient is an absolutely-filled layer behind the
 * content, so the Pressable keeps its normal layout box (height from className)
 * and `overflow-hidden` clips the gradient to the rounded corners.
 */
export type GradientButtonProps = Omit<PressableProps, "children"> & {
  className?: string;
  children?: React.ReactNode;
};

export function GradientButton({ className, disabled, children, ...props }: GradientButtonProps) {
  return (
    <TextClassContext.Provider value="text-white text-sm font-semibold">
      <Pressable
        role="button"
        disabled={disabled}
        className={cn(
          "flex-row items-center justify-center gap-2 overflow-hidden rounded-xl active:opacity-90",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <LinearGradient
          colors={LEADERSHIP_GRADIENT}
          start={GRADIENT_DIRECTION.start}
          end={GRADIENT_DIRECTION.end}
          style={StyleSheet.absoluteFill}
        />
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

/**
 * Non-interactive gradient surface — hero cards, banners. Same gradient, just a
 * <View> wrapper. Children render above the gradient.
 */
export function GradientView({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View className={cn("overflow-hidden", className)} {...props}>
      <LinearGradient
        colors={LEADERSHIP_GRADIENT}
        start={GRADIENT_DIRECTION.start}
        end={GRADIENT_DIRECTION.end}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

import { StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { LinearGradient } from "expo-linear-gradient";
import { SunIcon, MoonIcon } from "lucide-react-native";
import { LEADERSHIP_GRADIENT, GRADIENT_DIRECTION } from "@/lib/gradient";
import { useTheme } from "@/hooks/use-theme";

const SIZE = 52;
const MARGIN = 10;

/**
 * A floating, draggable theme toggle mounted in the root layout so it rides
 * over every screen. Drag it anywhere (it clamps to the screen and snaps back
 * inside on release); tap it to flip light ⇄ dark, which rewrites the
 * NativeWind color variables defined in global.css app-wide.
 *
 * Drag vs tap are disambiguated by gesture composition: the pan only activates
 * after ~8px of movement, so a stationary press is unambiguously a tap.
 */
export function ThemeToggleFab() {
  const { width, height } = useWindowDimensions();
  const { isDark, toggle } = useTheme();

  // Start bottom-right, comfortably above the tab bar.
  const posX = useSharedValue(width - SIZE - MARGIN - 6);
  const posY = useSharedValue(height - SIZE - 120);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const pressed = useSharedValue(0);

  const clamp = (v: number, min: number, max: number) => {
    "worklet";
    return Math.max(min, Math.min(max, v));
  };

  const pan = Gesture.Pan()
    .minDistance(8)
    .onStart(() => {
      startX.value = posX.value;
      startY.value = posY.value;
      pressed.value = withSpring(1);
    })
    .onUpdate((e) => {
      posX.value = clamp(startX.value + e.translationX, MARGIN, width - SIZE - MARGIN);
      posY.value = clamp(startY.value + e.translationY, MARGIN + 40, height - SIZE - MARGIN);
    })
    .onEnd(() => {
      // Ease fully inside the safe bounds if a fling left it on the edge.
      posX.value = withSpring(clamp(posX.value, MARGIN, width - SIZE - MARGIN));
      posY.value = withSpring(clamp(posY.value, MARGIN + 40, height - SIZE - MARGIN));
      pressed.value = withSpring(0);
    });

  const tap = Gesture.Tap().onEnd(() => {
    // Hop to the JS thread to run the React state update (worklets run on UI).
    scheduleOnRN(toggle);
  });

  // Pan takes priority; a no-movement press falls through to the tap.
  const gesture = Gesture.Exclusive(pan, tap);

  const style = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
    transform: [{ scale: 1 + pressed.value * 0.08 }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.fab, style]} accessibilityRole="button" accessibilityLabel="Toggle light or dark theme">
        <LinearGradient
          colors={LEADERSHIP_GRADIENT}
          start={GRADIENT_DIRECTION.start}
          end={GRADIENT_DIRECTION.end}
          style={StyleSheet.absoluteFill}
        />
        {isDark ? <SunIcon size={22} color="#fff" /> : <MoonIcon size={22} color="#fff" />}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    zIndex: 1000,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});

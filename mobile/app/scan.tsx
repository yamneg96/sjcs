import React, { useRef, useState } from "react";
import { View, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  solveCapturedWork,
  isOcrSupported,
  type StructuredDocument,
} from "@/modules/ai/pipelines/ocr.pipeline";
import type { AIRoute } from "@/modules/ai/types";
import {
  ArrowLeftIcon,
  CameraIcon,
  ScanTextIcon,
  SmartphoneIcon,
  CloudIcon,
  RotateCcwIcon,
} from "lucide-react-native";

/**
 * Smart Scanner (§43) — camera → on-device OCR → AI explanation.
 * Text extraction runs entirely on-device (works offline); only the extracted
 * text may go to cloud AI, and the UI says so.
 */
export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const [busy, setBusy] = useState(false);
  const [doc, setDoc] = useState<StructuredDocument | null>(null);
  const [answer, setAnswer] = useState<{ text: string; route: AIRoute } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supported = isOcrSupported();

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    setBusy(true);
    setError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) throw new Error("Couldn't capture the photo. Try again.");

      const { document, answer: result } = await solveCapturedWork(photo.uri);
      setDoc(document);
      setAnswer({ text: result.text, route: result.route });
    } catch (err: any) {
      setError(err?.message || "Something went wrong while scanning.");
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setDoc(null);
    setAnswer(null);
    setError(null);
  };

  // ── Permission gate ───────────────────────────────────────
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-8">
        <CameraIcon size={56} className="text-muted-foreground mb-4" />
        <Text className="text-lg font-bold text-foreground text-center mb-2">
          Camera access needed
        </Text>
        <Text className="text-sm text-muted-foreground text-center mb-6">
          Lumora scans your homework on your device — the photo never leaves your phone.
        </Text>
        <Button className="h-12 rounded-xl bg-primary px-6" onPress={requestPermission}>
          <Text className="text-primary-foreground font-semibold">Allow camera</Text>
        </Button>
        <Button variant="ghost" className="mt-3" onPress={() => router.back()}>
          <Text className="text-muted-foreground text-sm">Not now</Text>
        </Button>
      </View>
    );
  }

  if (!supported) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-8">
        <ScanTextIcon size={56} className="text-muted-foreground mb-4" />
        <Text className="text-lg font-bold text-foreground text-center mb-2">
          Scanner unavailable
        </Text>
        <Text className="text-sm text-muted-foreground text-center">
          On-device text recognition isn&apos;t included in this build. It requires a
          development or production build (not Expo Go).
        </Text>
        <Button variant="outline" className="mt-6 rounded-xl" onPress={() => router.back()}>
          <Text className="text-sm font-semibold">Go back</Text>
        </Button>
      </View>
    );
  }

  // ── Result view ───────────────────────────────────────────
  if (doc || error) {
    return (
      <View className="flex-1 bg-background">
        <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
          <Button variant="ghost" size="icon" onPress={() => router.back()}>
            <ArrowLeftIcon className="text-foreground size-5" />
          </Button>
          <Text className="text-lg font-bold text-foreground flex-1">Scan result</Text>
          <Button variant="ghost" size="icon" onPress={reset}>
            <RotateCcwIcon className="text-foreground size-5" />
          </Button>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {error ? (
            <View className="bg-destructive/10 p-4 rounded-2xl">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          ) : (
            <>
              <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Extracted on this device
              </Text>
              <View className="bg-card border border-border/40 p-4 rounded-2xl mb-5">
                <Text className="text-sm text-foreground">{doc?.fullText}</Text>
                {doc?.hasMathRegions && (
                  <Text className="text-[11px] text-secondary mt-2 font-semibold">
                    Detected a maths problem
                  </Text>
                )}
              </View>

              {answer && (
                <>
                  <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Explanation
                  </Text>
                  <View className="bg-secondary/10 p-4 rounded-2xl">
                    <Text className="text-sm text-foreground">{answer.text}</Text>
                    {answer.route !== "fallback" && (
                      <View className="flex-row items-center gap-1 mt-3">
                        {answer.route === "local" ? (
                          <SmartphoneIcon size={11} className="text-muted-foreground" />
                        ) : (
                          <CloudIcon size={11} className="text-muted-foreground" />
                        )}
                        <Text className="text-[10px] text-muted-foreground">
                          {answer.route === "local"
                            ? "Answered on-device"
                            : "Text sent to cloud AI for this answer"}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              )}
            </>
          )}

          <Button className="h-12 rounded-xl bg-primary mt-6" onPress={reset}>
            <Text className="text-primary-foreground font-semibold">Scan another</Text>
          </Button>
        </ScrollView>
      </View>
    );
  }

  // ── Camera view ───────────────────────────────────────────
  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

      <View className="absolute top-14 left-4">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <ArrowLeftIcon color="#fff" size={22} />
        </Button>
      </View>

      <View className="absolute bottom-0 left-0 right-0 p-8 items-center">
        <Text className="text-white/80 text-xs text-center mb-4">
          Fit the question in frame. Text is read on your device — the photo never leaves
          your phone.
        </Text>
        <Pressable
          onPress={capture}
          disabled={busy}
          className="size-20 rounded-full bg-white items-center justify-center"
        >
          {busy ? (
            <ActivityIndicator color="#000" />
          ) : (
            <ScanTextIcon size={28} color="#000" />
          )}
        </Pressable>
        {busy && <Text className="text-white/80 text-xs mt-3">Reading the page…</Text>}
      </View>
    </View>
  );
}

import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator, Pressable, TextInput } from "react-native";
import { router } from "expo-router";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  transcribe,
  ask,
  speak,
  stopSpeaking,
  VoiceOfflineError,
  type VoiceLanguage,
} from "@/modules/ai/pipelines/voice.pipeline";
import type { AIRoute } from "@/modules/ai/types";
import {
  ArrowLeftIcon,
  MicIcon,
  SquareIcon,
  Volume2Icon,
  SendIcon,
  SmartphoneIcon,
  CloudIcon,
} from "lucide-react-native";

/**
 * Voice Tutor (§44) — push-to-talk. The transcript is always shown and
 * editable before it's sent, so ASR errors are recoverable.
 */
export default function VoiceScreen() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [language, setLanguage] = useState<VoiceLanguage>("en");
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState<{ text: string; route: AIRoute } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    setError(null);
    setAnswer(null);
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        setError("Microphone access is needed for voice tutoring.");
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch {
      setError("Couldn't start recording. Please try again.");
    }
  };

  const stopAndTranscribe = async () => {
    setRecording(false);
    setThinking(true);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error("No audio was captured. Try holding the button longer.");

      const text = await transcribe(uri, language);
      setTranscript(text);
    } catch (err: any) {
      setError(
        err instanceof VoiceOfflineError
          ? err.message
          : err?.message || "Couldn't transcribe that. Please try again."
      );
    } finally {
      setThinking(false);
    }
  };

  // The transcript is only sent once the student is happy with it.
  const sendTranscript = async () => {
    if (!transcript.trim() || thinking) return;
    setThinking(true);
    setError(null);
    try {
      const result = await ask(transcript.trim());
      setAnswer({ text: result.text, route: result.route });
      speak(result.text, language);
    } catch (err: any) {
      setError(err?.message || "Couldn't get an answer. Please try again.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-14 pb-4 px-4 bg-card border-b border-border/40 flex-row items-center gap-3">
        <Button variant="ghost" size="icon" onPress={() => { stopSpeaking(); router.back(); }}>
          <ArrowLeftIcon className="text-foreground size-5" />
        </Button>
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">Voice Tutor</Text>
          <Text className="text-[11px] text-muted-foreground">
            Needs internet · speak English or Amharic
          </Text>
        </View>
        {/* Language selector — Amharic is first-class (§4.4) */}
        <View className="flex-row gap-1">
          {(["en", "am"] as VoiceLanguage[]).map((l) => (
            <Button
              key={l}
              variant={language === l ? "default" : "outline"}
              className="h-8 px-3 rounded-lg"
              onPress={() => setLanguage(l)}
            >
              <Text className="text-[11px] font-bold uppercase">{l}</Text>
            </Button>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {error && (
          <View className="bg-destructive/10 p-4 rounded-2xl mb-4">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        )}

        {/* Editable transcript — ASR error recovery (§44) */}
        {transcript ? (
          <View className="mb-5">
            <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              What we heard — edit if needed
            </Text>
            <TextInput
              value={transcript}
              onChangeText={setTranscript}
              multiline
              className="bg-card border border-border/40 rounded-2xl p-4 text-sm text-foreground"
              style={{ minHeight: 80, textAlignVertical: "top" }}
              placeholderTextColor="#888"
            />
            <Button
              className="h-11 rounded-xl bg-primary mt-3 flex-row items-center justify-center gap-2"
              onPress={sendTranscript}
              disabled={thinking || !transcript.trim()}
            >
              <SendIcon size={15} color="#fff" />
              <Text className="text-primary-foreground font-semibold text-sm">Ask this</Text>
            </Button>
          </View>
        ) : null}

        {thinking && (
          <View className="flex-row items-center gap-2 mb-4">
            <ActivityIndicator size="small" />
            <Text className="text-xs text-muted-foreground italic">Working on it…</Text>
          </View>
        )}

        {answer && (
          <View className="bg-secondary/10 p-4 rounded-2xl">
            <Text className="text-sm text-foreground">{answer.text}</Text>
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center gap-1">
                {answer.route === "local" ? (
                  <SmartphoneIcon size={11} className="text-muted-foreground" />
                ) : (
                  <CloudIcon size={11} className="text-muted-foreground" />
                )}
                <Text className="text-[10px] text-muted-foreground">
                  {answer.route === "local" ? "Answered on-device" : "Answered via cloud"}
                </Text>
              </View>
              <Button
                variant="ghost"
                className="h-8 flex-row items-center gap-1.5 px-2"
                onPress={() => speak(answer.text, language)}
              >
                <Volume2Icon size={14} className="text-primary" />
                <Text className="text-[11px] font-semibold text-primary">Replay</Text>
              </Button>
            </View>
          </View>
        )}

        {!transcript && !answer && !thinking && (
          <View className="flex-1 items-center justify-center py-10">
            <MicIcon size={56} className="text-muted-foreground/60 mb-3" />
            <Text className="text-center text-sm text-muted-foreground px-8">
              Hold the button and ask your question out loud. We&apos;ll show what we heard
              so you can fix it before asking.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Push-to-talk */}
      <View className="p-6 items-center border-t border-border/40 bg-card">
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopAndTranscribe}
          disabled={thinking}
          className={`size-20 rounded-full items-center justify-center ${
            recording ? "bg-destructive" : "bg-primary"
          }`}
        >
          {recording ? <SquareIcon size={26} color="#fff" /> : <MicIcon size={28} color="#fff" />}
        </Pressable>
        <Text className="text-[11px] text-muted-foreground mt-3">
          {recording ? "Listening… release to send" : "Hold to speak"}
        </Text>
      </View>
    </View>
  );
}

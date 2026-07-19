import React from "react";
import { View, ScrollView, Linking } from "react-native";
import Constants from "expo-constants";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { BookOpenIcon, ShieldIcon, WifiOffIcon, LanguagesIcon } from "lucide-react-native";

/** About (progress&profile/about_sjcsa). */

function Point({ icon: Icon, title, body }: { icon: typeof ShieldIcon; title: string; body: string }) {
  return (
    <View className="flex-row gap-3 mb-4">
      <View className="bg-primary/10 p-2.5 rounded-xl h-fit">
        <Icon className="text-primary size-4" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground">{title}</Text>
        <Text className="text-xs text-muted-foreground mt-0.5">{body}</Text>
      </View>
    </View>
  );
}

export default function About() {
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="About" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mb-8">
          <View className="bg-primary size-16 rounded-3xl items-center justify-center mb-3">
            <BookOpenIcon size={30} color="#fff" />
          </View>
          <Text className="text-lg font-bold text-foreground">Lumora Tutor</Text>
          <Text className="text-xs text-muted-foreground">Version {version}</Text>
        </View>

        <Text className="text-sm text-foreground leading-6 mb-6">
          Lumora is your curriculum-aligned study companion — a patient tutor that knows your
          grade, your subjects, and what you find hard.
        </Text>

        <Point
          icon={WifiOffIcon}
          title="Works offline"
          body="Download an AI model once on Wi-Fi and keep studying with no connection — flashcards, lessons and quizzes included."
        />
        <Point
          icon={LanguagesIcon}
          title="English and Amharic"
          body="Ask in either language, by text or by voice."
        />
        <Point
          icon={ShieldIcon}
          title="Private by design"
          body="Homework photos are read on your device and never uploaded. Answers from an on-device model never leave your phone."
        />

        <View className="bg-card border border-border/40 rounded-2xl p-4 mt-2">
          <Text className="text-[11px] text-muted-foreground">
            Results shown in Lumora are published by your school. If something looks wrong, use
            &quot;Request review&quot; — a teacher will respond and any change is countersigned by
            the director.
          </Text>
        </View>

        <Button
          variant="outline"
          className="h-11 rounded-xl mt-6"
          onPress={() => Linking.openURL("mailto:support@lumora.et")}
        >
          <Text className="text-sm font-semibold">Contact support</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

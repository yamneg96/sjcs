import React, { useState } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { BrainIcon, WifiOffIcon, AwardIcon, BookOpenIcon } from "lucide-react-native";

/**
 * Welcome + onboarding (auth/welcome_get_started + onboarding_1..3).
 *
 * The three onboarding designs are one paged flow, not three routes — a wizard
 * whose only difference per step is copy shouldn't be three screens.
 */

const SLIDES = [
  {
    icon: BrainIcon,
    title: "A tutor that knows your syllabus",
    body: "Ask anything from your lessons. Lumora answers at your grade level, in English or Amharic — and shows its working instead of just handing you the answer.",
  },
  {
    icon: WifiOffIcon,
    title: "Study without internet",
    body: "Download an AI model once on Wi-Fi. After that, tutoring, quizzes and flashcards keep working with no connection and no data cost.",
  },
  {
    icon: AwardIcon,
    title: "Built for exam season",
    body: "Practise with quizzes from your own chapters, turn your mistakes into flashcards, and see exactly which topics need your time.",
  },
];

export default function Welcome() {
  const [step, setStep] = useState(0);
  const { width } = useWindowDimensions();

  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];
  const Icon = slide.icon;

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }}>
        {/* Brand */}
        <View className="items-center mb-10">
          <View className="bg-primary size-14 rounded-2xl items-center justify-center mb-2">
            <BookOpenIcon size={26} color="#fff" />
          </View>
          <Text className="text-base font-bold text-foreground">Lumora Tutor</Text>
        </View>

        <View className="items-center" style={{ maxWidth: Math.min(width - 48, 420), alignSelf: "center" }}>
          <View className="bg-primary/10 size-24 rounded-3xl items-center justify-center mb-6">
            <Icon size={44} className="text-primary" />
          </View>
          <Text className="text-2xl font-bold text-foreground text-center mb-3">{slide.title}</Text>
          <Text className="text-sm text-muted-foreground text-center leading-6">{slide.body}</Text>
        </View>
      </ScrollView>

      <View className="p-6">
        {/* Progress dots */}
        <View className="flex-row justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${i === step ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
            />
          ))}
        </View>

        <Button
          className="h-12 rounded-xl bg-primary mb-2"
          onPress={() => (isLast ? router.replace("/(auth)/login") : setStep((s) => s + 1))}
        >
          <Text className="text-primary-foreground font-semibold text-sm">
            {isLast ? "Get started" : "Next"}
          </Text>
        </Button>

        <Button variant="ghost" className="h-11" onPress={() => router.replace("/(auth)/login")}>
          <Text className="text-xs text-muted-foreground">
            {isLast ? "I already have an account" : "Skip"}
          </Text>
        </Button>
      </View>
    </View>
  );
}

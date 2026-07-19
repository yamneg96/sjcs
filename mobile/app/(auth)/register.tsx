import React, { useState } from "react";
import { View, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useRegisterIndividual } from "@/hooks/use-auth";
import { MailCheckIcon, BookOpenIcon } from "lucide-react-native";

/**
 * Individual signup (auth/register).
 *
 * This is ONLY for learners who aren't enrolled at a subscribed school —
 * school students already exist as records and activate via the school flow
 * (Activate), they don't self-register.
 */
const GRADES = [9, 10, 11, 12];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState(9);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const register = useRegisterIndividual();

  const submit = () => {
    setError(null);
    if (fullName.trim().length < 2) return setError("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    register.mutate(
      { fullName: fullName.trim(), email: email.trim().toLowerCase(), password, grade },
      {
        onSuccess: () => setDone(true),
        onError: (err: any) => setError(err?.message || "Couldn't create your account."),
      }
    );
  };

  // Post-signup: the account needs email verification before login (§13).
  if (done) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-8">
        <MailCheckIcon size={64} className="text-chart-3 mb-4" />
        <Text className="text-xl font-bold text-foreground text-center mb-2">Check your email</Text>
        <Text className="text-sm text-muted-foreground text-center mb-8">
          We sent a verification link to {email}. Verify it, then sign in to start studying.
        </Text>
        <Button className="h-12 rounded-xl bg-primary px-8" onPress={() => router.replace("/(auth)/login")}>
          <Text className="text-primary-foreground font-semibold text-sm">Go to sign in</Text>
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: "center" }} className="bg-background">
      <View className="items-center mb-8">
        <View className="bg-primary size-14 rounded-2xl items-center justify-center mb-3">
          <BookOpenIcon size={26} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-foreground">Create your account</Text>
        <Text className="text-xs text-muted-foreground text-center mt-1">
          For learners studying on their own
        </Text>
      </View>

      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Full name
      </Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Hanan Bekele"
        placeholderTextColor="#888"
        className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
      />

      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Email
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#888"
        className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
      />

      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secureTextEntry
        placeholderTextColor="#888"
        className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
      />

      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Grade
      </Text>
      <View className="flex-row gap-2 mb-5">
        {GRADES.map((g) => (
          <Button
            key={g}
            variant={grade === g ? "default" : "outline"}
            className="flex-1 h-10 rounded-xl px-0"
            onPress={() => setGrade(g)}
          >
            <Text className="text-xs font-semibold">Grade {g}</Text>
          </Button>
        ))}
      </View>

      {error ? (
        <View className="bg-destructive/10 p-3 rounded-xl mb-4">
          <Text className="text-xs text-destructive">{error}</Text>
        </View>
      ) : null}

      <Button className="h-12 rounded-xl bg-primary" onPress={submit} disabled={register.isPending}>
        {register.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-semibold text-sm">Create account</Text>
        )}
      </Button>

      <Button variant="ghost" className="h-11 mt-2" onPress={() => router.replace("/(auth)/login")}>
        <Text className="text-xs text-muted-foreground">
          At a school using Lumora? Sign in instead
        </Text>
      </Button>
    </ScrollView>
  );
}

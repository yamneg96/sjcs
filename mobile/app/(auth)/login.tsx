import React, { useState } from "react";
import { View, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { GradientButton, GradientView } from "@/components/ui/gradient-button";
import { useLogin } from "@/hooks/use-auth";
import { BookOpenIcon } from "lucide-react-native";

/**
 * Sign in (auth/login) — the backend's /auth/login accepts two shapes (§13.2):
 * a school student (org slug + name + grade + password) or an email account
 * (individual learners, and technically any staff/parent, though those are
 * rejected post-login — see useLogin — since mobile has no UI for them).
 */

type Mode = "student" | "email";
const GRADES = [9, 10, 11, 12];

export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>("student");

  const [orgSlug, setOrgSlug] = useState("sjcs");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState(9);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useLogin();

  const handleLogin = () => {
    setError("");
    if (!password) {
      setError("Enter your password.");
      return;
    }

    const payload =
      mode === "student"
        ? (() => {
            if (!orgSlug.trim() || !fullName.trim()) {
              setError("School, full name and password are required.");
              return null;
            }
            return { orgSlug: orgSlug.trim().toLowerCase(), fullName: fullName.trim(), grade, password };
          })()
        : (() => {
            if (!/^\S+@\S+\.\S+$/.test(email)) {
              setError("Enter a valid email address.");
              return null;
            }
            return { email: email.trim().toLowerCase(), password };
          })();

    if (!payload) return;

    loginMutation.mutate(payload, {
      onSuccess: () => router.replace("/(tabs)" as never),
      onError: (err: any) => setError(err?.message || "Couldn't sign in. Check your details and try again."),
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
      keyboardShouldPersistTaps="handled"
      className="bg-background"
    >
      <View className="items-center mb-8">
        <GradientView className="size-14 rounded-2xl items-center justify-center mb-3">
          <BookOpenIcon size={26} color="#fff" />
        </GradientView>
        <Text className="text-xl font-bold text-foreground">Welcome back</Text>
        <Text className="text-xs text-muted-foreground mt-1">Sign in to keep studying</Text>
      </View>

      {/* Mode toggle */}
      <View className="flex-row bg-muted/40 rounded-xl p-1 mb-5">
        {(["student", "email"] as Mode[]).map((m) => (
          <Button
            key={m}
            variant={mode === m ? "default" : "ghost"}
            className="flex-1 h-10 rounded-lg px-0"
            onPress={() => {
              setMode(m);
              setError("");
            }}
          >
            <Text className={`text-xs font-semibold ${mode === m ? "text-primary-foreground" : "text-muted-foreground"}`}>
              {m === "student" ? "School student" : "Individual"}
            </Text>
          </Button>
        ))}
      </View>

      {mode === "student" ? (
        <>
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            School code
          </Text>
          <TextInput
            value={orgSlug}
            onChangeText={setOrgSlug}
            placeholder="e.g. sjcs"
            autoCapitalize="none"
            placeholderTextColor="#888"
            className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
          />

          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Full name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="As it appears on your school record"
            placeholderTextColor="#888"
            className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
          />

          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Grade
          </Text>
          <View className="flex-row gap-2 mb-4">
            {GRADES.map((g) => (
              <Button
                key={g}
                variant={grade === g ? "default" : "outline"}
                className="flex-1 h-10 rounded-xl px-0"
                onPress={() => setGrade(g)}
              >
                <Text className="text-xs font-semibold">{g}</Text>
              </Button>
            ))}
          </View>
        </>
      ) : (
        <>
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
        </>
      )}

      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
        placeholderTextColor="#888"
        className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-2"
      />

      {error ? (
        <View className="bg-destructive/10 p-3 rounded-xl mb-4 mt-2">
          <Text className="text-xs text-destructive">{error}</Text>
        </View>
      ) : (
        <View className="mb-4" />
      )}

      <GradientButton className="h-12" onPress={handleLogin} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text className="text-white font-semibold text-sm">Sign in</Text>
        )}
      </GradientButton>

      <Button
        variant="ghost"
        className="h-11 mt-2"
        onPress={() => router.push("/(auth)/activate" as never)}
      >
        <Text className="text-xs font-medium text-primary">
          First time signing in as a school student? Activate your account
        </Text>
      </Button>

      {mode === "email" ? (
        <Button variant="ghost" className="h-11" onPress={() => router.push("/(auth)/register" as never)}>
          <Text className="text-xs text-muted-foreground">Don&apos;t have an account? Create one</Text>
        </Button>
      ) : null}
    </ScrollView>
  );
}

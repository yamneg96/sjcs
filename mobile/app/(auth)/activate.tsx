import React, { useState } from "react";
import { View, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useVerifyFirstTime, useSetupPassword } from "@/hooks/use-auth";
import { BookOpenIcon } from "lucide-react-native";

/**
 * First-time student activation (§9.4 first-run bootstrap, auth flow §13.1).
 * Two-step: verify the student record already exists on the school's roster
 * (name + grade + org), then set the password that record didn't have yet.
 * Only for SCHOOL students — individual learners use Register instead.
 */

const GRADES = [9, 10, 11, 12];

export default function ActivateScreen() {
  const [orgSlug, setOrgSlug] = useState("sjcs");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState(9);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState("");

  const verifyMutation = useVerifyFirstTime();
  const setupPasswordMutation = useSetupPassword();

  const handleVerify = () => {
    if (!orgSlug.trim() || !fullName.trim()) {
      setErrorMsg("School code and full name are required.");
      return;
    }
    setErrorMsg("");

    verifyMutation.mutate(
      { orgSlug: orgSlug.trim().toLowerCase(), fullName: fullName.trim(), grade },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            if (res.data.isActivated) {
              setErrorMsg("This account is already active — sign in instead.");
            } else {
              setUserId(res.data.userId);
              setStep(2);
            }
          } else {
            setErrorMsg("Couldn't verify that student record.");
          }
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "No matching student record was found for those details.");
        },
      }
    );
  };

  const handleSetup = () => {
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    setErrorMsg("");

    setupPasswordMutation.mutate(
      { userId, password },
      {
        onSuccess: () => {
          setSuccessMsg("Account activated. Taking you to sign in…");
          setTimeout(() => router.replace("/(auth)/login" as never), 1500);
        },
        onError: (err: any) => {
          setErrorMsg(err?.message || "Couldn't set your password. Please try again.");
        },
      }
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
      keyboardShouldPersistTaps="handled"
      className="bg-background"
    >
      <View className="items-center mb-8">
        <View className="bg-primary size-14 rounded-2xl items-center justify-center mb-3">
          <BookOpenIcon size={26} color="#fff" />
        </View>
        <Text className="text-xl font-bold text-foreground">Activate your account</Text>
        <Text className="text-xs text-muted-foreground mt-1 text-center">
          {step === 1
            ? "First, confirm you're on your school's roster"
            : "Now set the password you'll sign in with"}
        </Text>
      </View>

      {errorMsg ? (
        <View className="bg-destructive/10 p-3 rounded-xl mb-4">
          <Text className="text-xs text-destructive">{errorMsg}</Text>
        </View>
      ) : null}
      {successMsg ? (
        <View className="bg-chart-3/10 p-3 rounded-xl mb-4">
          <Text className="text-xs text-chart-3 font-semibold">{successMsg}</Text>
        </View>
      ) : null}

      {step === 1 ? (
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
          <View className="flex-row gap-2 mb-6">
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

          <Button className="h-12 rounded-xl bg-primary" onPress={handleVerify} disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-sm">Continue</Text>
            )}
          </Button>
        </>
      ) : (
        <>
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            New password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#888"
            className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-4"
          />

          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
            Confirm password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Type it again"
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#888"
            className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-6"
          />

          <Button className="h-12 rounded-xl bg-primary" onPress={handleSetup} disabled={setupPasswordMutation.isPending}>
            {setupPasswordMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-primary-foreground font-semibold text-sm">Activate account</Text>
            )}
          </Button>

          <Button
            variant="ghost"
            className="h-11 mt-2"
            onPress={() => setStep(1)}
            disabled={setupPasswordMutation.isPending}
          >
            <Text className="text-xs text-muted-foreground">Back</Text>
          </Button>
        </>
      )}

      <Button variant="ghost" className="h-11 mt-1" onPress={() => router.replace("/(auth)/login" as never)}>
        <Text className="text-xs text-muted-foreground">Already activated? Sign in</Text>
      </Button>
    </ScrollView>
  );
}

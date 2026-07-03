import React, { useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { useVerifyFirstTime, useSetupPassword } from "@/hooks/use-auth";

export default function ActivateScreen() {
  const [orgSlug, setOrgSlug] = useState("sjcs");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("10");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [userId, setUserId] = useState("");

  const verifyMutation = useVerifyFirstTime();
  const setupPasswordMutation = useSetupPassword();

  const handleVerify = () => {
    if (!orgSlug || !fullName) {
      setErrorMsg("All verification fields are required.");
      return;
    }
    setErrorMsg("");

    verifyMutation.mutate(
      {
        orgSlug: orgSlug.trim().toLowerCase(),
        fullName: fullName.trim(),
        grade: parseInt(grade, 10),
      },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            if (res.data.isActivated) {
              setErrorMsg("Account already activated. Please login instead.");
            } else {
              setUserId(res.data.userId);
              setStep(2);
            }
          } else {
            setErrorMsg("Could not verify student record.");
          }
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Student record not found in system.");
        },
      }
    );
  };

  const handleSetup = () => {
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setErrorMsg("");

    setupPasswordMutation.mutate(
      {
        userId,
        password,
      },
      {
        onSuccess: () => {
          setSuccessMsg("Account activated successfully! Redirecting to login...");
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 2000);
        },
        onError: (err: any) => {
          setErrorMsg(err.message || "Failed to set password. Try again.");
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View className="w-full max-w-sm px-6 py-8 rounded-2xl bg-card shadow-lg border border-border/40">
        <Text className="text-xl font-bold font-headline mb-1 text-foreground text-center">
          First-Time Activation
        </Text>
        <Text className="text-xs text-muted-foreground mb-6 text-center">
          Verify your student profile and configure your security access
        </Text>

        {errorMsg ? (
          <Text className="text-destructive text-xs font-semibold text-center mb-4">
            {errorMsg}
          </Text>
        ) : null}

        {successMsg ? (
          <Text className="text-secondary text-xs font-semibold text-center mb-4">
            {successMsg}
          </Text>
        ) : null}

        {step === 1 ? (
          <View className="space-y-4 gap-4">
            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                School Organization Slug
              </Text>
              <View className="h-12 border border-border rounded-xl px-3 bg-secondary/20 justify-center">
                <Input
                  placeholder="e.g. sjcs"
                  value={orgSlug}
                  onChangeText={setOrgSlug}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                Student Full Name
              </Text>
              <View className="h-12 border border-border rounded-xl px-3 bg-secondary/20 justify-center">
                <Input
                  placeholder="Enter full name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                Grade level
              </Text>
              <View className="flex-row gap-2">
                {["9", "10", "11", "12"].map((g) => (
                  <Button
                    key={g}
                    variant={grade === g ? "default" : "outline"}
                    className="flex-1 px-0 py-2 h-10 rounded-xl"
                    onPress={() => setGrade(g)}
                  >
                    <Text className="text-xs font-semibold">{g}</Text>
                  </Button>
                ))}
              </View>
            </View>

            <Button
              className="h-12 rounded-xl mt-4 bg-primary"
              onPress={handleVerify}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="font-bold text-sm text-primary-foreground uppercase tracking-wide">
                  Verify Student Info
                </Text>
              )}
            </Button>

            <Button
              variant="ghost"
              className="h-10 justify-center rounded-xl"
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text className="text-xs font-medium text-primary">
                Return to Login
              </Text>
            </Button>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                New Password (Min 6 chars)
              </Text>
              <View className="h-12 border border-border rounded-xl px-3 bg-secondary/20 justify-center">
                <Input
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <View>
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
                Confirm Password
              </Text>
              <View className="h-12 border border-border rounded-xl px-3 bg-secondary/20 justify-center">
                <Input
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            <Button
              className="h-12 rounded-xl mt-4 bg-primary"
              onPress={handleSetup}
              disabled={setupPasswordMutation.isPending}
            >
              {setupPasswordMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="font-bold text-sm text-primary-foreground uppercase tracking-wide">
                  Submit Password Setup
                </Text>
              )}
            </Button>

            <Button
              variant="ghost"
              className="h-10 justify-center rounded-xl"
              onPress={() => setStep(1)}
              disabled={setupPasswordMutation.isPending}
            >
              <Text className="text-xs font-medium text-primary">
                Back to Verification
              </Text>
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  input: {
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
});


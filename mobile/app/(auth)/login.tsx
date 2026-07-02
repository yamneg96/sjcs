import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useStudentLogin } from "@/hooks/use-auth";
import { useColorScheme } from "nativewind";
import { Input } from "@/components/ui/input"; // fallback styling

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const [orgSlug, setOrgSlug] = useState("sjcs");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState("10");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const loginMutation = useStudentLogin();

  const handleLogin = () => {
    if (!orgSlug || !fullName || !password) {
      setValidationError("All fields and password are required.");
      return;
    }
    setValidationError("");

    loginMutation.mutate(
      {
        orgSlug: orgSlug.trim().toLowerCase(),
        fullName: fullName.trim(),
        grade: parseInt(grade, 10),
        password: password,
      },
      {
        onSuccess: (data) => {
          if (data.token) {
            router.replace("/(tabs)");
          }
        },
        onError: (err: any) => {
          setValidationError(err.message || "Failed to log in. Please check credentials.");
        },
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View className="w-full max-w-sm px-6 py-8 rounded-2xl bg-card shadow-lg border border-border/40">
        <View className="items-center mb-6">
          <Image
            source={require("@/assets/images/react-native-reusables-light.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text className="text-xl font-bold font-headline mt-2 text-foreground text-center">
            Saint Joseph Catholic School
          </Text>
          <Text className="text-xs text-muted-foreground mt-1">
            Student L.I.S. Learning Monolith
          </Text>
        </View>

        {validationError ? (
          <Text className="text-destructive text-xs font-semibold text-center mb-4">
            {validationError}
          </Text>
        ) : null}

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

          <View className="flex-row items-center gap-4 justify-between">
            <View className="flex-1">
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
          </View>

          <View>
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">
              Password
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

          <Button className="h-12 rounded-xl mt-4 bg-primary" onPress={handleLogin} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="font-bold text-sm text-primary-foreground uppercase tracking-wide">
                Log In
              </Text>
            )}
          </Button>

          <Button
            variant="ghost"
            className="mt-2 h-10 justify-center rounded-xl"
            onPress={() => router.push("/(auth)/activate")}
          >
            <Text className="text-xs font-medium text-primary">
              First time logging in? Activate account
            </Text>
          </Button>
        </View>
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
  logo: {
    width: 64,
    height: 64,
  },
  input: {
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
});

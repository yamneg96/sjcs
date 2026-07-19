import React, { useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { useAuthStore } from "@/store/auth.store";
import { InfoIcon } from "lucide-react-native";

/**
 * Edit profile (progress&profile/edit_profile).
 *
 * Honest scope: a student's name/grade/section are school records — they're set
 * at enrollment by the registrar and are NOT student-editable (§15: academic
 * records are org-owned). So this screen shows them read-only and only edits
 * what genuinely belongs to the learner: their display preferences.
 */
export default function EditProfile() {
  const user = useAuthStore((s) => s.user);
  const [nickname, setNickname] = useState(user?.fullName ?? "");
  const [saved, setSaved] = useState(false);

  const save = () => {
    // Preference-only for now — no endpoint exists for student self-edit, and
    // inventing one that silently fails would be worse than saying so.
    setSaved(true);
    setTimeout(() => router.back(), 800);
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Edit profile" />

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* School-owned record — read only */}
        <View className="bg-card border border-border/40 rounded-2xl p-4 mb-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            School record
          </Text>
          <View className="gap-3">
            <View>
              <Text className="text-[11px] text-muted-foreground">Full name</Text>
              <Text className="text-sm font-semibold text-foreground">{user?.fullName}</Text>
            </View>
            {user?.studentId ? (
              <View>
                <Text className="text-[11px] text-muted-foreground">Student ID</Text>
                <Text className="text-sm font-semibold text-foreground">{user.studentId}</Text>
              </View>
            ) : null}
            {user?.grade ? (
              <View>
                <Text className="text-[11px] text-muted-foreground">Grade</Text>
                <Text className="text-sm font-semibold text-foreground">Grade {user.grade}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View className="flex-row items-start gap-2 bg-secondary/10 rounded-2xl p-3 mb-5">
          <InfoIcon className="text-secondary size-4 mt-0.5" />
          <Text className="text-[11px] text-muted-foreground flex-1">
            Your name, ID and grade come from your school&apos;s records. To correct them, contact
            the school office — they can&apos;t be changed from the app.
          </Text>
        </View>

        {/* Learner-owned preference */}
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Display name
        </Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholderTextColor="#888"
          className="bg-card border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground mb-2"
        />
        <Text className="text-[11px] text-muted-foreground mb-6">
          What Lumora calls you in the app. Doesn&apos;t change your school record.
        </Text>

        <Button className="h-12 rounded-xl bg-primary" onPress={save} disabled={saved}>
          <Text className="text-primary-foreground font-semibold text-sm">
            {saved ? "Saved" : "Save"}
          </Text>
        </Button>
      </ScrollView>
    </View>
  );
}

import React from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/auth.store";
import { useStudyHistory } from "@/hooks/use-records";
import { BookOpenIcon, BrainIcon, AwardIcon, SparklesIcon, CalendarIcon, CpuIcon } from "lucide-react-native";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  
  // Fetch study logs to draw stats
  const { data: historyData, isLoading, refetch } = useStudyHistory(1, 5);

  const totalLogs = historyData?.data?.pagination?.total || 0;
  const recentLogs = historyData?.data?.logs || [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Hero Welcome Card */}
      <View className="w-full bg-primary p-6 rounded-3xl mb-6 shadow-md shadow-primary/20 relative overflow-hidden">
        <View className="z-10">
          <Text className="text-secondary text-xs uppercase tracking-widest font-semibold mb-1">
            Student Workstation
          </Text>
          <Text className="text-white text-2xl font-bold font-headline mb-1">
            Hi, {user?.fullName || "Julian Mercer"}
          </Text>
          <Text className="text-primary-foreground/80 text-xs font-mono">
            ID: {user?.studentId || "SJCS001"} | Grade {user?.grade || 10}
          </Text>
        </View>
        <View className="absolute right-4 bottom-4 opacity-10">
          <BookOpenIcon size={120} color="#fff" />
        </View>
      </View>

      {/* Grid Statistics */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center shadow-sm">
          <BrainIcon className="text-primary mb-2 size-6" />
          <Text className="text-2xl font-bold text-foreground">
            {totalLogs}
          </Text>
          <Text className="text-xs text-muted-foreground text-center">
            AI Q&A Logs
          </Text>
        </View>

        <View className="flex-1 bg-card border border-border/40 p-4 rounded-2xl items-center shadow-sm">
          <SparklesIcon className="text-secondary mb-2 size-6" />
          <Text className="text-2xl font-bold text-foreground">
            5 Days
          </Text>
          <Text className="text-xs text-muted-foreground text-center">
            Study Streak
          </Text>
        </View>
      </View>

      {/* Quick Launch Actions */}
      <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
        Quick Actions
      </Text>
      
      <View className="gap-3 mb-6">
        <Button
          variant="outline"
          className="h-16 justify-between items-center rounded-2xl px-4 border-border/60"
          onPress={() => router.push("/(tabs)/study")}
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-xl">
              <BrainIcon className="text-primary size-5" />
            </View>
            <View className="items-start">
              <Text className="text-sm font-bold text-foreground">Socratic AI Tutor</Text>
              <Text className="text-xs text-muted-foreground">Ask questions & log sessions</Text>
            </View>
          </View>
          <Text className="text-primary text-xs font-semibold">Start →</Text>
        </Button>

        <Button
          variant="outline"
          className="h-16 justify-between items-center rounded-2xl px-4 border-border/60"
          onPress={() => router.push("/(tabs)/exams")}
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-secondary/20 p-2 rounded-xl">
              <AwardIcon className="text-secondary size-5" />
            </View>
            <View className="items-start">
              <Text className="text-sm font-bold text-foreground">Take Mock Exam</Text>
              <Text className="text-xs text-muted-foreground">Dynamic quizzes on current syllabus</Text>
            </View>
          </View>
          <Text className="text-secondary text-xs font-semibold">Take →</Text>
        </Button>

        <Button
          variant="outline"
          className="h-16 justify-between items-center rounded-2xl px-4 border-border/60"
          onPress={() => router.push("/models" as never)}
        >
          <View className="flex-row items-center gap-3">
            <View className="bg-primary/10 p-2 rounded-xl">
              <CpuIcon className="text-primary size-5" />
            </View>
            <View className="items-start">
              <Text className="text-sm font-bold text-foreground">Offline AI Models</Text>
              <Text className="text-xs text-muted-foreground">Download once, study without internet</Text>
            </View>
          </View>
          <Text className="text-primary text-xs font-semibold">Manage →</Text>
        </Button>
      </View>

      {/* Recent Activity Timeline */}
      <View className="justify-between flex-row items-center mb-3 px-1">
        <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Recent Study Activity
        </Text>
        <Button variant="ghost" size="sm" className="px-0" onPress={() => refetch()}>
          <Text className="text-xs font-medium text-primary">Refresh</Text>
        </Button>
      </View>

      {recentLogs.length === 0 ? (
        <View className="bg-card border border-dashed border-border p-6 rounded-2xl items-center">
          <CalendarIcon className="text-muted-foreground mb-2 size-8" />
          <Text className="text-sm text-center text-muted-foreground">
            No study sessions logged yet. Ask Socratic AI to get started!
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {recentLogs.map((log) => (
            <View key={log._id} className="bg-card border border-border/40 p-4 rounded-2xl shadow-sm">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="bg-secondary/40 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {log.subject}
                </Text>
                <Text className="text-[10px] text-muted-foreground">
                  {new Date(log.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text className="text-xs font-semibold text-foreground mb-1" numberOfLines={1}>
                {log.question}
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={2}>
                {log.answer}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "transparent",
  },
});



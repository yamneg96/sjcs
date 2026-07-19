import React, { useState } from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { BottomSheet, SheetOptions } from "@/components/ui/sheet";
import { useSubjects } from "@/hooks/use-subjects";
import { useAuthStore } from "@/store/auth.store";
import { BookOpenIcon, FilterIcon, ChevronRightIcon } from "lucide-react-native";

/**
 * Subject catalog (learn/subject_catalog). Lists the subjects available to the
 * student, filterable by grade — the grade filter sheet is the shared
 * BottomSheet rather than its own screen.
 */
export default function SubjectCatalog() {
  const user = useAuthStore((s) => s.user);
  const [grade, setGrade] = useState<number | undefined>(user?.grade);
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: subjects, isLoading, isError, refetch } = useSubjects(grade);

  const gradeOptions = [
    { value: 0, label: "All grades" },
    ...[9, 10, 11, 12].map((g) => ({ value: g, label: `Grade ${g}` })),
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Learn"
        subtitle={grade ? `Grade ${grade}` : "All grades"}
        right={
          <Button variant="ghost" size="icon" onPress={() => setFilterOpen(true)}>
            <FilterIcon className="text-foreground size-5" />
          </Button>
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading ? (
          <LoadingState label="Loading subjects…" />
        ) : isError ? (
          <ErrorState body="Couldn't load subjects." onRetry={refetch} />
        ) : !subjects?.length ? (
          <EmptyState
            icon={BookOpenIcon}
            title="No subjects yet"
            body="Your school hasn't published subjects for this grade yet. Check back soon."
          />
        ) : (
          subjects.map((s) => (
            <Pressable
              key={s._id}
              onPress={() => router.push(`/learn/${s._id}?name=${encodeURIComponent(s.name)}` as never)}
              className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-3"
            >
              <View className="bg-primary/10 p-3 rounded-xl">
                <BookOpenIcon className="text-primary size-5" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">{s.name}</Text>
                <Text className="text-[11px] text-muted-foreground">Grade {s.grade}</Text>
              </View>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </Pressable>
          ))
        )}
      </ScrollView>

      <BottomSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter by grade"
        subtitle="Show subjects for a specific grade"
      >
        <SheetOptions
          options={gradeOptions}
          selected={grade ?? 0}
          onSelect={(v) => {
            setGrade(v === 0 ? undefined : (v as number));
            setFilterOpen(false);
          }}
        />
      </BottomSheet>
    </View>
  );
}

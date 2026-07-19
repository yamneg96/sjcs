import React from "react";
import { View, ScrollView, RefreshControl, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState, ErrorState } from "@/components/ui/states";
import { useMaterials } from "@/hooks/use-materials";
import {
  FileTextIcon,
  VideoIcon,
  LinkIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from "lucide-react-native";

/**
 * Subject detail (learn/subject_details_physics) — the units/lessons within a
 * subject. Each lesson opens the reader.
 */

const ICON_BY_TYPE: Record<string, typeof FileTextIcon> = {
  pdf: FileTextIcon,
  video: VideoIcon,
  link: LinkIcon,
  markdown: BookOpenIcon,
};

export default function SubjectDetail() {
  const { subjectId, name } = useLocalSearchParams<{ subjectId: string; name?: string }>();
  const { data, isLoading, isError, refetch } = useMaterials({ subjectId });

  const materials = data?.data ?? [];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title={name || "Subject"}
        subtitle={materials.length ? `${materials.length} lesson${materials.length === 1 ? "" : "s"}` : undefined}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
      >
        {isLoading ? (
          <LoadingState label="Loading lessons…" />
        ) : isError ? (
          <ErrorState body="Couldn't load lessons for this subject." onRetry={refetch} />
        ) : materials.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title="No lessons yet"
            body="Your teacher hasn't uploaded material for this subject yet."
          />
        ) : (
          materials.map((m) => {
            const Icon = ICON_BY_TYPE[m.fileType] ?? FileTextIcon;
            return (
              <Pressable
                key={m._id}
                onPress={() => router.push(`/learn/lesson/${m._id}` as never)}
                className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-3"
              >
                <View className="bg-secondary/15 p-3 rounded-xl">
                  <Icon className="text-secondary size-5" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-foreground" numberOfLines={2}>
                    {m.title}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground uppercase mt-0.5">
                    {m.fileType} · Grade {m.gradeLevel}
                  </Text>
                </View>
                <ChevronRightIcon className="text-muted-foreground size-4" />
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

import React, { useMemo, useState } from "react";
import { View, ScrollView, TextInput, Pressable } from "react-native";
import { router } from "expo-router";
import { Text } from "@/components/ui/text";
import { ScreenHeader } from "@/components/ui/screen-header";
import { LoadingState, EmptyState } from "@/components/ui/states";
import { useMaterials } from "@/hooks/use-materials";
import { useSubjects } from "@/hooks/use-subjects";
import { useAuthStore } from "@/store/auth.store";
import { SearchIcon, FileTextIcon, BookOpenIcon, SparklesIcon } from "lucide-react-native";

/**
 * Search (home/search). Searches the student's own catalog — subjects and
 * lessons — and offers the query to the AI tutor when nothing matches, so the
 * screen is never a dead end.
 */
export default function Search() {
  const [query, setQuery] = useState("");
  const user = useAuthStore((s) => s.user);

  const { data: materialsRes, isLoading } = useMaterials({});
  const { data: subjects } = useSubjects(user?.grade);

  const q = query.trim().toLowerCase();

  // Client-side filter: the catalog is small and already cached, so this
  // stays responsive offline rather than round-tripping per keystroke.
  const results = useMemo(() => {
    if (!q) return { subjects: [], materials: [] };
    return {
      subjects: (subjects ?? []).filter((s) => s.name.toLowerCase().includes(q)),
      materials: (materialsRes?.data ?? []).filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.subject || "").toLowerCase().includes(q)
      ),
    };
  }, [q, subjects, materialsRes]);

  const empty = q && !results.subjects.length && !results.materials.length;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Search" />

      <View className="px-4 pt-4">
        <View className="flex-row items-center gap-2 bg-card border border-border/40 rounded-xl px-3">
          <SearchIcon className="text-muted-foreground size-4" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search lessons and subjects…"
            placeholderTextColor="#888"
            autoFocus
            className="flex-1 py-3 text-sm text-foreground"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {isLoading && q ? (
          <LoadingState />
        ) : !q ? (
          <EmptyState
            icon={SearchIcon}
            title="Search your material"
            body="Find a lesson or subject by name — or ask the AI tutor anything."
          />
        ) : empty ? (
          <View className="flex-1 items-center justify-center py-12 px-6">
            <SearchIcon size={48} className="text-muted-foreground/60 mb-3" />
            <Text className="text-base font-bold text-foreground text-center mb-1">
              No matches for &quot;{query}&quot;
            </Text>
            <Text className="text-sm text-muted-foreground text-center mb-5">
              Nothing in your lessons matches. Ask the tutor instead — it can explain it anyway.
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/study" as never)}
              className="flex-row items-center gap-2 bg-primary h-11 rounded-xl px-5"
            >
              <SparklesIcon size={15} color="#fff" />
              <Text className="text-primary-foreground font-semibold text-sm">Ask the AI tutor</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {results.subjects.length > 0 ? (
              <>
                <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Subjects
                </Text>
                {results.subjects.map((s) => (
                  <Pressable
                    key={s._id}
                    onPress={() => router.push(`/learn/${s._id}?name=${encodeURIComponent(s.name)}` as never)}
                    className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-2"
                  >
                    <BookOpenIcon className="text-primary size-4" />
                    <Text className="text-sm text-foreground flex-1">{s.name}</Text>
                  </Pressable>
                ))}
              </>
            ) : null}

            {results.materials.length > 0 ? (
              <>
                <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4 mb-2">
                  Lessons
                </Text>
                {results.materials.map((m) => (
                  <Pressable
                    key={m._id}
                    onPress={() => router.push(`/learn/lesson/${m._id}` as never)}
                    className="flex-row items-center gap-3 bg-card border border-border/40 rounded-2xl p-4 mb-2"
                  >
                    <FileTextIcon className="text-secondary size-4" />
                    <View className="flex-1">
                      <Text className="text-sm text-foreground" numberOfLines={1}>
                        {m.title}
                      </Text>
                      <Text className="text-[11px] text-muted-foreground">{m.subject}</Text>
                    </View>
                  </Pressable>
                ))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

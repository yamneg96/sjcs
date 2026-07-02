import React, { useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator, Linking, TouchableOpacity } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useMaterials } from "@/hooks/use-materials";
import { FileTextIcon, DownloadIcon, BookOpenIcon, SearchIcon } from "lucide-react-native";

export default function MaterialsScreen() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const { data: materialsData, isLoading, refetch } = useMaterials({
    subjectId: selectedSubject || undefined,
  });

  const materials = materialsData?.data || [];

  const handleOpenMaterial = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch((err) => console.error("Couldn't open URL", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Subject Filter Bar */}
      <View className="mb-5">
        <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
          Filter by Subject
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          <Button
            variant={selectedSubject === "" ? "default" : "outline"}
            className="rounded-xl px-4 py-2 h-9 mr-2"
            onPress={() => setSelectedSubject("")}
          >
            <Text className="text-xs font-semibold">All</Text>
          </Button>
          {["Theology", "Mathematics", "Science", "History"].map((subj) => (
            <Button
              key={subj}
              variant={selectedSubject === subj ? "default" : "outline"}
              className="rounded-xl px-4 py-2 h-9 mr-2"
              onPress={() => setSelectedSubject(subj)}
            >
              <Text className="text-xs font-semibold">{subj}</Text>
            </Button>
          ))}
        </ScrollView>
      </View>

      {/* Materials List */}
      <Text className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
        Curriculum Material Documents
      </Text>

      {isLoading ? (
        <View className="py-12 items-center justify-center">
          <ActivityIndicator size="large" className="text-primary" />
          <Text className="text-xs text-muted-foreground mt-2">Loading documents library...</Text>
        </View>
      ) : materials.length === 0 ? (
        <View className="bg-card border border-dashed border-border p-8 rounded-3xl items-center gap-3">
          <BookOpenIcon size={48} className="text-muted-foreground" />
          <Text className="text-sm font-bold text-foreground text-center">
            No Documents Available
          </Text>
          <Text className="text-xs text-muted-foreground text-center">
            There are no learning resources uploaded for the selected subject at this time.
          </Text>
          <Button variant="outline" className="rounded-xl h-10 border-border/60" onPress={() => refetch()}>
            <Text className="text-xs font-semibold text-primary">Refresh Library</Text>
          </Button>
        </View>
      ) : (
        <View className="gap-3">
          {materials.map((item) => (
            <View key={item._id} className="bg-card border border-border/40 p-4 rounded-2xl shadow-sm flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1 mr-4">
                <View className="bg-primary/5 p-3 rounded-xl">
                  <FileTextIcon size={20} className="text-primary" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-foreground" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-[10px] text-muted-foreground uppercase" numberOfLines={1}>
                    {item.subject} | Grade {item.gradeLevel}
                  </Text>
                </View>
              </View>
              
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl px-2 h-9 border-border/60 flex-row gap-1"
                onPress={() => handleOpenMaterial(item.url)}
              >
                <DownloadIcon size={12} className="text-primary" />
                <Text className="text-[10px] font-semibold text-primary">View</Text>
              </Button>
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

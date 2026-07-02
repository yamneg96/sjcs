import React from "react";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "@/lib/theme";
import { HomeIcon, BrainIcon, AwardIcon, FileTextIcon, LogOutIcon } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuthStore } from "@/store/auth.store";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const logout = useAuthStore((state) => state.logout);
  const theme = NAV_THEME[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "#888",
        headerRight: () => (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onPress={logout}
          >
            <Icon as={LogOutIcon} className="text-destructive size-5" />
          </Button>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: "AI LIS Tutor",
          tabBarLabel: "Study Tutor",
          tabBarIcon: ({ color, size }) => <BrainIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Mock Exams",
          tabBarLabel: "Exams",
          tabBarIcon: ({ color, size }) => <AwardIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="materials"
        options={{
          title: "Materials Library",
          tabBarLabel: "Materials",
          tabBarIcon: ({ color, size }) => <FileTextIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

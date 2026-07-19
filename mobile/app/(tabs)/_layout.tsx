import React, { useEffect } from "react";
import { View } from "react-native";
import { Tabs, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "@/lib/theme";
import {
  HomeIcon,
  BrainIcon,
  BookOpenIcon,
  AwardIcon,
  UserIcon,
  BellIcon,
  SearchIcon,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { registerForPushNotifications } from "@/hooks/use-notifications";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const theme = NAV_THEME[colorScheme ?? "light"];

  // Register this device for push once the student is signed in, so results
  // releases (§33) can reach them. Failures are swallowed by the helper.
  useEffect(() => {
    void registerForPushNotifications();
  }, []);

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
          <View className="flex-row items-center">
            <Button variant="ghost" size="icon" onPress={() => router.push("/search" as never)}>
              <Icon as={SearchIcon} className="text-foreground size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onPress={() => router.push("/notifications" as never)}
            >
              <Icon as={BellIcon} className="text-foreground size-5" />
            </Button>
          </View>
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
          title: "AI Tutor",
          tabBarLabel: "Tutor",
          tabBarIcon: ({ color, size }) => <BrainIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarLabel: "Learn",
          tabBarIcon: ({ color, size }) => <BookOpenIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: "Quizzes",
          tabBarLabel: "Quizzes",
          tabBarIcon: ({ color, size }) => <AwardIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />

      {/* Materials remains reachable from Home/Learn, but isn't a tab — five
          tabs is the practical ceiling before labels truncate. */}
      <Tabs.Screen name="materials" options={{ href: null, title: "Materials" }} />
    </Tabs>
  );
}

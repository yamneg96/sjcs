import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggleFab } from '@/components/ui/theme-toggle-fab';
import { useEffect, useRef } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function NavigationGuard() {
  const segments = useSegments();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign-in page if not authenticated and not in auth screens
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to main screens if authenticated and trying to view auth screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const savedScheme = useAuthStore((state) => state.colorScheme);
  const applied = useRef(false);

  // Bridge the persisted preference into NativeWind on cold start — NativeWind's
  // own scheme resets to the device default each launch, so without this the
  // user's saved light/dark choice would be forgotten.
  useEffect(() => {
    if (!applied.current) {
      applied.current = true;
      if (savedScheme) setColorScheme(savedScheme);
    }
  }, [savedScheme, setColorScheme]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <NavigationGuard />
          {/* Movable, global theme toggle — rides over every screen. */}
          <ThemeToggleFab />
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

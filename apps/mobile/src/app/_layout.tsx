import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import {
	initialWindowMetrics,
	SafeAreaProvider,
} from "react-native-safe-area-context";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { queryClient } from "@/lib/query-client";
import { useProfile } from "@/modules/auth/profile";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<SafeAreaProvider initialMetrics={initialWindowMetrics}>
					<AnimatedSplashOverlay />
					<RootNavigator />
					<PortalHost />
				</SafeAreaProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

function RootNavigator() {
	const { data: profile } = useProfile();

	const isAuthenticated = !!profile;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="index" />
				<Stack.Screen name="(protected)" />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="login" />
			</Stack.Protected>
		</Stack>
	);
}

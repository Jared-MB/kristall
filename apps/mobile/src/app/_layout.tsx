import "@/global.css";

import { PortalHost } from "@rn-primitives/portal";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import {
	initialWindowMetrics,
	SafeAreaProvider,
} from "react-native-safe-area-context";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { authClient } from "@/modules/auth/http";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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
	// Fuente de verdad de la sesión: si el perfil resuelve, hay sesión válida.
	// El guard es reactivo, así que al hacer login/logout (invalidando esta
	// query) expo-router redirige solo, sin navegación manual.
	const { data: profile } = useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			console.log("profile");
			const [error, response] = await authClient.GET("profile");

			console.log({ error, response });

			if (error) {
				throw error;
			}

			if (response.status !== "ok") {
				throw new Error("Server error");
			}

			return response.data;
		},
		retry: false,
	});

	const isAuthenticated = !!profile;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isAuthenticated}>
				{/* index ("/") redirige a /home; va DENTRO del guard para que, sin
				    sesión, no exista como destino de fallback y no genere un loop
				    de redirección con /home. */}
				<Stack.Screen name="index" />
				<Stack.Screen name="(protected)" />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="login" />
			</Stack.Protected>
		</Stack>
	);
}

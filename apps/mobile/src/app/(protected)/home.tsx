import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { appClient } from "@/modules/app/http";
import { authClient } from "@/modules/auth/http";
import { clearSessionToken } from "@/modules/auth/token-store";

export default function HomeScreen() {
	const [{ data }, { data: profile, isPending }] = useQueries({
		queries: [
			{
				queryKey: ["health"],
				queryFn: async () => {
					const [error, response] = await appClient.GET("health", {
						auth: false,
					});

					if (error) {
						throw error;
					}

					if (response.status !== "ok") {
						throw new Error("Server error");
					}

					return response.data;
				},
			},
			{
				queryKey: ["profile"],
				queryFn: async () => {
					const [error, response] = await authClient.GET("profile");

					if (error) {
						throw error;
					}

					if (response.status !== "ok") {
						throw new Error("Server error");
					}

					return response.data;
				},
				retry: false,
			},
		],
	});

	const queryClient = useQueryClient();
	const router = useRouter();

	const logout = async () => {
		await clearSessionToken();
		// Borra el `data` de ["profile"] (invalidate no sirve: React Query
		// conserva el data anterior cuando el refetch falla con 401).
		queryClient.removeQueries({ queryKey: ["profile"] });
		// La auto-redirección de Stack.Protected no atraviesa el navegador de
		// tabs anidado, así que navegamos explícito a /login (ruta tipada).
		// El guard queda como respaldo para bloquear volver a /home sin sesión.
		router.push("/login");
	};

	if (isPending) {
		return (
			<SafeAreaView>
				<ThemedText>Loading...</ThemedText>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView>
			<HintRow
				title="Server response"
				hint={<ThemedText type="code">{JSON.stringify(data)}</ThemedText>}
			/>
			<ThemedText>{JSON.stringify(profile, null, 2)}</ThemedText>
			<Button onPress={logout}>Logout</Button>
		</SafeAreaView>
	);
}

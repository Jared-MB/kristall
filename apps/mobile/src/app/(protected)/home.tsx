import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { appClient } from "@/modules/app/http";
import { PROFILE_QUERY_KEY } from "@/modules/auth/keys";
import { profileQueryOptions } from "@/modules/auth/profile";
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
			profileQueryOptions,
		],
	});

	const queryClient = useQueryClient();
	const router = useRouter();

	const logout = async () => {
		await clearSessionToken();
		await queryClient.resetQueries({ queryKey: PROFILE_QUERY_KEY });
		router.replace("/login");
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

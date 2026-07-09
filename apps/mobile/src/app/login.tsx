import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ZodError } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/modules/auth/http";
import { PROFILE_QUERY_KEY } from "@/modules/auth/keys";
import { setSessionToken } from "@/modules/auth/token-store";

export default function LoginScreen() {
	const [fields, setFields] = useState({
		email: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationFn: async () => {
			const [error, response] = await authClient.POST(
				"login",
				{
					email: fields.email,
					password: fields.password,
				},
				{
					auth: false,
				},
			);

			if (error) {
				if (error instanceof ZodError) {
					throw new Error(error.issues[0]?.message ?? "Invalid input");
				}
				throw error;
			}

			if (response.status !== "ok") {
				throw new Error(response.message);
			}

			return response.data.access_token;
		},
		onSuccess: async (token) => {
			await setSessionToken(token);
			await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
		},
	});

	return (
		<SafeAreaView>
			<View className="flex flex-col gap-4">
				<Field>
					<Label>Email</Label>
					<Input
						placeholder="user@email.com"
						value={fields.email}
						onChangeText={(value) => setFields({ ...fields, email: value })}
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						autoComplete="email"
						textContentType="emailAddress"
						editable={!isPending}
					/>
				</Field>
				<Field>
					<Label>Password</Label>
					<Input
						placeholder="* * * * * * * *"
						secureTextEntry
						value={fields.password}
						onChangeText={(value) => setFields({ ...fields, password: value })}
						autoComplete="current-password"
						textContentType="password"
						editable={!isPending}
					/>
				</Field>
				{error ? <FieldError>{error.message}</FieldError> : null}
				<Button onPress={() => mutate()} disabled={isPending}>
					{isPending ? "Logging in..." : "Login"}
				</Button>
			</View>
		</SafeAreaView>
	);
}

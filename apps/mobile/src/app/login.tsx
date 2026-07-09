import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/modules/auth/http";
import { setSessionToken } from "@/modules/auth/token-store";

export default function LoginScreen() {
	const [fields, setFields] = useState({
		email: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const { mutate } = useMutation({
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
				throw error;
			}

			if (response.status !== "ok") {
				throw new Error("Something went wrong");
			}

			return response.data.access_token;
		},
		onSuccess: async (token) => {
			await setSessionToken(token);
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			setFields({
				email: "",
				password: "",
			});
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
					/>
				</Field>
				<Field>
					<Label>Password</Label>
					<Input
						placeholder="* * * * * * * *"
						secureTextEntry
						value={fields.password}
						onChangeText={(value) => setFields({ ...fields, password: value })}
					/>
				</Field>
				<Button onPress={() => mutate()}>Login</Button>
			</View>
		</SafeAreaView>
	);
}

"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/modules/auth/services/register.action";

export default function RegisterPage() {
	const { mutate: dispatch } = useMutation({
		mutationFn: (data: FormData) => register(data),
	});

	return (
		<form action={dispatch} className="flex flex-col gap-4 max-w-sm">
			<FieldSet>
				<FieldGroup>
					<Field>
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" type="text" placeholder="Name" />
					</Field>
					<Field>
						<Label htmlFor="email">Email</Label>
						<Input id="email" name="email" type="email" placeholder="Email" />
					</Field>
					<Field>
						<Label htmlFor="password">Password</Label>
						<Input id="password" name="password" type="password" />
					</Field>
					<Field>
						<Label htmlFor="shopName">Shop Name</Label>
						<Input id="shopName" name="shopName" type="text" />
					</Field>
				</FieldGroup>
			</FieldSet>
			<Button type="submit">Sign Up</Button>
			<Link href="/login">
				<small>Already have an account? Login</small>
			</Link>
		</form>
	);
}

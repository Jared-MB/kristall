"use client";

import { IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/modules/auth/services/login.action";

export default function LoginPage() {
	const [state, dispatch, isPending] = useActionState(login, undefined);

	return (
		<main className="min-h-dvh grid place-content-center relative">
			<div>
				<Link href="/" className="text-primary absolute top-6 left-6 text-4xl">
					K
				</Link>
			</div>
			<section className="flex flex-col gap-8 p-16">
				<header className="flex flex-col gap-4 selection:bg-primary selection:text-foreground">
					<h2 className="text-3xl font-medium">Inicia sesión en Kristall</h2>
				</header>
				<form action={dispatch} className="flex flex-col gap-4 min-w-xs">
					<FieldSet>
						<FieldGroup>
							<Field data-invalid={!!state?.error?.fields?.email?.errors}>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="user@email.com"
									required
									defaultValue={state?.error?.fields?.email?.value}
								/>
								<FieldError
									errors={state?.error?.fields?.email?.errors?.map((err) => ({
										message: err,
									}))}
								/>
							</Field>
							<Field data-invalid={!!state?.error?.fields?.password?.errors}>
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									name="password"
									type="password"
									required
									placeholder="* * * * * * * *"
									defaultValue={state?.error?.fields?.password?.value}
								/>
								<FieldError
									errors={state?.error?.fields?.password?.errors?.map(
										(err) => ({
											message: err,
										}),
									)}
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
					<Button type="submit" disabled={isPending}>
						{isPending && <IconLoader2 className="animate-spin mr-0.5" />}
						{isPending ? "Iniciando sesión" : "Iniciar sesión"}
					</Button>

					<small className="text-muted-foreground text-center">
						¿Aún no tienes una cuenta?{" "}
						<Link href="/register" className="hover:underline text-primary">
							Regístrate
						</Link>
					</small>
				</form>
			</section>
		</main>
	);
}

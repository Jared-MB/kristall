"use client";

import { IconLoader2 } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import loginSvg from "@/assets/svgs/login.svg";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/modules/auth/services/login.action";

export default function LoginPage() {
	const [state, dispatch, isPending] = useActionState(login, undefined);

	return (
		<main className="grid grid-cols-2 min-h-dvh">
			<aside className="bg-purple-500 rounded-r-md grid place-content-center relative">
				<span className="text-foreground absolute top-8 left-8 z-50 text-4xl">
					Kristall
				</span>
				<Image
					src={loginSvg}
					loading="eager"
					alt="Login"
					className="max-w-sm aspect-square"
				/>
			</aside>
			<section className="p-16 grid place-content-center">
				<div className="flex flex-col gap-8">
					<header className="flex flex-col gap-4 selection:bg-purple-500 selection:text-foreground">
						<h1 className="text-5xl">
							<span className="text-purple-500">K</span>
							<span>ristall</span>
						</h1>
						<h3 className="text-2xl">Bienvenido de vuelta</h3>
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
						<Link href="/register">
							<small className="text-muted-foreground hover:underline">
								Don't have an account? Register
							</small>
						</Link>
					</form>
				</div>
			</section>
		</main>
	);
}

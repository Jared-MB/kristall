"use client";

import type { Location } from "@kristall/api";
import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	useDialog,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { createLocation } from "@/modules/locations/services/create-location.action";
import type { LocationFormState } from "@/modules/locations/utils/form-state";
import { LocationForm } from "./location-form";

export function CreateLocation({ children }: { children: React.ReactNode }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<CreateLocationForm />
			</DialogContent>
		</Dialog>
	);
}

interface CreateState {
	attempt: number;
	result: LocationFormState<Location>;
}

function CreateLocationForm() {
	const { setOpen } = useDialog();

	const [{ attempt, result }, action, isPending] = useActionState(
		async (prev: CreateState, formData: FormData): Promise<CreateState> => {
			const result = await createLocation(formData);

			if (result?.success) {
				// `createLocation` already expired the list tag, so its response
				// carries the re-rendered grid. React doesn't extend the action's
				// transition past the `await`, so the close is wrapped to batch it
				// with that re-render — otherwise the dialog closes a frame early.
				startTransition(() => setOpen(false));
			}

			return { attempt: prev.attempt + 1, result };
		},
		{ attempt: 0, result: undefined },
	);

	return (
		<LocationForm
			action={action}
			attempt={attempt}
			fields={result?.error?.fields}
			message={result?.error?.message}
			title="Crear nueva ubicación"
		>
			<Button type="submit" disabled={isPending}>
				{isPending ? <Spinner /> : null}
				{isPending ? "Creando ubicación…" : "Crear ubicación"}
			</Button>
		</LocationForm>
	);
}

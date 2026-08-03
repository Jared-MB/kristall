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
import { updateLocation } from "@/modules/locations/services/update-location.action";
import {
	type LocationFormState,
	toFormState,
} from "@/modules/locations/utils/form-state";
import { LocationForm } from "./location-form";

export function EditLocation({
	children,
	location,
}: {
	children: React.ReactNode;
	location: Location;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<EditLocationForm location={location} />
			</DialogContent>
		</Dialog>
	);
}

interface EditState {
	attempt: number;
	result: LocationFormState<Location>;
}

function EditLocationForm({ location }: { location: Location }) {
	const { setOpen } = useDialog();

	const [{ attempt, result }, action, isPending] = useActionState(
		async (prev: EditState, formData: FormData): Promise<EditState> => {
			const result = await updateLocation(formData, location._id);

			if (result?.success) {
				startTransition(() => setOpen(false));
			}

			return { attempt: prev.attempt + 1, result };
		},
		{ attempt: 0, result: undefined },
	);

	// The page already rendered this location, so the form seeds itself from the
	// prop and only swaps to the action's fields once a submission comes back.
	const storedFields = toFormState(location).error?.fields;

	return (
		<LocationForm
			action={action}
			attempt={attempt}
			fields={result?.error?.fields ?? storedFields}
			message={result?.error?.message}
			title="Editar ubicación"
		>
			<Button type="submit" disabled={isPending}>
				{isPending ? <Spinner /> : null}
				{isPending ? "Guardando cambios…" : "Guardar cambios"}
			</Button>
		</LocationForm>
	);
}

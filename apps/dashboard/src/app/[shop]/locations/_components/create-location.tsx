"use client";

import type { Location } from "@kristall/api";
import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	useDialog,
} from "@/components/ui/dialog";
import { createLocation } from "@/modules/locations/services/create-location.action";
import type { LocationFormState } from "@/modules/locations/utils/form-state";
import {
	LocationForm,
	LocationFormFields,
	LocationFormSubmit,
} from "./location-form";

export function CreateLocation({
	children,
	nativeButton,
}: {
	children: React.ReactElement;
	/** Set to `false` when `children` is not a `<button>`. */
	nativeButton?: boolean;
}) {
	return (
		<Dialog>
			<DialogTrigger render={children} nativeButton={nativeButton} />
			<DialogContent>
				<CreateLocationDialogForm />
			</DialogContent>
		</Dialog>
	);
}

/** Lives inside `DialogContent` so it can reach the dialog to close it. */
function CreateLocationDialogForm() {
	const { setOpen } = useDialog();

	return (
		<CreateLocationForm onSuccess={() => setOpen(false)}>
			<div className="flex flex-col gap-6 p-2 pb-6">
				<DialogHeader>
					<DialogTitle render={<h3>Crear nueva ubicación</h3>} />
				</DialogHeader>
				<LocationFormFields />
			</div>
			<DialogFooter>
				<DialogClose render={<Button variant="outline" type="button" />}>
					Cancelar
				</DialogClose>
				<CreateLocationSubmit />
			</DialogFooter>
		</CreateLocationForm>
	);
}

interface CreateState {
	attempt: number;
	result: LocationFormState<Location>;
}

/**
 * Owns the create action; the layout comes in as children
 * (`LocationFormFields`, `CreateLocationSubmit` and whatever chrome the
 * container needs).
 */
export function CreateLocationForm({
	onSuccess,
	className,
	children,
}: {
	/** Runs after the location is created, e.g. to close its container. */
	onSuccess?: (location: Location | undefined) => void;
	className?: string;
	children: React.ReactNode;
}) {
	const [{ attempt, result }, action] = useActionState(
		async (prev: CreateState, formData: FormData): Promise<CreateState> => {
			const result = await createLocation(formData);

			if (result?.success) {
				// `createLocation` already expired the list tag, so its response
				// carries the re-rendered grid. React doesn't extend the action's
				// transition past the `await`, so the close is wrapped to batch it
				// with that re-render — otherwise a dialog closes a frame early.
				startTransition(() => onSuccess?.(result.data));
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
			className={className}
		>
			{children}
		</LocationForm>
	);
}

export function CreateLocationSubmit() {
	return (
		<LocationFormSubmit pendingLabel="Creando ubicación…">
			Crear ubicación
		</LocationFormSubmit>
	);
}

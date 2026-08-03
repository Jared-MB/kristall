"use client";

import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { LocationFormFields } from "@/modules/locations/utils/form-state";

/** `FieldError` wants objects; the action reports plain messages. */
function toFieldErrors(errors: string[] | undefined) {
	return errors?.map((message) => ({ message }));
}

export function LocationForm({
	fields,
	title,
	message,
	action,
	attempt,
	children,
}: {
	fields?: LocationFormFields;
	/** Top-level failure message, when the API sends one instead of field errors. */
	message?: string;
	action: (formData: FormData) => void;
	/**
	 * Submission counter. Keying the inputs on it remounts them after every
	 * attempt, so `defaultValue` repaints what the user typed rather than
	 * depending on the ordering of React's post-action form reset.
	 */
	attempt: number;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<form action={action}>
			<div className="flex flex-col gap-6 p-2 pb-6">
				<DialogHeader>
					<DialogTitle asChild>
						<h3>{title}</h3>
					</DialogTitle>
				</DialogHeader>
				{message ? (
					<p role="alert" className="text-destructive text-sm">
						{message}
					</p>
				) : null}
				<FieldGroup key={attempt}>
					<Field data-invalid={!!fields?.name.errors?.length}>
						<FieldLabel htmlFor="name">Nombre</FieldLabel>
						<Input
							defaultValue={fields?.name.value}
							name="name"
							id="name"
							placeholder="Almacén"
							aria-invalid={!!fields?.name.errors?.length}
						/>
						<FieldError errors={toFieldErrors(fields?.name.errors)} />
					</Field>
					<Field data-invalid={!!fields?.address.errors?.length}>
						<FieldLabel htmlFor="address">Dirección</FieldLabel>
						<Input
							defaultValue={fields?.address.value}
							name="address"
							id="address"
							placeholder="Poniente 3"
							aria-invalid={!!fields?.address.errors?.length}
						/>
						<FieldError errors={toFieldErrors(fields?.address.errors)} />
					</Field>
					<Field data-invalid={!!fields?.phone.errors?.length}>
						<FieldLabel htmlFor="phone">Teléfono</FieldLabel>
						<Input
							defaultValue={fields?.phone.value}
							name="phone"
							id="phone"
							placeholder="+00 000 000 0000"
							aria-invalid={!!fields?.phone.errors?.length}
						/>
						<FieldError errors={toFieldErrors(fields?.phone.errors)} />
					</Field>
				</FieldGroup>
			</div>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline" type="button">
						Cancelar
					</Button>
				</DialogClose>
				{children}
			</DialogFooter>
		</form>
	);
}

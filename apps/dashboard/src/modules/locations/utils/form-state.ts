import type { ApiFieldError } from "@kristall/shared";

interface LocationFormField {
	errors?: string[];
	value?: string;
}

/**
 * Per-field state handed back to the form so it can repaint the values the user
 * typed alongside whatever the validation rejected.
 */
export interface LocationFormFields {
	name: LocationFormField;
	address: LocationFormField;
	phone: LocationFormField;
}

/**
 * Shared shape of every location action, so a form can seed `useActionState`
 * with an initial state the action itself could have returned.
 *
 * `undefined` means nothing to report: the form was never submitted, or the
 * submission went through and the action revalidated instead.
 */
export type LocationFormState<T = undefined> =
	| {
			success: boolean;
			error?: {
				fields: LocationFormFields;
				/** Top-level failure message, when the API sends one. */
				message?: string;
			};
			data?: T;
	  }
	| undefined;

/** Turns the flat `fields` array of an API error into per-field message lists. */
export function groupFieldErrors(fields: ApiFieldError[] | undefined) {
	const grouped: Record<string, string[] | undefined> = {};

	for (const { field, message } of fields ?? []) {
		grouped[field] = [...(grouped[field] ?? []), message];
	}

	return grouped;
}

interface LocationValues {
	name?: string;
	address?: string;
	phone?: string;
}

/**
 * Pairs the submitted values with their errors. Also used to seed an edit form
 * with stored values, by leaving `errors` empty.
 */
export function toFormState(
	values: LocationValues,
	errors: Record<string, string[] | undefined> = {},
	message?: string,
	// `NonNullable` because this always builds a state: the `undefined` arm of
	// `LocationFormState` belongs to callers that never submitted, and letting it
	// leak here forces a pointless `?.` on every reader.
): NonNullable<LocationFormState> {
	return {
		success: false,
		error: {
			fields: {
				name: { errors: errors.name, value: values.name },
				address: { errors: errors.address, value: values.address },
				phone: { errors: errors.phone, value: values.phone },
			},
			message,
		},
	};
}

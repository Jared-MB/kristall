"use server";

import { LOCATIONS_ROUTES, type Location } from "@kristall/api";
import { updateTag } from "next/cache";
import { treeifyError } from "zod";
import { LOCATION_TAGS } from "../constants/tags";
import { locationsClient } from "../http";
import {
	groupFieldErrors,
	type LocationFormState,
	toFormState,
} from "../utils/form-state";

export async function updateLocation(
	formData: FormData,
	locationId: string,
): Promise<LocationFormState<Location>> {
	const { name, address, phone } = Object.fromEntries(formData.entries());

	const values = {
		name: name?.toString(),
		address: address?.toString(),
		phone: phone?.toString(),
	};

	const parsedData =
		LOCATIONS_ROUTES["update-location"].clientInput.safeParse(values);

	if (!parsedData.success) {
		const errors = treeifyError(parsedData.error).properties;

		return toFormState(values, {
			name: errors?.name?.errors,
			address: errors?.address?.errors,
			phone: errors?.phone?.errors,
		});
	}

	const [error, response] = await locationsClient.PATCH(
		"update-location",
		{
			name: parsedData.data.name,
			address: parsedData.data.address,
			phone: parsedData.data.phone,
		},
		{ slugs: { id: locationId } },
	);

	if (error) {
		throw error;
	}

	if (response.status === "error") {
		return toFormState(
			values,
			groupFieldErrors(response.fields),
			response.message,
		);
	}

	updateTag(LOCATION_TAGS.ALL);

	return {
		success: true,
		data: response.data,
	};
}

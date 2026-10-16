"use server";

import {
	CREATE_PRODUCT_SCHEMA,
	groupIssues,
	type ProductFormState,
	readProductValues,
	toProductInput,
} from "../utils/form-state";

export async function createProduct(
	_prev: ProductFormState,
	formData: FormData,
): Promise<ProductFormState> {
	const values = readProductValues(formData);
	const parsedData = CREATE_PRODUCT_SCHEMA.safeParse(toProductInput(values));

	if (!parsedData.success) {
		return { values, errors: groupIssues(parsedData.error.issues) };
	}

	// TODO: `@kristall/api` has no products contract and the server exposes no
	// products controller yet. Once both exist, POST `parsedData.data` through a
	// `productsClient`, expire the products tag and redirect to the list.
	return {
		values,
		errors: {},
		message: "La API de productos aún no está disponible.",
	};
}

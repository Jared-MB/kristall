import { z } from "zod";

/**
 * Mirrors the `Product` entity on the server: `name` is required, the category
 * and image are optional, and the initial stock is split per location (the
 * `ProductLocation` join table), keyed by location id.
 */
export const CREATE_PRODUCT_SCHEMA = z.object({
	name: z
		.string("El nombre es obligatorio")
		.trim()
		.min(1, "El nombre es obligatorio")
		.max(100, "El nombre no puede superar 100 caracteres"),
	categoryId: z.uuid("Categoría no válida").nullable(),
	imageURL: z.url("Ingresa una URL válida, p. ej. https://…").optional(),
	stock: z.record(
		z.uuid(),
		z.coerce
			.number("Ingresa un número")
			.int("El stock debe ser un número entero")
			.min(0, "El stock no puede ser negativo"),
	),
});

export type CreateProductInput = z.infer<typeof CREATE_PRODUCT_SCHEMA>;

/** Prefix of the inputs that carry the stock of each location. */
export const STOCK_FIELD_PREFIX = "stock.";

/**
 * Raw strings exactly as the user typed them, so a rejected submission can
 * repaint the form. Stock entries are keyed `stock.<locationId>`.
 */
export type ProductFormValues = Record<string, string>;

/**
 * `undefined` means nothing to report: the form was never submitted.
 * `errors` is keyed like `values` (`name`, `imageURL`, `stock.<locationId>`…).
 */
export type ProductFormState =
	| {
			values: ProductFormValues;
			errors: Record<string, string[] | undefined>;
			/** Top-level failure message, when there is no field to blame. */
			message?: string;
	  }
	| undefined;

export function readProductValues(formData: FormData): ProductFormValues {
	const values: ProductFormValues = {};

	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			values[key] = value.trim();
		}
	}

	return values;
}

/** Turns the raw form strings into the shape `CREATE_PRODUCT_SCHEMA` expects. */
export function toProductInput(values: ProductFormValues) {
	const stock: Record<string, string> = {};

	for (const [key, value] of Object.entries(values)) {
		if (key.startsWith(STOCK_FIELD_PREFIX)) {
			// An untouched stock input means "none here yet", not an error.
			stock[key.slice(STOCK_FIELD_PREFIX.length)] = value || "0";
		}
	}

	return {
		name: values.name,
		categoryId: values.categoryId || null,
		imageURL: values.imageURL || undefined,
		stock,
	};
}

/** Groups zod issues by their dotted path, matching the input names. */
export function groupIssues(issues: z.core.$ZodIssue[]) {
	const grouped: Record<string, string[] | undefined> = {};

	for (const issue of issues) {
		const key = issue.path.join(".");
		grouped[key] = [...(grouped[key] ?? []), issue.message];
	}

	return grouped;
}

"use client";

import type { Location } from "@kristall/api";
import { FolderIcon, ImageIcon, MapPinIcon, StoreIcon } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { createProduct } from "@/modules/products/services/create-product.action";
import {
	type ProductFormState,
	STOCK_FIELD_PREFIX,
} from "@/modules/products/utils/form-state";

export interface ProductCategoryOption {
	_id: string;
	name: string;
}

/** `FieldError` wants objects; the action reports plain messages. */
function toFieldErrors(errors: string[] | undefined) {
	return errors?.map((message) => ({ message }));
}

interface CreateState {
	/**
	 * Submission counter. Keying the fields on it remounts them after every
	 * attempt, so `defaultValue` repaints what the user typed rather than
	 * depending on the ordering of React's post-action form reset.
	 */
	attempt: number;
	result: ProductFormState;
}

export function ProductForm({
	shop,
	locations,
	categories,
}: {
	shop: string;
	locations: Location[];
	categories: ProductCategoryOption[];
}) {
	const [{ attempt, result }, action, isPending] = useActionState(
		async (prev: CreateState, formData: FormData): Promise<CreateState> => ({
			attempt: prev.attempt + 1,
			result: await createProduct(prev.result, formData),
		}),
		{ attempt: 0, result: undefined },
	);

	const values = result?.values ?? {};
	const errors = result?.errors ?? {};

	return (
		<form
			action={action}
			noValidate
			className="flex flex-col gap-8 rounded-xl bg-card p-6 shadow-xs sm:p-8"
		>
			<header className="flex flex-col gap-4">
				<h1 className="text-3xl font-semibold tracking-tight text-balance">
					Nuevo producto
				</h1>
				<div className="flex flex-col gap-1 rounded-md bg-muted px-3 py-2.5">
					<span className="text-xs text-muted-foreground">Creando en</span>
					<span className="flex min-w-0 items-center gap-2 text-sm font-medium">
						<StoreIcon aria-hidden className="size-4 shrink-0" />
						<span translate="no" className="truncate font-mono">
							{shop}
						</span>
					</span>
				</div>
			</header>

			<div key={attempt} className="flex flex-col gap-8">
				<section className="flex flex-col gap-5">
					<p className="text-sm">
						Elige una categoría y dale un nombre al producto.
					</p>
					<div className="grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
						<CategoryField
							categories={categories}
							defaultValue={values.categoryId}
							errors={errors.categoryId}
						/>
						<span
							aria-hidden
							className="hidden h-9 w-px rotate-12 self-end bg-border sm:block"
						/>
						<Field data-invalid={!!errors.name?.length}>
							<FieldLabel
								htmlFor="name"
								className="font-normal text-muted-foreground"
							>
								Nombre del producto
							</FieldLabel>
							<Input
								id="name"
								name="name"
								autoComplete="off"
								placeholder="Café americano…"
								defaultValue={values.name}
								aria-invalid={!!errors.name?.length}
								autoFocus
							/>
							<FieldError errors={toFieldErrors(errors.name)} />
						</Field>
					</div>
				</section>

				<Separator />

				<ImageField defaultValue={values.imageURL} errors={errors.imageURL} />

				<StockSection
					shop={shop}
					locations={locations}
					values={values}
					errors={errors}
				/>
			</div>

			{result?.message ? (
				<p
					role="alert"
					aria-live="polite"
					className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
				>
					{result.message}
				</p>
			) : null}

			<Button type="submit" size="lg" disabled={isPending} className="w-full">
				{isPending ? <Spinner /> : null}
				{isPending ? "Creando producto…" : "Crear producto"}
			</Button>
		</form>
	);
}

const NO_CATEGORY = "";

function CategoryField({
	categories,
	defaultValue = NO_CATEGORY,
	errors,
}: {
	categories: ProductCategoryOption[];
	defaultValue?: string;
	errors?: string[];
}) {
	const items = [
		{ value: NO_CATEGORY, label: "Sin categoría" },
		...categories.map((category) => ({
			value: category._id,
			label: category.name,
		})),
	];

	return (
		<Field data-invalid={!!errors?.length}>
			<FieldLabel
				htmlFor="categoryId"
				className="font-normal text-muted-foreground"
			>
				Categoría
			</FieldLabel>
			<Select name="categoryId" items={items} defaultValue={defaultValue}>
				<SelectTrigger
					id="categoryId"
					className="w-full"
					aria-invalid={!!errors?.length}
				>
					<FolderIcon aria-hidden className="text-muted-foreground" />
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError errors={toFieldErrors(errors)} />
		</Field>
	);
}

function ImageField({
	defaultValue = "",
	errors,
}: {
	defaultValue?: string;
	errors?: string[];
}) {
	const [url, setUrl] = useState(defaultValue);
	const [failedUrl, setFailedUrl] = useState<string>();
	const canPreview = URL.canParse(url) && failedUrl !== url;

	return (
		<Field data-invalid={!!errors?.length}>
			<FieldLabel
				htmlFor="imageURL"
				className="font-normal text-muted-foreground"
			>
				Imagen
			</FieldLabel>
			<div className="flex items-start gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
					{canPreview ? (
						// biome-ignore lint/performance/noImgElement: arbitrary user-supplied host, not in `images.remotePatterns`
						<img
							src={url}
							alt="Vista previa del producto"
							width={36}
							height={36}
							className="size-full object-cover"
							onError={() => setFailedUrl(url)}
						/>
					) : (
						<ImageIcon aria-hidden className="size-4 text-muted-foreground" />
					)}
				</div>
				<Input
					id="imageURL"
					name="imageURL"
					type="url"
					inputMode="url"
					autoComplete="off"
					spellCheck={false}
					placeholder="https://cdn.ejemplo.com/cafe.png…"
					defaultValue={defaultValue}
					onChange={(event) => setUrl(event.target.value.trim())}
					aria-invalid={!!errors?.length}
					aria-describedby="imageURL-description"
				/>
			</div>
			<FieldDescription id="imageURL-description">
				Opcional. Enlace público a la imagen del producto.
			</FieldDescription>
			<FieldError errors={toFieldErrors(errors)} />
		</Field>
	);
}

function StockSection({
	shop,
	locations,
	values,
	errors,
}: {
	shop: string;
	locations: Location[];
	values: Record<string, string>;
	errors: Record<string, string[] | undefined>;
}) {
	return (
		<section className="flex flex-col gap-4" aria-labelledby="stock-heading">
			<div className="flex flex-col gap-1">
				<h2 id="stock-heading" className="text-sm font-medium">
					Inventario inicial
				</h2>
				<p className="text-sm text-muted-foreground">
					Define cuántas unidades hay en cada ubicación. Puedes dejarlo en
					blanco y ajustarlo después.
				</p>
			</div>

			<div className="flex min-w-0 items-center gap-2 text-sm">
				<FolderIcon aria-hidden className="size-4 shrink-0" />
				<span translate="no" className="truncate text-muted-foreground">
					{shop}
				</span>
				<span aria-hidden className="text-muted-foreground">
					/
				</span>
				<span>ubicaciones</span>
			</div>

			{locations.length === 0 ? (
				<NoLocations shop={shop} />
			) : (
				<ul className="ml-2 flex flex-col gap-2 border-l pl-4">
					{locations.map((location) => {
						const field = `${STOCK_FIELD_PREFIX}${location._id}`;

						return (
							<StockRow
								key={location._id}
								location={location}
								name={field}
								defaultValue={values[field]}
								errors={errors[field]}
							/>
						);
					})}
				</ul>
			)}
		</section>
	);
}

function StockRow({
	location,
	name,
	defaultValue,
	errors,
}: {
	location: Location;
	name: string;
	defaultValue?: string;
	errors?: string[];
}) {
	const id = `stock-${location._id}`;
	const isInvalid = !!errors?.length;

	return (
		<li
			data-invalid={isInvalid}
			className="flex flex-col gap-2 rounded-lg border px-3 py-2.5 transition-colors has-focus-visible:border-ring data-[invalid=true]:border-destructive/50"
		>
			<div className="flex items-center gap-3">
				<span
					aria-hidden
					className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted"
				>
					<MapPinIcon className="size-4 text-muted-foreground" />
				</span>
				<div className="flex min-w-0 flex-1 flex-col">
					<label htmlFor={id} className="truncate text-sm font-medium">
						{location.name}
					</label>
					<span className="truncate font-mono text-xs text-muted-foreground">
						{location.address || "Sin dirección"}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Input
						id={id}
						name={name}
						inputMode="numeric"
						autoComplete="off"
						placeholder="0"
						defaultValue={defaultValue}
						aria-invalid={isInvalid}
						aria-describedby={isInvalid ? `${id}-error` : undefined}
						className="w-20 text-right tabular-nums"
					/>
					<span className="hidden text-xs text-muted-foreground sm:inline">
						uds.
					</span>
				</div>
			</div>
			<FieldError id={`${id}-error`} errors={toFieldErrors(errors)} />
		</li>
	);
}

function NoLocations({ shop }: { shop: string }) {
	return (
		<div className="flex flex-col items-start gap-3 rounded-lg border border-dashed px-4 py-5">
			<p className="text-sm text-muted-foreground">
				Aún no tienes ubicaciones. El producto se creará sin stock; podrás
				asignarlo cuando agregues una.
			</p>
			<Button
				variant="outline"
				size="sm"
				nativeButton={false}
				render={<Link href={`/${shop}/locations`} />}
			>
				Crear una ubicación
			</Button>
		</div>
	);
}

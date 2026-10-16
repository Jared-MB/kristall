import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocations } from "@/modules/locations/services/get-locations";
import { ProductForm } from "./_components/product-form";

export default function NewProductPage({
	params,
}: PageProps<"/[shop]/products/new">) {
	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-10 py-4">
			<Suspense fallback={<ProductFormSkeleton />}>
				<NewProductForm params={params} />
			</Suspense>
		</main>
	);
}

export async function NewProductForm({
	params,
}: Pick<PageProps<"/[shop]">, "params">) {
	const [{ shop }, locations] = await Promise.all([params, getLocations()]);

	// No categories endpoint exists yet; the select offers "Sin categoría" only
	// until one does.
	return <ProductForm shop={shop} locations={locations} categories={[]} />;
}

/** Mirrors the form's sections so nothing shifts once locations arrive. */
export function ProductFormSkeleton() {
	return (
		<div className="flex flex-col gap-8 rounded-xl border bg-card p-6 sm:p-8">
			<div className="flex flex-col gap-4">
				<Skeleton className="h-9 w-56" />
				<Skeleton className="h-14 w-full" />
			</div>
			<Skeleton className="h-4 w-72" />
			<div className="grid gap-5 sm:grid-cols-2">
				<Skeleton className="h-15 w-full" />
				<Skeleton className="h-15 w-full" />
			</div>
			<Skeleton className="h-px w-full" />
			<Skeleton className="h-15 w-full" />
			<div className="flex flex-col gap-2">
				<Skeleton className="h-14 w-full" />
				<Skeleton className="h-14 w-full" />
			</div>
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

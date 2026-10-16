import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage({
	params,
}: PageProps<"/[shop]/products">) {
	return (
		<div>
			<header className="flex items-center justify-between">
				<h3>Products</h3>
				<Suspense fallback={<Skeleton className="h-9 w-32" />}>
					<NavigateToNewProductPage params={params} />
				</Suspense>
			</header>
		</div>
	);
}

async function NavigateToNewProductPage({
	params,
}: Pick<PageProps<"/[shop]/products">, "params">) {
	const { shop } = await params;

	return (
		<Button
			nativeButton={false}
			render={<Link href={`/${shop}/products/new`} />}
		>
			<Plus />
			Crear producto
		</Button>
	);
}

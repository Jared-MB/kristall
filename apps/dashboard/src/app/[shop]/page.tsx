import { Suspense } from "react";

export default function Home({ params }: PageProps<"/[shop]">) {
	return (
		<div className="flex flex-col flex-1 items-center justify-center ">
			<Suspense fallback={<div>Loading Name...</div>}>
				<ShopName params={params} />
			</Suspense>
			<Suspense fallback={<div>Loading more data...</div>}>
				<LoadingMoreData />
			</Suspense>
		</div>
	);
}

async function ShopName({ params }: Pick<PageProps<"/[shop]">, "params">) {
	const { shop } = await params;

	return <h1>{shop}</h1>;
}

async function LoadingMoreData() {
	await new Promise((resolve) => setTimeout(resolve, 5000));

	return <div>Data</div>;
}

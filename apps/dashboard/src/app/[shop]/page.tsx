import { Suspense } from "react";
import { OpenNewProductsFormButton } from "./_components/open-new-products-form";

export default function Home() {
	return (
		<div className="flex flex-col flex-1 items-center justify-center ">
			<Suspense fallback={<div>Loading more data...</div>}>
				<LoadingMoreData />
			</Suspense>
			<OpenNewProductsFormButton />
		</div>
	);
}

async function LoadingMoreData() {
	await new Promise((resolve) => setTimeout(resolve, 5000));

	return <div>Data</div>;
}

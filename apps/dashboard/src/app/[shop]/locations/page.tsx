import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/fonts";
import { getLocations } from "@/modules/locations/services/get-locations";
import { CreateLocation } from "./_components/create-location";
import { CreateLocationCard } from "./_components/create-location-card";
import { LocationCard } from "./_components/location-card";
import { LocationsSkeleton } from "./_components/locations-skeleton";

export default function LocationsPage() {
	return (
		<main className="flex flex-col gap-6">
			<header className="flex justify-between items-center">
				<Title>Ubicaciones</Title>
				<CreateLocation>
					<Button>Crear ubicación</Button>
				</CreateLocation>
			</header>
			<section className="grid grid-cols-3 gap-4">
				{/* Scoped to the grid so the heading and the create button paint
				    right away instead of falling back to the app-wide loader. */}
				<Suspense fallback={<LocationsSkeleton />}>
					<LocationsGrid />
				</Suspense>
			</section>
		</main>
	);
}

async function LocationsGrid() {
	const locations = await getLocations();

	return (
		<>
			<CreateLocationCard hasLocations={locations.length > 0} />
			{locations.map((location) => (
				<LocationCard key={location._id} location={location} />
			))}
		</>
	);
}

import type { Location } from "@kristall/api";
import {
	IconBuildingWarehouse,
	IconExternalLink,
	IconMapPin,
	IconPhone,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EditLocation } from "./edit-location";

/**
 * Server component: the whole location is already in the payload the page
 * rendered, so the edit dialog gets it as a prop instead of refetching it.
 */
export function LocationCard({ location }: { location: Location }) {
	return (
		<Card className="pt-6">
			<CardHeader className="px-6">
				<CardTitle className="flex flex-row gap-1 items-center">
					<IconBuildingWarehouse className="size-6" />
					<span className="text-xl">{location.name}</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 px-6">
				<div className="flex flex-col items-start justify-center gap-4 text-muted-foreground">
					<div className="flex flex-row gap-2 items-center">
						<IconMapPin className="size-5" />
						<span className="text-sm">{location.address || "Sin ubicación"}</span>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<IconPhone className="size-5" />
						<span className="text-sm">{location.phone || "Sin teléfono"}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="px-6">
				<Button variant="ghost" className="ml-auto">
					<IconExternalLink />
					Ver inventario
				</Button>
				<EditLocation location={location}>
					<Button variant="secondary">Editar</Button>
				</EditLocation>
			</CardFooter>
		</Card>
	);
}

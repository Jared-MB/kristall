import { IconMapPinExclamation, IconMapPinPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { CreateLocation } from "./create-location";

export function CreateLocationCard({
	hasLocations,
}: {
	hasLocations: boolean;
}) {
	return (
		<CreateLocation>
			<Empty className="border border-dashed cursor-pointer">
				{hasLocations ? (
					<EmptyHeader>
						<EmptyMedia variant="icon" className="size-16 rounded-2xl">
							<IconMapPinPlus className="size-10" />
						</EmptyMedia>
						<EmptyTitle>Crear nueva ubicación</EmptyTitle>
						<EmptyDescription>
							Agrega más ubicaciones para gestionar mejor tus productos
						</EmptyDescription>
					</EmptyHeader>
				) : (
					<EmptyHeader>
						<EmptyMedia variant="icon" className="size-16 rounded-2xl">
							<IconMapPinExclamation className="size-10" />
						</EmptyMedia>
						<EmptyTitle>No se encontró ninguna ubicación</EmptyTitle>
						<EmptyDescription>
							Agrega una ubicación para poder empezar a crear productos
						</EmptyDescription>
					</EmptyHeader>
				)}
				<EmptyContent>
					<Button>Crear ubicación</Button>
				</EmptyContent>
			</Empty>
		</CreateLocation>
	);
}

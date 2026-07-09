import { IconLoader } from "@tabler/icons-react";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";

export default function RootLoading() {
	return (
		<div className="fixed inset-0 z-50 grid place-content-center bg-card/50 backdrop-blur-sm">
			<Marker role="status" className="flex-col">
				<MarkerIcon className="size-12">
					<IconLoader className="animate-spin duration-1000 size-12" />
				</MarkerIcon>
				<MarkerContent className="text-2xl shimmer">
					Autenticando&hellip;
				</MarkerContent>
			</Marker>
		</div>
	);
}

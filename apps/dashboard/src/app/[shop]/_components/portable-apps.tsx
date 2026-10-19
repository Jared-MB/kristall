import {
	DesktopApp,
	WindowActions,
	WindowClose,
	WindowContent,
	WindowExpand,
	WindowHeader,
	WindowMinimize,
	WindowName,
} from "@dayos/core";
import { MapPinPlus, Minus, PackagePlus, Square, X } from "lucide-react";
import { Suspense } from "react";
import { Window } from "@/components/ui/dayos";
import {
	CreateLocationForm,
	CreateLocationSubmit,
} from "../locations/_components/create-location";
import { LocationFormFields } from "../locations/_components/location-form";
import { NewProductForm, ProductFormSkeleton } from "../products/new/page";
import { type AvailableApp, OpenedApps } from "./opened-apps";

const APPS: AvailableApp[] = [
	{ id: "new-product", name: "New Product", icon: <PackagePlus /> },
	{ id: "new-location", name: "Nueva ubicación", icon: <MapPinPlus /> },
];

export function PortableApps({ params }: Pick<PageProps<"/[shop]">, "params">) {
	return (
		<>
			<DesktopApp id="new-product">
				<Window>
					<WindowHeader className="border-b border-b-border px-4 py-2 font-mono active:cursor-grabbing flex items-center justify-between">
						<WindowName>New Product</WindowName>
						<WindowActions className="[&_svg]:size-4 [&_button]:hover:bg-muted [&_button]:p-1 [&_button]:rounded-sm flex justify-center gap-2">
							<WindowMinimize>
								<Minus />
							</WindowMinimize>
							<WindowExpand>
								<Square />
							</WindowExpand>
							<WindowClose>
								<X />
							</WindowClose>
						</WindowActions>
					</WindowHeader>
					<WindowContent>
						<Suspense fallback={<ProductFormSkeleton />}>
							<NewProductForm params={params} />
						</Suspense>
					</WindowContent>
				</Window>
			</DesktopApp>
			<DesktopApp id="new-location">
				<Window defaultSize={{ width: 520, height: 460 }}>
					<WindowHeader className="border-b border-b-border px-4 py-2 font-mono active:cursor-grabbing flex items-center justify-between">
						<WindowName>Nueva ubicación</WindowName>
						<WindowActions className="[&_svg]:size-4 [&_button]:hover:bg-muted [&_button]:p-1 [&_button]:rounded-sm flex justify-center gap-2">
							<WindowMinimize>
								<Minus />
							</WindowMinimize>
							<WindowClose>
								<X />
							</WindowClose>
						</WindowActions>
					</WindowHeader>
					<WindowContent>
						<CreateLocationForm className="flex flex-col gap-6 p-4">
							<LocationFormFields />
							<div className="flex justify-end">
								<CreateLocationSubmit />
							</div>
						</CreateLocationForm>
					</WindowContent>
				</Window>
			</DesktopApp>
			<OpenedApps availableApps={APPS} />
		</>
	);
}

import { IconMapPin, IconPackage } from "@tabler/icons-react";
import type { JSX } from "react/jsx-runtime";

type Links = {
	group: string;
	items: {
		label: string;
		url: string;
		icon: JSX.Element;
	}[];
}[];

export const LINKS: Links = [
	{
		group: "Gestión",
		items: [
			{
				label: "Productos",
				url: "/products",
				icon: <IconPackage />,
			},
			{
				label: "Ubicaciones",
				url: "/locations",
				icon: <IconMapPin />,
			},
		],
	},
] as const;

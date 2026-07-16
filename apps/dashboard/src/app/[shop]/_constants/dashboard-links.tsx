import { IconPackage } from "@tabler/icons-react";

export const LINKS = [
	{
		group: "Gestión",
		items: [
			{
				label: "Productos",
				url: "/products",
				icon: <IconPackage />,
			},
		],
	},
] as const;

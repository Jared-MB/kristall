"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { LINKS } from "../_constants/dashboard-links";

export function SidebarLink({
	item,
}: {
	item: (typeof LINKS)[number]["items"][number];
}) {
	const { shop } = useParams<{ shop: string }>();
	const pathName = usePathname();

	const href = `/${shop}${item.url}` as const;

	return (
		<SidebarMenuButton
			render={<Link href={href} />}
			isActive={pathName.startsWith(href)}
		>
			{item.icon}
			{item.label}
		</SidebarMenuButton>
	);
}

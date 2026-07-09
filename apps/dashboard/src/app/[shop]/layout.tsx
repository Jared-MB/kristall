import { IconSelector } from "@tabler/icons-react";

import { Suspense } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { getProfile } from "@/modules/auth/services/get-profile.action";

import { SidebarUser } from "./_components/sidebar-user";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="w-full">
				<header className="h-16 border-b border-b-border">
					<SidebarTrigger />
				</header>
				{children}
			</div>
		</SidebarProvider>
	);
}

function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<h2>Kristall</h2>
			</SidebarHeader>
			<SidebarContent></SidebarContent>
			<SidebarFooter>
				<Suspense fallback={<SidebarProfileSkeleton />}>
					<SidebarProfile />
				</Suspense>
			</SidebarFooter>
		</Sidebar>
	);
}

async function SidebarProfile() {
	const profile = await getProfile();

	return (
		<SidebarUser
			user={{
				name: profile.name,
				email: profile.email,
				avatar: profile.name,
			}}
		/>
	);
}

export function SidebarProfileSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-8 w-8 rounded-full">
						<AvatarFallback className="rounded-full"></AvatarFallback>
					</Avatar>
					<div className="grid flex-1 gap-1 text-left text-sm leading-tight">
						<Skeleton className="w-full h-4 rounded-full" />
						<Skeleton className="w-full h-3 rounded-full" />
					</div>
					<IconSelector className="ml-auto size-4" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

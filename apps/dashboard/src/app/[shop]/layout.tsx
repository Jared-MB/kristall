import { IconSelector } from "@tabler/icons-react";
import { Suspense } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile } from "@/modules/auth/services/get-profile.action";
import { SidebarLink } from "./_components/sidebar-link";
import { SidebarUser } from "./_components/sidebar-user";
import { LINKS } from "./_constants/dashboard-links";

export default function HomeLayout({
	children,
	params,
}: LayoutProps<"/[shop]">) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="w-full">
				<header className="h-16 border-b border-b-border px-6 flex items-center gap-4">
					<SidebarTrigger />
					<Suspense fallback={<div>Loading Name...</div>}>
						<ShopName params={params} />
					</Suspense>
				</header>
				<div className="p-6">{children}</div>
			</div>
		</SidebarProvider>
	);
}

async function ShopName({ params }: Pick<LayoutProps<"/[shop]">, "params">) {
	const { shop } = await params;

	return <h1 className="font-mono">{shop}</h1>;
}

function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="h-16 justify-center items-center">
				<h2 className="text-purple-500 text-3xl">Kristall</h2>
			</SidebarHeader>
			<SidebarContent>
				{LINKS.map((link) => (
					<SidebarGroup key={link.group}>
						<SidebarGroupLabel>{link.group}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{link.items.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarLink item={item} />
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
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

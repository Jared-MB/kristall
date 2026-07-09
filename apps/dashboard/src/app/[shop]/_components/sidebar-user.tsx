"use client";

import {
	IconBadge,
	IconBell,
	IconCreditCard,
	IconDeviceLaptop,
	IconLogout,
	IconMoon,
	IconSelector,
	IconSparkles,
	IconSun,
} from "@tabler/icons-react";

import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import { logout } from "@/modules/auth/services/logout.action";

export function SidebarUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();

	const initials = user.name
		.split(" ")
		.map((name) => name[0])
		.join("");

	const userAvatarFallback = initials.slice(0, 2);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-full">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-full capitalize">
									{userAvatarFallback}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<IconSelector className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-full">
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className="rounded-full capitalize">
										{userAvatarFallback}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconSparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconBadge />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconCreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<IconBell />
								Notifications
							</DropdownMenuItem>
							<ThemeSwitch />
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<button
								type="button"
								className="w-full"
								onClick={async () => {
									await logout();
								}}
							>
								<IconLogout />
								Log out
							</button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function ThemeSwitch() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				{theme === "light" ? <IconSun /> : <IconMoon />}
				Tema
			</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuItem onClick={() => setTheme("light")}>
						<IconSun />
						Claro
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						<IconMoon />
						Oscuro
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						<IconDeviceLaptop />
						Sistema
					</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}

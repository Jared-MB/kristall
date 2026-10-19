"use client";

import { useDesktop } from "@dayos/core";
import type { ReactNode } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AvailableApp = {
	id: string;
	name: string;
	icon: ReactNode;
};

type AppStatus = "open" | "minimized" | "closed";

type Desktop = ReturnType<typeof useDesktop>;

function getAppStatus(desktop: Desktop, id: string): AppStatus {
	if (desktop.openWindows.includes(id)) return "open";
	if (desktop.minimizedWindows.includes(id)) return "minimized";
	return "closed";
}

// Taskbar semantics: a click opens a closed or minimized app, brings an open
// one to the front, and minimizes the one that's already in front.
function toggleApp(desktop: Desktop, id: string, status: AppStatus) {
	if (status !== "open") return desktop.openWindow(id);
	if (desktop.activeWindowId === id) {
		return desktop.closeWindow(id, { keepMounted: true });
	}
	desktop.focusWindow(id);
}

export function OpenedApps({
	availableApps,
}: {
	availableApps: AvailableApp[];
}) {
	const desktop = useDesktop();

	if (availableApps.length <= 0) return null;

	return (
		// Above every window, like macOS: DayOS stacks windows from z-index 1 up,
		// and the genie canvas sits on this same layer, just under the dock.
		// Below `z-50` so dialogs, sheets and popovers still cover it.
		<nav
			aria-label="Apps"
			className="fixed bottom-[max(--spacing(4),env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-xl bg-background p-1.5 ring-1 ring-border shadow-lg"
		>
			{availableApps.map((app) => {
				const status = getAppStatus(desktop, app.id);
				const isActive = status === "open" && desktop.activeWindowId === app.id;

				return (
					<Tooltip key={app.id}>
						<TooltipTrigger
							render={
								<button
									type="button"
									aria-label={`${app.name} (${status})`}
									aria-pressed={isActive}
									data-status={status}
									// Where the window's genie animation lands and takes off.
									data-genie-target={app.id}
									onClick={() => toggleApp(desktop, app.id, status)}
									className={cn(
										"relative isolate grid size-10 place-content-center rounded-lg text-muted-foreground cursor-pointer touch-manipulation transition-[background-color,color,scale] hover:bg-muted hover:text-foreground active:scale-97 focus-visible:outline-2 focus-visible:outline-ring [&_svg]:size-5",
										isActive && "bg-muted text-foreground",
									)}
								/>
							}
						>
							{app.icon}
							<StatusIndicator status={status} />
						</TooltipTrigger>
						<TooltipContent side="top">{app.name}</TooltipContent>
					</Tooltip>
				);
			})}
		</nav>
	);
}

// Shape, not just color, tells the states apart: a bar for open, a dot for
// minimized, nothing for closed.
function StatusIndicator({ status }: { status: AppStatus }) {
	if (status === "closed") return null;

	return (
		<span
			aria-hidden
			className={cn(
				"absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full",
				status === "open" ? "w-3 bg-primary" : "w-0.5 bg-muted-foreground",
			)}
		/>
	);
}

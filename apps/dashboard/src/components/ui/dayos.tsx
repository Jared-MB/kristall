"use client";

import {
	Window as DayOSWindow,
	useDesktop,
	useDesktopApp,
	useWindowPresence,
} from "@dayos/core";
import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { useGeniePresence } from "@/hooks/use-genie-presence";
import { cn } from "@/lib/utils";

type BodyProps = HTMLMotionProps<"section"> & {
	"data-maximized"?: string;
};

function AnimatedWindowBody({ className, ...props }: BodyProps) {
	const ref = useRef<HTMLElement>(null);
	const { id } = useDesktopApp();
	const { isPresent, safeToRemove } = useWindowPresence();
	const reduceMotion = useReducedMotion();

	// Open, close and minimize play a genie in and out of the app's dock tile.
	const opacity = useGeniePresence({
		ref,
		appId: id,
		isPresent,
		safeToRemove,
	});

	// DayOS resizes and moves the `Rnd` box in a single frame when maximizing,
	// so there's nothing to tween here: `layout` measures the box before and
	// after the commit and plays the difference back as a transform (FLIP).
	const isMaximized = props["data-maximized"] !== undefined;

	// Dragging a maximized window restores it in the same render that flips
	// `isInteracting`, and that restore must snap under the cursor. So the
	// layout only re-measures on toggles that happen outside a drag.
	const { isInteracting } = useDesktop();
	const [prevMaximized, setPrevMaximized] = useState(isMaximized);
	const [layoutKey, setLayoutKey] = useState(0);

	if (prevMaximized !== isMaximized) {
		setPrevMaximized(isMaximized);
		if (!isInteracting) setLayoutKey((key) => key + 1);
	}

	return (
		<motion.section
			{...props}
			ref={ref}
			className={cn(
				"overflow-hidden border bg-background data-maximized:border-0 h-full relative data-maximized:z-10",
				className,
			)}
			// In px and inline, not `var(--radius-md)`: motion can only
			// scale-correct px radii during the FLIP. 8px is `--radius-md`.
			style={{ ...props.style, opacity, borderRadius: isMaximized ? 0 : 8 }}
			// Only maximize/restore animates: drags and resizes must track the
			// pointer 1:1.
			layout={!reduceMotion}
			layoutDependency={layoutKey}
			transition={{ layout: { duration: 0.24, type: "spring", bounce: 0 } }}
		/>
	);
}

type WindowProps = Omit<React.ComponentProps<typeof DayOSWindow>, "render">;

export function Window({ className, ...props }: WindowProps) {
	return (
		<DayOSWindow
			{...props}
			render={<AnimatedWindowBody className={className} />}
		/>
	);
}

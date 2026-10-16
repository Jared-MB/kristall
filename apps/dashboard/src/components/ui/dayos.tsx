"use client";

import {
	Window as DayOSWindow,
	useDesktop,
	useWindowPresence,
} from "@dayos/core";
import { type HTMLMotionProps, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BodyProps = HTMLMotionProps<"section"> & {
	"data-maximized"?: string;
};

function AnimatedWindowBody({ className, layoutId, ...props }: BodyProps) {
	const { isPresent, safeToRemove } = useWindowPresence();
	const reduceMotion = useReducedMotion();

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

	// Opacity only: the `layoutId` morph into the dock button already carries
	// the size change, and a scale of its own would play on top of it.
	const variants = {
		open: { opacity: 1 },
		closed: { opacity: 0.1 },
	};

	return (
		<motion.section
			{...props}
			className={cn(
				"overflow-hidden border bg-background data-maximized:border-0 h-full relative data-maximized:z-10",
				className,
			)}
			// In px and inline, not `var(--radius-md)`: motion can only
			// scale-correct and interpolate px radii during the morph. 8px is
			// `--radius-md`.
			style={{ ...props.style, borderRadius: isMaximized ? 0 : 8 }}
			variants={variants}
			// Without driving the variants from `isPresent` the exit never plays,
			// `safeToRemove` never runs, and DayOS keeps the closed window's box on
			// the desktop, invisible but still catching the pointer.
			initial="closed"
			animate={isPresent ? "open" : "closed"}
			// Only maximize/restore animates: drags and resizes must track the
			// pointer 1:1.
			layoutId={layoutId}
			layout={!reduceMotion}
			layoutDependency={layoutKey}
			transition={{
				duration: 0.3,
				type: "spring",
				bounce: 0,
				layout: { duration: 0.24, type: "spring", bounce: 0 },
			}}
			onAnimationComplete={(definition) => {
				if (!isPresent && definition === "closed") safeToRemove();
			}}
		/>
	);
}

type WindowProps = Omit<React.ComponentProps<typeof DayOSWindow>, "render"> & {
	layoutId?: string;
};

export function Window({ className, layoutId, ...props }: WindowProps) {
	return (
		<DayOSWindow
			{...props}
			render={<AnimatedWindowBody className={className} layoutId={layoutId} />}
		/>
	);
}

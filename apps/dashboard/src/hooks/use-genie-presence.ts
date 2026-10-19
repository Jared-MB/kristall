import { type MotionValue, useMotionValue } from "motion/react";
import { type RefObject, useLayoutEffect, useRef } from "react";
import { createFade } from "@/lib/fade-effect";
import { createGenie, type Genie, type GenieDirection } from "@/lib/genie-effect";

function findDockTile(appId: string) {
	return document.querySelector(`[data-genie-target="${CSS.escape(appId)}"]`);
}

// The window's `layout` projection rewrites its inline opacity on every
// render, wiping any opacity set from outside. So it goes through the motion
// value motion renders from, and inline too: motion only renders on its next
// frame, while the genie's canvas comes and goes in this one.
function setOpacity(
	element: HTMLElement,
	opacity: MotionValue<number>,
	value: number,
) {
	opacity.jump(value);
	element.style.opacity = String(value);
}

function createAnimator(
	element: HTMLElement,
	opacity: MotionValue<number>,
	appId: string,
	direction: GenieDirection,
): Genie {
	const fade = createFade(opacity);
	const target = findDockTile(appId);
	const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (!target || reduceMotion) return fade;

	return createGenie({
		source: element,
		target,
		progress: direction === "open" ? 1 : 0,
		hideSource: () => setOpacity(element, opacity, 0),
		fallback: fade,
	});
}

/**
 * Plays the genie out of the app's dock tile when the window opens and back
 * into it when it closes or minimizes, then lets DayOS remove the window.
 * Flipping direction mid-way picks up from where the genie is, velocity
 * included, instead of starting over.
 *
 * Returns the window's opacity: pass it to the window's `style`.
 */
export function useGeniePresence({
	ref,
	appId,
	isPresent,
	safeToRemove,
}: {
	ref: RefObject<HTMLElement | null>;
	appId: string;
	isPresent: boolean;
	safeToRemove: () => void;
}): MotionValue<number> {
	// Hidden from the first render: every window genies in.
	const opacity = useMotionValue(0);
	const animatorRef = useRef<Genie | null>(null);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		const direction: GenieDirection = isPresent ? "open" : "minimize";

		const play = () => {
			animatorRef.current ??= createAnimator(
				element,
				opacity,
				appId,
				direction,
			);
			const animator = animatorRef.current;

			// `false` means a later `play` took over: that one settles instead.
			animator.play(direction).then((completed) => {
				if (!completed) return;
				setOpacity(element, opacity, isPresent ? 1 : 0);
				animator.destroy();
				animatorRef.current = null;
				if (!isPresent) safeToRemove();
			});
		};

		// Interrupting, or closing: the window is where it is, go now.
		if (animatorRef.current || !isPresent) return play();

		// A fresh open is measured a frame late: DayOS settles its position
		// after this effect runs. Hidden meanwhile so it doesn't flash in place.
		setOpacity(element, opacity, 0);
		const frame = requestAnimationFrame(play);
		return () => cancelAnimationFrame(frame);
	}, [ref, opacity, appId, isPresent, safeToRemove]);

	useLayoutEffect(
		() => () => {
			animatorRef.current?.destroy();
			animatorRef.current = null;
		},
		[],
	);

	return opacity;
}

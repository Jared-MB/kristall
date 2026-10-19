// macOS-style "genie": the window pinches into a curved funnel toward its
// dock tile and slides down through it. A bend like that isn't affine, so no
// CSS transform can draw it: the window is snapshotted once and the snapshot
// is warped on the GPU (see `genie-renderer.ts`).

import { domToCanvas } from "modern-screenshot";
import { motionValue } from "motion";
import {
	createGenieRenderer,
	type GenieFrame,
	type GenieRect,
	type GenieRenderer,
} from "@/lib/genie-renderer";
import {
	type InterruptibleAnimation,
	interruptibleAnimate,
} from "@/lib/interruptible-animate";

// Critically damped (`bounce: 0`) and settling in ~480ms. Physical values and
// not a `duration`: a duration-based spring ignores the starting velocity,
// which an interrupted genie needs to carry over.
const GENIE_STIFFNESS = 420;
const GENIE_DAMPING = 2 * Math.sqrt(GENIE_STIFFNESS);
// A slow image shouldn't hold the window up: past this, it fades instead.
const SNAPSHOT_TIMEOUT_MS = 2000;

export type GenieDirection = "minimize" | "open";

/** Progress 0 is the window in place, 1 is the window inside its tile. */
const PROGRESS_TARGET: Record<GenieDirection, number> = { open: 0, minimize: 1 };

export type Genie = {
	/**
	 * Springs toward the window (`open`) or the tile (`minimize`) from wherever
	 * the genie is now, keeping its velocity. Resolves `true` once it lands,
	 * `false` if another `play` or `destroy` took over first.
	 */
	play: (direction: GenieDirection) => Promise<boolean>;
	destroy: () => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

function genieFrame(
	from: GenieRect,
	to: GenieRect,
	progress: number,
): GenieFrame {
	// The funnel forms first, then the content slides down through it. The
	// bottom edge lands sooner than the top, so the window compresses. Both
	// phases are linear in `progress`: the spring already eases it.
	const bend = clamp01(progress / 0.45);
	const slide = clamp01((progress - 0.2) / 0.8);

	return {
		from,
		to,
		bend,
		top: lerp(from.top, to.top, slide),
		bottom: lerp(from.bottom, to.bottom, clamp01(slide * 1.4)),
	};
}

function createOverlay(target: Element) {
	// On the dock's layer, which sits above every window, and just before it
	// in the DOM: the window slides *into* the tile instead of over it, and
	// never behind another open window.
	const dock = target.closest("nav") ?? target;
	const overlay = document.createElement("canvas");
	overlay.setAttribute("aria-hidden", "true");
	Object.assign(overlay.style, {
		position: "fixed",
		inset: "0",
		width: "100%",
		height: "100%",
		zIndex: getComputedStyle(dock).zIndex,
		pointerEvents: "none",
	});

	if (dock.parentElement) dock.parentElement.insertBefore(overlay, dock);
	else document.body.append(overlay);
	return overlay;
}

async function snapshot(
	source: HTMLElement,
	rect: GenieRect,
	renderer: GenieRenderer,
) {
	const longestSide = Math.max(rect.width, rect.height, 1);
	const scale = Math.min(
		window.devicePixelRatio,
		renderer.maxTextureSize / longestSide,
	);
	const image = await domToCanvas(source, {
		scale,
		timeout: SNAPSHOT_TIMEOUT_MS,
		// The window may be hidden or mid-maximize when it's captured.
		style: { opacity: "1", transform: "none" },
	});
	renderer.setImage(image);
}

export function createGenie({
	source,
	target,
	progress,
	hideSource,
	fallback,
}: {
	source: HTMLElement;
	target: Element;
	/** Where the genie starts: 0 over the window, 1 inside the tile. */
	progress: number;
	/**
	 * Hides the real window, synchronously. Runs once the genie's first frame
	 * is drawn over it; the window comes back once the genie lands on it.
	 */
	hideSource: () => void;
	/** Plays instead when the window can't be snapshotted or drawn. */
	fallback: Genie;
}): Genie {
	// Measured and snapshotted once: an interrupted genie reuses the image.
	const from = source.getBoundingClientRect();
	const to = target.getBoundingClientRect();

	const overlay = createOverlay(target);
	const value = motionValue(progress);
	let renderer: GenieRenderer | undefined;
	let animation: InterruptibleAnimation | undefined;
	let unsubscribe = () => {};
	// Bumped by every `play` and by `destroy`: a play that's been overtaken
	// while waiting on the snapshot settles `false` without running.
	let generation = 0;
	let destroyed = false;

	const ready = (async () => {
		renderer = createGenieRenderer(overlay);
		await snapshot(source, from, renderer);
		if (destroyed) throw new Error("Genie: destroyed while snapshotting");

		const draw = (latest: number) =>
			renderer?.draw(genieFrame(from, to, latest));
		draw(value.get());
		unsubscribe = value.on("change", draw);
		hideSource();
	})();
	// A failed snapshot is handled by `play`, which fades instead.
	ready.catch(() => {});

	function spring(direction: GenieDirection) {
		animation?.stop();
		// Animating the same motion value carries its velocity over.
		animation = interruptibleAnimate(value, PROGRESS_TARGET[direction], {
			type: "spring",
			stiffness: GENIE_STIFFNESS,
			damping: GENIE_DAMPING,
			restDelta: 0.001,
			restSpeed: 0.01,
		});
		return animation.finished;
	}

	return {
		play(direction) {
			const current = ++generation;
			const isCurrent = () => current === generation;

			return ready.then(
				() => (isCurrent() ? spring(direction) : false),
				() => (isCurrent() ? fallback.play(direction) : false),
			);
		},
		destroy() {
			destroyed = true;
			generation++;
			animation?.stop();
			unsubscribe();
			fallback.destroy();
			renderer?.destroy();
			overlay.remove();
		},
	};
}

import type { MotionValue } from "motion";
import type { Genie, GenieDirection } from "@/lib/genie-effect";
import {
	type InterruptibleAnimation,
	interruptibleAnimate,
} from "@/lib/interruptible-animate";

const FADE_DURATION_S = 0.15;

const OPACITY: Record<GenieDirection, number> = { open: 1, minimize: 0 };

// The genie's stand-in: without a dock tile to aim at, with reduced motion,
// or when the window can't be snapshotted. It picks up from the opacity it's
// at, so an interrupted fade doesn't flash.
export function createFade(opacity: MotionValue<number>): Genie {
	let animation: InterruptibleAnimation | undefined;

	return {
		play(direction) {
			const to = OPACITY[direction];
			animation?.stop();
			animation = interruptibleAnimate(opacity, to, {
				duration: FADE_DURATION_S * Math.abs(to - opacity.get()),
				ease: "easeOut",
			});
			return animation.finished;
		},
		destroy: () => animation?.stop(),
	};
}

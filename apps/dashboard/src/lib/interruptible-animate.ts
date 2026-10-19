import { animate, type MotionValue, type ValueAnimationTransition } from "motion";

export type InterruptibleAnimation = {
	/** `true` once it lands, `false` if `stop` ran first. */
	finished: Promise<boolean>;
	stop: () => void;
};

// Motion's own `stop()` leaves its promise pending forever, which would strand
// whoever awaits it.
export function interruptibleAnimate(
	value: MotionValue<number>,
	target: number,
	transition: ValueAnimationTransition<number>,
): InterruptibleAnimation {
	let stop = () => {};
	const finished = new Promise<boolean>((resolve) => {
		const controls = animate(value, target, {
			...transition,
			onComplete: () => resolve(true),
		});
		stop = () => {
			controls.stop();
			resolve(false);
		};
	});

	return { finished, stop };
}

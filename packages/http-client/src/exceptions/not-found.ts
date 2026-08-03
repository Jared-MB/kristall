export class NotFoundException extends Error {
	status: number;
	message: string;

	constructor(message: string) {
		super(message);
		this.status = 404;
		this.message = message;

		Object.defineProperty(this, "name", {
			value: "NotFoundException",
		});

		// `captureStackTrace` is a V8/Node API absent from the DOM lib and from
		// some runtimes (e.g. React Native/Hermes), so feature-detect it via a
		// typed cast to keep this package portable across platforms.
		const captureStackTrace = (
			Error as ErrorConstructor & {
				captureStackTrace?: (
					target: object,
					constructor?: unknown,
				) => void;
			}
		).captureStackTrace;

		if (captureStackTrace) {
			captureStackTrace(this, NotFoundException);
		}
	}
}

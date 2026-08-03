import { NotFoundException } from "./not-found";

export const exceptionHandler = (response: Response) => {
	if (response.status === 404) {
		throw new NotFoundException(`${response.statusText} - ${response.url}`);
	}
};

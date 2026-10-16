"use client";

import { useDesktop } from "@dayos/core";
import { Button } from "@/components/ui/button";

export function OpenNewProductsFormButton() {
	const { openWindow } = useDesktop();

	return (
		<Button type="button" onClick={() => openWindow("new-product")}>
			Click to open "New Products"
		</Button>
	);
}

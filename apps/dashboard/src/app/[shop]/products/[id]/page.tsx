"use client";

import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
	const { id } = useParams<{ id: string }>();

	return <main>Product Details: {id}</main>;
}

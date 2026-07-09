import { redirect } from "next/navigation";
import { getShop } from "@/modules/shop/services/get-shop.action";

export default async function Home() {
	const shop = await getShop();

	redirect(`/${shop.name}`);
}

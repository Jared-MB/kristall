import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	type Relation,
} from "typeorm";
import { Location } from "../../locations/entities/location.entity";
import { Product } from "./product.entity";

@Entity()
export class ProductLocation {
	@PrimaryColumn("uuid", { name: "product_id" })
	productId: string;

	@PrimaryColumn("uuid", { name: "location_id" })
	locationId: string;

	@Index()
	@Column("uuid", { name: "shop_id" })
	shopId: string;

	@ManyToOne(() => Product, { onDelete: "CASCADE" })
	@JoinColumn([
		{ name: "product_id", referencedColumnName: "_id" },
		{ name: "shop_id", referencedColumnName: "shopId" },
	])
	product: Relation<Product>;

	@ManyToOne(() => Location, { onDelete: "CASCADE" })
	@JoinColumn([
		{ name: "location_id", referencedColumnName: "_id" },
		{ name: "shop_id", referencedColumnName: "shopId" },
	])
	location: Relation<Location>;

	@Column("int", { default: 0 })
	stock: number;
}

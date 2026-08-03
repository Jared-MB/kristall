import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
} from "typeorm";
import { Shop } from "../../shops/entities/shop.entity";
import { Category } from "./category.entity";

@Entity()
@Unique(["_id", "shopId"])
export class Product {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@Column()
	name: string;

	@Index()
	@Column("uuid", { name: "shop_id" })
	shopId: string;

	@ManyToOne(() => Shop, { onDelete: "CASCADE", nullable: false })
	@JoinColumn({ name: "shop_id", referencedColumnName: "_id" })
	shop: Relation<Shop>;

	@Column("uuid", { name: "category_id", nullable: true })
	categoryId: string | null;

	@ManyToOne(() => Category, { onDelete: "RESTRICT", nullable: true })
	@JoinColumn([
		{ name: "category_id", referencedColumnName: "_id" },
		{ name: "shop_id", referencedColumnName: "shopId" },
	])
	category: Relation<Category> | null;

	@Column({
		nullable: true,
	})
	imageURL?: string;
}

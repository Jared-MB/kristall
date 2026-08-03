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

@Entity()
@Unique(["_id", "shopId"])
export class Location {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	phone: string;

	@Index()
	@Column("uuid", { name: "shop_id" })
	shopId: string;

	@ManyToOne(() => Shop, { onDelete: "CASCADE", nullable: false })
	@JoinColumn({ name: "shop_id", referencedColumnName: "_id" })
	shop: Relation<Shop>;
}

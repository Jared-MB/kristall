import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { Shop } from "../../shops/entities/shop.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@Column()
	email: string;

	@Column()
	name: string;

	@Column()
	role: string;

	// Expuesta como columna para poder firmar el JWT sin cargar la relación.
	@Column("uuid", { name: "shop_id", nullable: true })
	shopId: string | null;

	@ManyToOne(
		() => Shop,
		(shop) => shop.users,
	)
	@JoinColumn({ name: "shop_id", referencedColumnName: "_id" })
	shop: Relation<Shop>;
}

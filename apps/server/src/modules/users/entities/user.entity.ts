import {
	Column,
	Entity,
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

	@ManyToOne(
		() => Shop,
		(shop) => shop.users,
	)
	shop: Relation<Shop>;
}

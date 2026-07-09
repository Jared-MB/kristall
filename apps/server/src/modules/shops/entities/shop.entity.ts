import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Shop {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@Column()
	name: string;

	@OneToMany(
		() => User,
		(user) => user.shop,
	)
	users: Relation<User>[];
}

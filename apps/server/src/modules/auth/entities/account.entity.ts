import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Account {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@Column()
	password: string;
}

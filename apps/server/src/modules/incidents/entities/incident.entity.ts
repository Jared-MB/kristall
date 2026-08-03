import { MODULES_ARRAY, type Modules } from "@kristall/shared";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Incident {
	@PrimaryGeneratedColumn("uuid")
	_id: string;

	@Column({
		nullable: false,
		type: "enum",
		enum: MODULES_ARRAY,
	})
	module: Modules;

	@ManyToOne(() => User)
	user: User;

	@Column({
		nullable: false,
	})
	action: string;

	@Column({
		type: "enum",
		enum: ["INFO", "WARNING", "ERROR"],
		default: "INFO",
	})
	type: "INFO" | "WARNING" | "ERROR";

	@Column("jsonb", {
		nullable: true,
	})
	meta: Record<string, unknown>;

	@Column("timestamptz", { default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;
}

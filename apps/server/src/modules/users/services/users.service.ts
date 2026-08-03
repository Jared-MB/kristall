import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	public findOneByEmail(email: string) {
		return this.userRepository.findOneBy({ email });
	}

	public findOneById(userId: string): Promise<Omit<User, "shop"> | null> {
		return this.userRepository.findOneBy({ _id: userId });
	}

	public createOne(params: CreateUserDto) {
		return this.userRepository.create({
			email: params.email,
			name: params.name,
			role: params.role,
			shopId: params.shopId,
		});
	}

	public saveOne(user: User) {
		return this.userRepository.save(user);
	}
}

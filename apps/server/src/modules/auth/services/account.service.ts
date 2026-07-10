import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";
import { Repository } from "typeorm";
import { CreateAccountDto } from "../dtos/create-account.dto";
import { Account } from "../entities/account.entity";

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(Account)
		private accountRepository: Repository<Account>,
	) {}

	public findOneByUserId(userId: string) {
		return this.accountRepository.findOneBy({
			user: {
				_id: userId,
			},
		});
	}

	public async createOne(account: CreateAccountDto) {
		const hashedPassword = await argon2.hash(account.password);

		return this.accountRepository.create({
			password: hashedPassword,
			user: {
				_id: account.userId,
			},
		});
	}

	public verifyPassword(hashedPassword: string, plainPassword: string) {
		return argon2.verify(hashedPassword, plainPassword);
	}

	public saveOne(account: Account) {
		return this.accountRepository.save(account);
	}
}

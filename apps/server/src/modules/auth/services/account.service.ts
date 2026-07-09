import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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

	public createOne(account: CreateAccountDto) {
		return this.accountRepository.create({
			password: account.password,
			user: {
				_id: account.userId,
			},
		});
	}

	public saveOne(account: Account) {
		return this.accountRepository.save(account);
	}
}

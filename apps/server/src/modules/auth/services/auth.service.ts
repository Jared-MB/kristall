import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DataSource } from "typeorm";
import { CreateShopDto } from "../../shops/dtos/create-shop.dto";
import { ShopsService } from "../../shops/services/shops.service";
import { CreateUserDto } from "../../users/dtos/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { CreateAccountDto } from "../dtos/create-account.dto";
import { AccountService } from "./account.service";

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private accountService: AccountService,
		private shopsService: ShopsService,
		private jwtService: JwtService,
		private dataSource: DataSource,
	) {}

	public async validateUser(email: string, pass: string) {
		const user = await this.usersService.findOneByEmail(email);

		if (!user) return null;

		const account = await this.accountService.findOneByUserId(user._id);

		if (!account) return null;

		if (account.password === pass) {
			return user;
		}

		return null;
	}

	public async login(user: User) {
		const payload = { name: user.name, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	public async register(params: {
		user: Omit<CreateUserDto, "shopId">;
		account: Omit<CreateAccountDto, "userId">;
		shop: CreateShopDto;
	}) {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const newShop = this.shopsService.createOne(params.shop);
			await queryRunner.manager.save(newShop);

			const newUser = this.usersService.createOne({
				...params.user,
				shopId: newShop._id,
			});
			await queryRunner.manager.save(newUser);

			const newAccount = this.accountService.createOne({
				...params.account,
				userId: newUser._id,
			});
			await queryRunner.manager.save(newAccount);

			await queryRunner.commitTransaction();

			return {
				user: newUser,
				account: newAccount,
				shop: newShop,
			};
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}

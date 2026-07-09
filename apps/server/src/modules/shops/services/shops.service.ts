import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateShopDto } from "../dtos/create-shop.dto";
import { Shop } from "../entities/shop.entity";

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>,
	) {}

	public createOne(params: CreateShopDto) {
		return this.shopsRepository.create(params);
	}

	public saveOne(shop: Shop) {
		return this.shopsRepository.save(shop);
	}

	public getOneByUserId(userId: string) {
		return this.shopsRepository.findOne({
			where: {
				users: {
					_id: userId,
				},
			},
		});
	}
}

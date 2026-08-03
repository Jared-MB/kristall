import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Product } from "./entities/product.entity";
import { ProductLocation } from "./entities/product-location.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Product, Category, ProductLocation])],
})
export class ProductsModule {}

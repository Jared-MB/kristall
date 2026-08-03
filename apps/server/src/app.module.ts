import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { dataSourceOptions } from "./database/data-source";
import { AuthModule } from "./modules/auth/auth.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { LocationsModule } from "./modules/locations/locations.module";
import { ProductsModule } from "./modules/products/products.module";
import { ShopsModule } from "./modules/shops/shops.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			...dataSourceOptions,
			retryAttempts: 3,
			autoLoadEntities: true,
			cache: {
				type: "redis",
				options: {
					host: "localhost",
					port: 6379,
				},
			},
		}),
		AuthModule,
		ShopsModule,
		UsersModule,
		IncidentsModule,
		ProductsModule,
		LocationsModule,
	],
	controllers: [AppController],
})
export class AppModule implements OnModuleInit {
	onModuleInit() {
		console.log(`
      
      _____________________________________________________________________
           _    _    _____      __      __    ______    ___     _       _   
           /  ,'     /    )     /     /    )    /       / |     /       /   
          /_.'      /___ /     /      \\        /       /__|    /       /    
         /  \\      /    |     /        \\      /       /   |   /       /     
        /    \\    /     |   _/_    (____/    /       /    |  /____/  /____/
      _____________________________________________________________________
                                        

    `);
	}
}

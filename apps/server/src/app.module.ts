import { Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { IncidentsModule } from "./modules/incidents/incidents.module";
import { ShopsModule } from "./modules/shops/shops.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			retryAttempts: 3,
			synchronize: true,
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

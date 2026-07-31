import { join } from "node:path";
import { DataSource, type DataSourceOptions } from "typeorm";

// El CLI de TypeORM no arranca Nest, así que no pasa por ConfigModule.
// En despliegue las variables ya vienen del entorno y no hay .env.
try {
	process.loadEnvFile();
} catch {}

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	migrationsRun: false,
	// Globs con __dirname para que resuelvan igual desde src/ (ts-node) que desde dist/.
	entities: [join(__dirname, "..", "**", "*.entity.{ts,js}")],
	migrations: [join(__dirname, "migrations", "*.{ts,js}")],
	migrationsTableName: "migrations",
};

export default new DataSource(dataSourceOptions);

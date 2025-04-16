import { DataSource } from "typeorm";
import { CONFIGS } from ".";

export const dataSource = new DataSource({
    type: "postgres",
    host: CONFIGS.DATABASE.HOST,
    port: CONFIGS.DATABASE.PORT,
    username: CONFIGS.DATABASE.USERNAME,
    password: CONFIGS.DATABASE.PASSWORD,
    database: CONFIGS.DATABASE.DATABASE,
    entities: ["src/models/**/*{.ts,.js}"],
    migrations: ["src/migrations/*{.ts,.js}"],
    synchronize: false,
    logging: true,
    ssl: CONFIGS.IS_PRODUCTION ? { rejectUnauthorized: false } : false,
});

export const postgresLoader = async () => {
    await dataSource.initialize()
        .then(() => console.log("✅ Connected to PostgreSQL database"))
        .catch((err) => console.error(`❌ Database connection error: ${err}`));
};

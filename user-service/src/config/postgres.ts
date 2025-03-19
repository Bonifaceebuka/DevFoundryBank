import { DataSource } from "typeorm";
import { env } from "../env";

const { db } = env;
const { pg } = db;

export const dataSource = new DataSource({
    type: "postgres",
    host: pg.host,
    port: +pg.port,
    username: pg.user,
    password: pg.pass,
    database: pg.database,
    entities: ["src/api/models/postgres/**/*{.ts,.js}"],
    migrations: ["src/api/migrations/*{.ts,.js}"],
    synchronize: false,
    logging: true,
    ssl: env.isProduction ? { rejectUnauthorized: false } : false,
});

export const postgresLoader = async () => {
    await dataSource.initialize()
        .then(() => console.log("✅ Connected to PostgreSQL database"))
        .catch((err) => console.error(`❌ Database connection error: ${err}`));
};

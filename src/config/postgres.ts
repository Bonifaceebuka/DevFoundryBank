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
    entities: [__dirname + "/../models/**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    synchronize: false,
    logging: true,
    ssl: !env.isLocal && !env.isTest ? { rejectUnauthorized: false } : false,
});

export const postgresLoader = async () => {
    await dataSource.initialize()
        .then(() => console.log("✅ Connected to PostgreSQL database"))
        .catch((err) => console.error(`❌ Database connection error: ${err}`));
};

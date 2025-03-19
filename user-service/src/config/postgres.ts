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
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    synchronize: false,
    logging: true,
    ssl: env.isProduction ? { rejectUnauthorized: false } : false,
});

export const postgresLoader = async () => {
    console.log("pg.host", pg.host)
    console.log("pg.port", pg.port)
    console.log("pg.user", pg.user)
    console.log("pg.pass", pg.pass)
    console.log("pg.database", pg.database)
    console.log("env.isProduction", env.isProduction)
    await dataSource.initialize()
        .then(() => console.log("✅ Connected to PostgreSQL database"))
        .catch((err) => console.error(`❌ Database connection error: ${err}`));
};

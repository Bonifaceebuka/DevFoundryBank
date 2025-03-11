import Container from "typedi";
import { DataSource } from "typeorm";

import { env } from "../env";

const { db } = env;
const { pg } = db;


export const dataSource = new DataSource({
    type: "postgres" as any,
    username: pg.user,
    password: pg.pass,
    host: pg.host,
    database: pg.database,
    port: +pg.port,
    entities: ["src/api/models/postgres/**/*.ts"],
    migrations: ["src/api/migrations/*.ts"],
    synchronize: false,
    logging: true,
    multipleStatements: true,
    ssl: (!env.isLocal && !env.isTest) ? { rejectUnauthorized: false } : false
});


export const postgresLoader = async () => {
    Container.set("PostgreSQLConnection", dataSource);

    await dataSource.initialize()
        .then(async () => {
            console.log("✅  Connected to PostgreSQL database");
        })
        .catch((err) => {
            console.log(`❌  Error connecting to PostgreSQL database >> ${err}`);
        });
};
import mongoose from "mongoose"
import { CONFIGS } from "./index"

const dbConnectionString = CONFIGS.MONGO_DB_URL as string

export const dbConnection = mongoose.connect(dbConnectionString)
.then((res: any)=>{
    console.log("✅  Connected to MongoDB database");
})
.catch((err: any) => {
    console.log(`❌  Error connecting to MongoDB database >> ${err}`);
});
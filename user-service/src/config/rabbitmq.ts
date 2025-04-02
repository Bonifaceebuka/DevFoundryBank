import amqplib from "amqplib"
import { env } from "../env";
import { AppError } from "../api/errors/AppError";
import { dynamic_messages } from "../api/constants/messages";

export async function rabbitMQConnection() {
    try{
        const connection = await amqplib.connect(env.RABBITMQ.RABBITMQ_URL);
        console.log("✅  Connected to RabbitMQ");
        return connection;
    }
    catch(err){
        console.log(`❌  Error connecting to RabbitMQ >> ${err}`);
        throw new AppError(dynamic_messages.CONNECTION_FAILED("RabbitMQ"), 500);
    }
}

export async function rabbitMQChannel() {
    try {
        const connection = await rabbitMQConnection();
        console.log("✅  Connected to RabbitMQ Channel");
        if(connection) {
            return connection.createChannel();
        }
        throw new AppError(dynamic_messages.CONNECTION_FAILED("RabbitMQ Channel"), 500);
    }
    catch (err) {
        console.log(`❌  Error connecting to RabbitMQ Channel >> ${err}`);
        throw new AppError(dynamic_messages.CONNECTION_FAILED("RabbitMQ Channel"), 500);
    }
}

export const MAX_UNPROCESSED_QUEUE = 3;
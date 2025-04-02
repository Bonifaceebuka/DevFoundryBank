import amqplib from "amqplib"
import { CONFIGS } from ".";
import { AppError } from "../errors/AppError";
import { dynamic_messages } from "../constants/messages";

export async function rabbitMQConnection(){
    try {
        const connection = await amqplib.connect(CONFIGS.RABBITMQ.RABBITMQ_URL);
        console.log("✅  Connected to RabbitMQ");
        return connection;
    } catch (error) {
        console.log(`❌  Error connecting to RabbitMQ >> ${error}`);
    }
}

export async function rabbitMQChannel(){
    try {
        const connection = await rabbitMQConnection();
        console.log("✅  Connected to RabbitMQ Channel");
        if (connection) {
            return connection.createChannel();
        }
        throw new AppError(dynamic_messages.CONNECTION_FAILED("RabbitMQ Channel"), 500);
    } catch (error) {
        console.log(`❌  Error connecting to RabbitMQ Channel >> ${error}`);
    }
}


export const MAX_UNPROCESSED_QUEUE = 300;
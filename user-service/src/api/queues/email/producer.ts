import { env } from "../../../env";
import amqplib from "amqplib"

export async function sendRabbitMQMessage(queue_name: string, messageBody: any) {
    try {
        const connection = await amqplib.connect(env.RABBITMQ.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue_name, {durable:true});
        channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(messageBody)),
    {
        persistent: true,
    })


    }
    catch (err) {
        console.log({err})
    }

}
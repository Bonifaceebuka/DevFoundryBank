import { MAX_UNPROCESSED_QUEUE, rabbitMQChannel } from "../../config/rabbitmq";
import { env } from "../../env";
import { QUEUE_NAMES } from "../constants/queues";
import { generateSignature } from "../helpers/security";
import UserService from "../services/UserService";

export async function listenForIncomingRabbitMQMessage() {
    try {
        const queue_name = QUEUE_NAMES.NEW_REGISTRATION.NAME
        const channel = await rabbitMQChannel();
        if (channel){
            await channel.assertQueue(queue_name, { durable: true });
            channel.prefetch(MAX_UNPROCESSED_QUEUE);

            channel.consume(queue_name, async (msg: any) => {
                if (msg !== null) {
                    const { messageBody, signature, timestamp } = JSON.parse(msg.content.toString())
                    const rabbitMQKey = env.RABBITMQ.RABBITMQ_PUBLIC_KEY;
                    const decryptedSignature = generateSignature(rabbitMQKey, timestamp);
                    if (decryptedSignature !== signature) {
                        console.log(`Invalid SIGNATURE: Sent: ${signature}`)
                    }
                    else{
                        const {
                            user
                        } = messageBody
                        const userService = new UserService();
                        await userService.createNewUser(user)
                        channel.ack(msg)
                    }
                }
            }
            )
        }
    } catch (error) {
        console.log(`❌  Error comsuming messages >> ${error}`);
    }

}
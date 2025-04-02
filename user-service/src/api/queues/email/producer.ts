import { issueNewSignature } from "../../helpers/security";
import { MAX_UNPROCESSED_QUEUE, rabbitMQChannel } from "../../../config/rabbitmq";
import { env } from "../../../env";

export async function sendRabbitMQMessage(queue_name: string, messageBody: any) {
    try {
        const channel = await rabbitMQChannel();
        if (channel) {
            const available_queues = await channel.assertQueue(queue_name, { durable: true });
            if (available_queues.messageCount > MAX_UNPROCESSED_QUEUE){
                console.log(`This is your ${available_queues.messageCount}th message which is above ${MAX_UNPROCESSED_QUEUE} message limit`)
            }else{
                const { signature, timestamp } = await issueNewSignature(env.RABBITMQ.RABBITMQ_PUBLIC_KEY)
                
                const encryptedMessageBody ={
                    messageBody,
                    signature,
                    timestamp
                }
                channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(encryptedMessageBody)),
                    {
                        persistent: true,
                    })
            }
        }
    }
    catch (err) {
        console.log({err})
    }

}
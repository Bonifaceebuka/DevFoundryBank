import { issueNewSignature } from "../../common/helpers/security";
import { CONFIGS } from "../../common/configs";
import { MAX_UNPROCESSED_QUEUE, rabbitMQChannel } from "../../common/configs/rabbitmq";

export async function sendRabbitMQMessage(queue_name: string, messageBody: any) {
    try {
        const channel = await rabbitMQChannel();
        if (channel) {
            const available_queues = await channel.assertQueue(queue_name, { durable: true });
            if (available_queues.messageCount > MAX_UNPROCESSED_QUEUE){
                console.log(`This is your ${available_queues.messageCount}th message which is above ${MAX_UNPROCESSED_QUEUE} message limit`)
            }else{
                const { signature, timestamp } = await issueNewSignature(CONFIGS.RABBITMQ.RABBITMQ_PUBLIC_KEY)
                
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
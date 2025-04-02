import { sendEmail } from "../../helpers/mailing";
import { QUEUE_NAMES } from "../../common/constants/queues";
import { getEmailTemplate } from "../../common/constants/mail_templates";
import { MAX_UNPROCESSED_QUEUE, rabbitMQChannel } from "../../common/configs/rabbitmq";

export async function consumeRabbitMQMessages(){
        try {
            const queue_name = QUEUE_NAMES.EMAIL_VERIFICATION.NAME
            const channel = await rabbitMQChannel();
            if (channel){
                await channel.assertQueue(queue_name, { durable: true });
                channel.prefetch(MAX_UNPROCESSED_QUEUE);
    
                channel.consume(queue_name, async (msg: any) => {
                    if (msg !== null) {
                        const receivedMessage = JSON.parse(msg.content.toString())
                        const {
                            otp,
                            email,
                            subject,
                            email_category
                        } = receivedMessage
    
                        const template = getEmailTemplate(email_category)
                        const data = {
                            otp, email,
                        }
                        await sendEmail(email, subject, template, data)
                        channel.ack(msg)
                    }
                }
                )
            }
        } catch (error) {
            console.log(`❌  Error comsuming messages >> ${error}`);
        }
    }

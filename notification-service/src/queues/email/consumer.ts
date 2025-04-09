import { sendEmail } from "../../helpers/mailing";
import { QUEUE_NAMES } from "../../common/constants/queues";
import { getEmailTemplate } from "../../common/constants/mail_templates";
import { MAX_UNPROCESSED_QUEUE, rabbitMQChannel } from "../../common/configs/rabbitmq";
import { generateSignature } from "../../helpers/security";
import { CONFIGS } from "../../common/configs";

export async function consumeRabbitMQMessages(){
        try {
            const queue_name = QUEUE_NAMES.EMAIL_VERIFICATION.NAME
            const channel = await rabbitMQChannel();
            if (channel){
                await channel.assertQueue(queue_name, { durable: true });
                channel.prefetch(MAX_UNPROCESSED_QUEUE);
    
                channel.consume(queue_name, async (msg: any) => {
                    if (msg !== null) {
                        const { messageBody, signature, timestamp } = JSON.parse(msg.content.toString())
                        const rabbitMQKey = CONFIGS.RABBITMQ.RABBITMQ_PUBLIC_KEY;
                        const decryptedSignature = generateSignature(rabbitMQKey, timestamp);
                        if (decryptedSignature !== signature) {
                            console.log(`Invalid SIGNATURE: Sent: ${signature}`)
                        }
                        else{
                            const {
                                otp,
                                email,
                                subject,
                                verification_link,
                                email_category
                            } = messageBody
        
                            const template = getEmailTemplate(email_category)
                            const data = {
                                otp, email, verification_link
                            }
                            await sendEmail(email, subject, template, data)
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

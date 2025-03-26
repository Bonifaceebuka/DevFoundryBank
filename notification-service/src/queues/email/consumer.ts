import amqplib from "amqplib"
import { CONFIGS } from "../../common/configs";
import { sendEmail } from "../../helpers/mailing";

export const rabbitMQConnection = amqplib.connect('amqp://localhost')
    .then(async (connection: any) => {

        console.log("✅  Connected to RabbitMQ database");

        const rabbitMQConnection =  await connection.createChannel();
        const queue_name = 'email_verification_queue'
        const channel = await rabbitMQConnection;
        await channel.assertQueue(queue_name, { durable: true });
        channel.consume(queue_name, async (msg: any) => {
            if (msg !== null) {
                const receivedMessage = JSON.parse(msg.content.toString())
                const { otp, email, subject, email_category, signature } = receivedMessage;
                const data = {
                    otp, email,
                }
                await sendEmail(email, subject, email_category, { to:email, subject, template:email_category, data })
                channel.ack(msg)
            }
        }
        )
    })
    .catch((err: any) => {
        console.log(`❌  Error connecting to RabbitMQ database >> ${err}`);
    });

import { env } from "../../../env";
import amqplib from "amqplib"

// export async function consumeRabbitMQMessage() {
//     try {
//         const queue_name = 'email_verification_queue'
//         const connection = await amqplib.connect(env.RABBITMQ.RABBITMQ_URL);
//         const channel = await connection.createChannel();
//         await channel.assertQueue(queue_name, {durable:true});
       
//         channel.consume(queue_name, (msg)=>{
//             if (msg !== null) {
//                 console.log(JSON.parse(msg.content.toString()))

//                 channel.ack(msg)
//             }
//         }
//         )

//     }
//     catch (err) {
//         console.log({err})
//     }

// }
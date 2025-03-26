import amqplib from "amqplib"

export  async function rabbitMQConnection() {
    try{
        const connection = await amqplib.connect('amqp://localhost');
        return connection;
        // const channel = await connection.createChannel();
        // const queue_name = 'email_verification_queue';
    }
    catch(err){

    }
}
import amqplib from "amqplib"

export  async function rabbitMQConnection() {
    try{
        const connection = await amqplib.connect('amqp://localhost');
        return connection;
    }
    catch(err){

    }
}
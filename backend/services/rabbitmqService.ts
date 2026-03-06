import amqp from 'amqplib';
import env from '../utils/Env';

const RABBIT_URL = env.RABBITMQ_URL;

class RabbitMqService {
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private consumerTag: string | null = null;

  async connect() {
    const connection = await amqp.connect(RABBIT_URL);
    this.connection = connection;
    this.channel = await connection.createChannel();
    await this.channel.assertQueue('call_queue', {
      durable: true,
    });

    console.log('RabbitMQ connected');
  }
  async connectWithRetry(retries = 5) {
    while (retries) {
      try {
        await this.connect();
        return;
      } catch (err) {
        console.error('RabbitMQ connection failed:', err);
        console.log('RabbitMQ not ready, retrying in 3s...');
        await new Promise((res) => setTimeout(res, 3000));
        retries--;
      }
    }
    throw new Error('RabbitMQ connection failed');
  }
  async publish(message: any) {
    if (!this.channel) throw new Error('RabbitMQ not connected');

    this.channel.sendToQueue('call_queue', Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }
  async consume(callback: (msg: any) => Promise<void>) {
    if (!this.channel) throw new Error('RabbitMQ not connected');

    const result = await this.channel.consume('call_queue', async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());

      try {
        await callback(data);
        this.channel?.ack(msg);
      } catch (err) {
        console.error('Processing failed:', err);
        this.channel?.nack(msg);
      }
    });
    this.consumerTag = result.consumerTag;
  }

  async close() {
    if (this.channel && this.consumerTag) {
      try {
        await this.channel.cancel(this.consumerTag);
      } catch (error) {
        console.error('RabbitMQ consumer cancel failed:', error);
      } finally {
        this.consumerTag = null;
      }
    }

    if (this.channel) {
      try {
        await this.channel.close();
      } catch (error) {
        console.error('RabbitMQ channel close failed:', error);
      } finally {
        this.channel = null;
      }
    }

    if (this.connection) {
      try {
        await this.connection.close();
      } catch (error) {
        console.error('RabbitMQ connection close failed:', error);
      } finally {
        this.connection = null;
      }
    }
  }
}
export default new RabbitMqService();

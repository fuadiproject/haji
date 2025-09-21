import { Kafka } from "kafkajs";
import { getMessageHandlers } from "./messageHandlers";

export class NotificationConsumers {
  constructor(config = {}) {
    this.kafka = new Kafka({
      clientId:
        config.clientId ||
        process.env.KAFKA_CLIENT_ID ||
        "be-superapp-consumer",
      brokers: process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(",").map((b) => b.trim())
        : ["localhost:9092"],
    });

    this.consumer = null;
    this.isRunning = false;
    this.handlers = getMessageHandlers();
  }

  async start() {
    if (this.isRunning) {
      console.log("Consumer already running");
      return;
    }

    this.consumer = this.kafka.consumer({
      groupId:
        process.env.KAFKA_CONSUMER_GROUP_ID || "be-superapp-consumer-group",
    });

    // Subscribe to topics
    const topics = "notification-requests";
    await this.consumer.subscribe({ topic: topics, fromBeginning: false });

    this.isRunning = true;
    console.log("🔔 Notification consumer started");

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log(`📨 Received from ${topic}:`, data);

          const handler = this.handlers[topic];
          if (handler) {
            await handler(data);
          } else {
            console.warn(`No handler found for topic: ${topic}`);
          }
        } catch (error) {
          console.error("❌ Error processing message:", error);
        }
      },
    });
  }

  async stop() {
    if (!this.isRunning || !this.consumer) {
      console.log("Consumer not running");
      return;
    }

    await this.consumer.disconnect();
    this.consumer = null;
    this.isRunning = false;
    console.log("🔔 Notification consumer stopped");
  }
}

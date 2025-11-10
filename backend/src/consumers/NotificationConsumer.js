import { Kafka } from "kafkajs";
import { getMessageHandlers } from "./messageHandlers.js";

export class NotificationConsumer {
  constructor(config = {}) {
    // Load from .env
    const brokers = process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",").map((b) => b.trim())
      : ["localhost:9092"];

    // Build Kafka configuration with optional SASL authentication
    const kafkaConfig = {
      clientId:
        config.clientId ||
        process.env.KAFKA_CLIENT_ID ||
        "be-superapp-consumer",
      brokers: config.brokers || brokers,
      retry: {
        retries: config.retries || parseInt(process.env.KAFKA_RETRIES) || 8,
        initialRetryTime: 100,
        maxRetryTime: 30000,
      },
      connectionTimeout: 3000, // 3 seconds
      requestTimeout: 30000, // 30 seconds
      // SSL configuration (optional - only if KAFKA_SSL=true)
      ssl:
        process.env.KAFKA_SSL === "true"
          ? {
              rejectUnauthorized: false, // Set to true in production with proper certs
            }
          : false,
      // SASL authentication (optional - only if KAFKA_SASL_MECHANISM is set)
      // If not set, this will be undefined and Kafka will connect without authentication
      sasl: process.env.KAFKA_SASL_MECHANISM
        ? {
            mechanism: process.env.KAFKA_SASL_MECHANISM, // e.g., 'scram-sha-512'
            username: process.env.KAFKA_SASL_USERNAME,
            password: process.env.KAFKA_SASL_PASSWORD,
          }
        : undefined,
      ...config,
    };

    this.kafka = new Kafka(kafkaConfig);

    this.consumer = null;
    this.isRunning = false;
    this.handlers = getMessageHandlers();
  }

  async start() {
    if (this.isRunning) {
      console.log("Consumer already running");
      return;
    }

    // Log connection details for debugging
    const brokers = process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",").map((b) => b.trim())
      : ["localhost:9092"];

    console.log("🔍 Connecting to brokers:", brokers);
    console.log("🔍 SSL enabled:", process.env.KAFKA_SSL === "true");
    console.log("�� SASL enabled:", !!process.env.KAFKA_SASL_MECHANISM);

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
      eachMessage: async ({ topic, message }) => {
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

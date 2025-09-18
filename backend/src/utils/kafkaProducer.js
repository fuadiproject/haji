import { Kafka } from "kafkajs";

/**
 * Kafka Producer Utility - Simple Version
 */
class KafkaProducer {
  constructor(config = {}) {
    // Load from .env
    const brokers = process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(",").map((b) => b.trim())
      : ["localhost:9092"];

    this.config = {
      clientId:
        config.clientId || process.env.KAFKA_CLIENT_ID || "be-surat-producer",
      brokers: config.brokers || brokers,
      retry: {
        retries: config.retries || parseInt(process.env.KAFKA_RETRIES) || 8,
      },
      ssl: process.env.KAFKA_SSL === "true" ? {} : false,
      sasl: process.env.KAFKA_SASL_MECHANISM
        ? {
            mechanism: process.env.KAFKA_SASL_MECHANISM,
            username: process.env.KAFKA_SASL_USERNAME,
            password: process.env.KAFKA_SASL_PASSWORD,
          }
        : undefined,
      ...config,
    };

    this.kafka = new Kafka(this.config);
    this.producer = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    this.producer = this.kafka.producer();
    await this.producer.connect();
    this.isConnected = true;
    console.log("Kafka producer connected");
  }

  async disconnect() {
    if (!this.isConnected || !this.producer) return;

    await this.producer.disconnect();
    this.isConnected = false;
    console.log("Kafka producer disconnected");
  }

  async sendMessage(topic, message, key = null) {
    if (!this.isConnected) await this.connect();

    const result = await this.producer.send({
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(message),
        },
      ],
    });

    console.log(`Message sent to ${topic}:`, result[0]);
    return {
      success: true,
      topic,
      partition: result[0].partition,
      offset: result[0].offset,
    };
  }

  async sendEvent(topic, eventType, data, entityId, userId) {
    const eventMessage = {
      eventType,
      entityId,
      userId,
      timestamp: new Date().toISOString(),
      data,
    };

    return this.sendMessage(topic, eventMessage, entityId);
  }

  async sendAuditLog(action, entityType, entityId, userId, changes = null) {
    const auditMessage = {
      action,
      entityType,
      entityId,
      userId,
      timestamp: new Date().toISOString(),
      changes,
    };

    return this.sendMessage("audit-logs", auditMessage, entityId);
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Factory untuk dependency injection
class KafkaProducerFactory {
  constructor() {
    this.defaultInstance = null;
  }

  create(config = {}) {
    return new KafkaProducer(config);
  }

  getDefault(config = {}) {
    if (!this.defaultInstance) {
      this.defaultInstance = new KafkaProducer(config);
    }
    return this.defaultInstance;
  }

  resetDefault() {
    this.defaultInstance = null;
  }
}

// Export
const kafkaProducerFactory = new KafkaProducerFactory();

export { KafkaProducer, KafkaProducerFactory, kafkaProducerFactory };
export const createKafkaProducer = (config) =>
  kafkaProducerFactory.create(config);
export const getKafkaProducer = (config) =>
  kafkaProducerFactory.getDefault(config);

export default KafkaProducer;

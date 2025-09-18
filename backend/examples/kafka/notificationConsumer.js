import { Kafka } from 'kafkajs';

/**
 * Simple Notification Consumer
 */

class NotificationConsumer {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'be-surat-consumer',
      brokers: process.env.KAFKA_BROKERS 
        ? process.env.KAFKA_BROKERS.split(',').map(b => b.trim())
        : ['localhost:9092']
    });
    
    this.consumer = null;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('Consumer already running');
      return;
    }

    this.consumer = this.kafka.consumer({ groupId: 'be-surat-group' });
    
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'surat-masuk-events', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'notification-requests', fromBeginning: false });
    
    this.isRunning = true;
    console.log('🔔 Notification consumer started');
    
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const data = JSON.parse(message.value.toString());
          console.log(`📨 Received from ${topic}:`, data);
          
          // Process based on topic
          if (topic === 'surat-masuk-events') {
            await this.processSuratMasukEvent(data);
          } else if (topic === 'notification-requests') {
            await this.processNotificationRequest(data);
          }
          
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      }
    });
  }

  async stop() {
    if (!this.isRunning || !this.consumer) return;
    
    await this.consumer.disconnect();
    this.isRunning = false;
    console.log('🔕 Notification consumer stopped');
  }

  async processSuratMasukEvent(data) {
    console.log('📄 Processing surat masuk event:', data.eventType);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('✅ Surat masuk event processed');
  }

  async processNotificationRequest(data) {
    console.log('🔔 Processing notification request:', data.notification_id);
    
    // Simulate creating in-app notification
    console.log('💾 Creating in-app notification...');
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate sending push notification
    console.log('📱 Sending push notification...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      console.log('✅ Notification sent successfully');
    } else {
      console.log('❌ Push notification failed, but in-app notification exists');
    }
  }
}

// Usage example
async function consumerExample() {
  console.log('🚀 Starting Notification Consumer Example...\n');
  
  const consumer = new NotificationConsumer();
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down consumer...');
    await consumer.stop();
    process.exit(0);
  });
  
  try {
    await consumer.start();
    console.log('✅ Consumer is running... Press Ctrl+C to stop');
    
    // Keep running
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error starting consumer:', error);
    process.exit(1);
  }
}

export { NotificationConsumer, consumerExample };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  consumerExample();
}

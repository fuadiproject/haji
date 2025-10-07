# 📨 Kafka Producer Utility Documentation

## 🚀 Overview

Kafka Producer Utility adalah class utility untuk mengirim pesan ke Kafka topics dengan konfigurasi yang fleksibel dan error handling yang robust. Utility ini mendukung konfigurasi melalui environment variables dan dapat digunakan untuk berbagai skenario seperti event streaming, audit logging, dan notifications.

## 📋 Features

- ✅ **Environment Variables Configuration** - Konfigurasi melalui file `.env`
- ✅ **Singleton Pattern** - Instance tunggal untuk efisiensi
- ✅ **Multiple Message Types** - Event, audit log, notification, batch messages
- ✅ **Error Handling** - Retry mechanism dan error logging
- ✅ **SSL/SASL Support** - Keamanan untuk production environment
- ✅ **Connection Management** - Auto connect/disconnect
- ✅ **Flexible Configuration** - Override config per instance

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install kafkajs
```

### 2. Environment Configuration

Copy file `kafka.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp kafka.env.example .env
```

### 3. Basic Environment Variables

```env
# Required
KAFKA_BROKERS=localhost:9092,localhost:9093
KAFKA_CLIENT_ID=be-surat-producer

# Optional
KAFKA_SSL=false
KAFKA_SASL_MECHANISM=
KAFKA_TOPIC_SURAT_MASUK_EVENTS=surat-masuk-events
```

## 📖 Usage Examples

### 1. Basic Usage (Singleton)

```javascript
import { getKafkaProducer } from './src/utils/kafkaProducer.js';

// Get singleton instance (menggunakan config dari .env)
const producer = getKafkaProducer();

// Connect dan send message
await producer.connect();
await producer.sendMessage('test-topic', { message: 'Hello Kafka!' });
await producer.disconnect();
```

### 2. Custom Configuration

```javascript
import { createKafkaProducer } from './src/utils/kafkaProducer.js';

// Create instance dengan custom config
const producer = createKafkaProducer({
  clientId: 'custom-producer',
  brokers: ['localhost:9092'],
  retry: { retries: 5 }
});

await producer.connect();
await producer.sendMessage('custom-topic', { data: 'custom message' });
await producer.disconnect();
```

### 3. Event Messages

```javascript
const producer = getKafkaProducer();
await producer.connect();

// Send structured event
await producer.sendEvent(
  'surat-masuk-events',
  'surat_masuk.created',
  { id: '123', nomor_surat: 'SM/001/2025/IX' },
  '123', // entityId
  'user123', // userId
  { department: 'IT' } // metadata
);
```

### 4. Audit Logs

```javascript
// Send audit log
await producer.sendAuditLog(
  'CREATE',
  'surat_masuk',
  'entity123',
  'user123',
  null, // changes (untuk CREATE)
  { ip: '192.168.1.100' } // metadata
);

// Send audit log dengan changes (untuk UPDATE)
await producer.sendAuditLog(
  'UPDATE',
  'surat_masuk',
  'entity123',
  'user123',
  {
    before: { nomor_surat: 'SM/001/2025/IX' },
    after: { nomor_surat: 'SM/001/2025/IX-REV' }
  },
  { ip: '192.168.1.100' }
);
```

### 5. Notifications

```javascript
// Send notification
await producer.sendNotification(
  'user123',
  'info',
  'Surat Masuk Baru',
  'Anda menerima surat masuk baru',
  { surat_masuk_id: '123' }
);
```

### 6. Batch Messages

```javascript
const messages = [
  { id: 1, name: 'Surat 1', status: 'created' },
  { id: 2, name: 'Surat 2', status: 'created' },
  { id: 3, name: 'Surat 3', status: 'created' }
];

await producer.sendBatchMessages('surat-events', messages, 'id');
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_BROKERS` | `localhost:9092` | Comma-separated list of Kafka brokers |
| `KAFKA_CLIENT_ID` | `be-surat-producer` | Client identifier |
| `KAFKA_SSL` | `false` | Enable SSL connection |
| `KAFKA_SASL_MECHANISM` | - | SASL mechanism (PLAIN, SCRAM-SHA-256, etc.) |
| `KAFKA_SASL_USERNAME` | - | SASL username |
| `KAFKA_SASL_PASSWORD` | - | SASL password |
| `KAFKA_RETRIES` | `8` | Number of retries |
| `KAFKA_INITIAL_RETRY_TIME` | `100` | Initial retry time in ms |

### Topic Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `KAFKA_TOPIC_SURAT_MASUK_EVENTS` | `surat-masuk-events` | Surat masuk events topic |
| `KAFKA_TOPIC_DISPOSISI_EVENTS` | `disposisi-events` | Disposisi events topic |
| `KAFKA_TOPIC_AUDIT_LOGS` | `audit-logs` | Audit logs topic |
| `KAFKA_TOPIC_NOTIFICATIONS` | `notifications` | Notifications topic |

## 🏗️ Architecture

### Class Structure

```
KafkaProducer
├── constructor(config)
├── connect()
├── disconnect()
├── sendMessage(topic, message, key, headers)
├── sendBatchMessages(topic, messages, keyField, headers)
├── sendEvent(topic, eventType, data, entityId, userId, metadata)
├── sendAuditLog(action, entityType, entityId, userId, changes, metadata)
├── sendNotification(userId, type, title, message, data)
├── getConnectionStatus()
└── getConfig()
```

### Message Formats

#### Event Message
```json
{
  "eventType": "surat_masuk.created",
  "entityId": "123",
  "userId": "user123",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": { "id": "123", "nomor_surat": "SM/001/2025/IX" },
  "metadata": { "source": "be-surat", "version": "1.0.0" }
}
```

#### Audit Log Message
```json
{
  "action": "CREATE",
  "entityType": "surat_masuk",
  "entityId": "123",
  "userId": "user123",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "changes": null,
  "metadata": { "source": "be-surat", "version": "1.0.0" }
}
```

#### Notification Message
```json
{
  "userId": "user123",
  "type": "info",
  "title": "Surat Masuk Baru",
  "message": "Anda menerima surat masuk baru",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "data": { "surat_masuk_id": "123" },
  "metadata": { "source": "be-surat", "version": "1.0.0" }
}
```

## 🔒 Security

### SSL Configuration

```env
KAFKA_SSL=true
KAFKA_SSL_REJECT_UNAUTHORIZED=true
```

### SASL Authentication

```env
KAFKA_SASL_MECHANISM=SCRAM-SHA-256
KAFKA_SASL_USERNAME=your-username
KAFKA_SASL_PASSWORD=your-password
```

## 🚨 Error Handling

### Connection Errors

```javascript
try {
  await producer.connect();
} catch (error) {
  console.error('Connection failed:', error.message);
  // Handle connection error
}
```

### Send Message Errors

```javascript
try {
  await producer.sendMessage('topic', { data: 'message' });
} catch (error) {
  console.error('Send failed:', error.message);
  // Handle send error
}
```

### Retry Mechanism

Utility ini menggunakan retry mechanism dari kafkajs dengan konfigurasi:

- **Initial Retry Time**: 100ms (configurable)
- **Retries**: 8 (configurable)
- **Exponential Backoff**: Automatic

## 📊 Monitoring

### Connection Status

```javascript
const isConnected = producer.getConnectionStatus();
console.log('Kafka connected:', isConnected);
```

### Configuration

```javascript
const config = producer.getConfig();
console.log('Current config:', config);
```

### Logging

Enable logging dengan environment variable:

```env
KAFKA_ENABLE_LOGGING=true
KAFKA_LOG_LEVEL=info
```

## 🧪 Testing

### Unit Tests

```javascript
import { createKafkaProducer } from './src/utils/kafkaProducer.js';

// Mock Kafka untuk testing
const mockProducer = createKafkaProducer({
  brokers: ['mock-broker:9092']
});

// Test connection
await mockProducer.connect();
expect(mockProducer.getConnectionStatus()).toBe(true);
```

### Integration Tests

```javascript
// Test dengan real Kafka instance
const producer = getKafkaProducer();
await producer.connect();

const result = await producer.sendMessage('test-topic', { test: 'data' });
expect(result.success).toBe(true);
```

## 🚀 Best Practices

### 1. Connection Management

```javascript
// ✅ Good: Use singleton untuk efisiensi
const producer = getKafkaProducer();

// ❌ Bad: Create multiple instances
const producer1 = createKafkaProducer();
const producer2 = createKafkaProducer();
```

### 2. Error Handling

```javascript
// ✅ Good: Always handle errors
try {
  await producer.sendMessage('topic', data);
} catch (error) {
  logger.error('Kafka send failed', error);
  // Fallback mechanism
}

// ❌ Bad: Ignore errors
await producer.sendMessage('topic', data); // No error handling
```

### 3. Message Keys

```javascript
// ✅ Good: Use meaningful keys
await producer.sendMessage('user-events', data, userId);

// ❌ Bad: No key or random key
await producer.sendMessage('user-events', data, null);
```

### 4. Batch Processing

```javascript
// ✅ Good: Use batch untuk multiple messages
await producer.sendBatchMessages('events', messages, 'id');

// ❌ Bad: Send one by one
for (const message of messages) {
  await producer.sendMessage('events', message);
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```
   Error: Connection timeout
   Solution: Check KAFKA_BROKERS and network connectivity
   ```

2. **Authentication Failed**
   ```
   Error: SASL authentication failed
   Solution: Verify KAFKA_SASL_USERNAME and KAFKA_SASL_PASSWORD
   ```

3. **Topic Not Found**
   ```
   Error: Topic not found
   Solution: Create topic or check topic name
   ```

### Debug Mode

Enable debug logging:

```env
KAFKA_LOG_LEVEL=debug
KAFKA_ENABLE_LOGGING=true
```

## 📚 Examples

Lihat file `examples/kafkaProducerUsage.js` untuk contoh penggunaan lengkap:

- Basic usage dengan environment variables
- Custom configuration
- Event messages
- Audit logs
- Notifications
- Batch messages
- Error handling
- Real-world usage patterns

## 🔄 Migration Guide

### From Manual Kafka Setup

```javascript
// ❌ Old way
import { Kafka } from 'kafkajs';
const kafka = new Kafka({ clientId: 'app', brokers: ['localhost:9092'] });
const producer = kafka.producer();
await producer.connect();
await producer.send({ topic: 'test', messages: [{ value: 'hello' }] });

// ✅ New way
import { getKafkaProducer } from './src/utils/kafkaProducer.js';
const producer = getKafkaProducer();
await producer.connect();
await producer.sendMessage('test', { message: 'hello' });
```

---

**Last Updated**: January 15, 2025  
**Version**: 1.0.0  
**Dependencies**: kafkajs

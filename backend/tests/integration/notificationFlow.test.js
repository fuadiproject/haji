import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/utils/prisma.js';
import { mockJWT, user1JWT } from '../mocks/jwtMocks.js';

describe('Notification Flow Integration Tests', () => {
  let createdNotificationId;

  afterAll(async () => {
    // Clean up test notifications
    await prisma.notification.deleteMany({
      where: {
        title: {
          contains: 'Test Notification'
        }
      }
    });
    
    await prisma.$disconnect();
  });

  describe('POST /api/notifications', () => {
    it('should create a notification successfully', async () => {
      const notificationData = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification message',
        userId: 'clx1234567890abcdef',
        data: {
          additionalInfo: 'Some additional data',
          priority: 'high'
        }
      };

      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${mockJWT}`)
        .send(notificationData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Notification created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('type', 'info');
      expect(response.body.data).toHaveProperty('title', 'Test Notification');
      expect(response.body.data).toHaveProperty('message', 'This is a test notification message');
      expect(response.body.data).toHaveProperty('userId', 'clx1234567890abcdef');
      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data.data).toEqual(notificationData.data);
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');

      // Store the ID for cleanup
      createdNotificationId = response.body.data.id;
    });

    it('should fail to create notification without authentication', async () => {
      const notificationData = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification message',
        userId: 'clx1234567890abcdef'
      };

      const response = await request(app)
        .post('/api/notifications')
        .send(notificationData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail to create notification with missing required fields', async () => {
      const incompleteData = {
        type: 'info',
        // Missing title, message, and userId
      };

      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${mockJWT}`)
        .send(incompleteData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should create notification with minimal required fields', async () => {
      const minimalData = {
        type: 'warning',
        title: 'Test Notification Minimal',
        message: 'Minimal notification message',
        userId: 'clx1234567890abcdef'
        // data is optional
      };

      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${mockJWT}`)
        .send(minimalData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('type', 'warning');
      expect(response.body.data).toHaveProperty('title', 'Test Notification Minimal');
      expect(response.body.data).toHaveProperty('data');
    });
  });

  describe('GET /api/notifications', () => {
    beforeAll(async () => {
      // Create some test notifications for GET tests
      await prisma.notification.createMany({
        data: [
          {
            type: 'info',
            title: 'Test Notification 1',
            message: 'Message 1',
            userId: 'clx1234567890abcdef',
            data: {}
          },
          {
            type: 'warning',
            title: 'Test Notification 2', 
            message: 'Message 2',
            userId: 'clx9876543210fedcba',
            data: {}
          }
        ]
      });
    });

    it('should get all notifications with pagination', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty('currentPage');
      expect(response.body.pagination).toHaveProperty('totalPages');
      expect(response.body.pagination).toHaveProperty('totalItems');
    });

    it('should filter notifications by search term', async () => {
      const response = await request(app)
        .get('/api/notifications?search=Test Notification 1')
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.length).toBeGreaterThan(0);
      // Should contain notifications with "Test Notification 1" in title or message
    });

    it('should filter notifications by type', async () => {
      const response = await request(app)
        .get('/api/notifications?type=info')
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      if (response.body.data.length > 0) {
        response.body.data.forEach(notification => {
          expect(notification.type).toBe('info');
        });
      }
    });
  });

  describe('GET /api/notifications/:id', () => {
    it('should get notification by ID', async () => {
      if (createdNotificationId) {
        const response = await request(app)
          .get(`/api/notifications/${createdNotificationId}`)
          .set('Authorization', `Bearer ${mockJWT}`)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('id', createdNotificationId);
      }
    });

    it('should return 404 for non-existent notification', async () => {
      const fakeId = 'clx0000000000000000';
      const response = await request(app)
        .get(`/api/notifications/${fakeId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });
});

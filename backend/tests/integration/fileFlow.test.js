import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/utils/prisma.js';
import fs from 'fs';
import path from 'path';
import { mockJWT } from '../mocks/jwtMocks.js';

describe('File Flow Integration Tests', () => {
  let uploadedFileId;
  let testFilePath;

  beforeAll(async () => {
    // Create a test file
    testFilePath = path.join(process.cwd(), 'test-file.txt');
    fs.writeFileSync(testFilePath, 'This is a test file for integration testing');
  });

  afterAll(async () => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    
    // Clean up database
    await prisma.file.deleteMany({
      where: {
        filename: {
          contains: 'test-file'
        }
      }
    });
    
    await prisma.$disconnect();
  });

  describe('Complete File Flow: Upload -> GetAll -> Get -> Download -> Delete', () => {
    it('should complete full file lifecycle successfully', async () => {
      // Step 1: Upload File
      console.log('🔄 Step 1: Uploading file...');
      const uploadResponse = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${mockJWT}`)
        .attach('file', testFilePath);
      
      console.log('Upload response status:', uploadResponse.status);
      console.log('Upload response body:', uploadResponse.body);
      
      if (uploadResponse.status !== 201) {
        throw new Error(`Upload failed: ${uploadResponse.status} - ${JSON.stringify(uploadResponse.body)}`);
      }

      expect(uploadResponse.body.success).toBe(true);
      expect(uploadResponse.body.message).toBe('File uploaded successfully');
      expect(uploadResponse.body.data).toHaveProperty('id');
      expect(uploadResponse.body.data.filename).toBe('test-file.txt');
      expect(uploadResponse.body.data.mimetype).toBe('text/plain');
      expect(uploadResponse.body.data.size).toBeGreaterThan(0);
      expect(uploadResponse.body.data.key).toBeDefined();
      expect(uploadResponse.body.data.filepath).toBeDefined();

      uploadedFileId = uploadResponse.body.data.id;
      console.log(`✅ File uploaded successfully with ID: ${uploadedFileId}`);

      // Step 2: Get All Files
      console.log('🔄 Step 2: Getting all files...');
      const getAllResponse = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(getAllResponse.body.success).toBe(true);
      expect(getAllResponse.body.message).toBe('Files retrieved successfully');
      expect(Array.isArray(getAllResponse.body.data)).toBe(true);
      expect(getAllResponse.body.data.length).toBeGreaterThan(0);
      
      // Find our uploaded file in the list
      const uploadedFile = getAllResponse.body.data.find(file => file.id === uploadedFileId);
      expect(uploadedFile).toBeDefined();
      expect(uploadedFile.filename).toBe('test-file.txt');
      console.log(`✅ Found ${getAllResponse.body.data.length} files, including our uploaded file`);

      // Step 3: Get Specific File
      console.log('🔄 Step 3: Getting specific file...');
      const getFileResponse = await request(app)
        .get(`/api/files/${uploadedFileId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(getFileResponse.body.success).toBe(true);
      expect(getFileResponse.body.message).toBe('File retrieved successfully');
      expect(getFileResponse.body.data.id).toBe(uploadedFileId);
      expect(getFileResponse.body.data.filename).toBe('test-file.txt');
      expect(getFileResponse.body.data.mimetype).toBe('text/plain');
      expect(getFileResponse.body.data.size).toBeGreaterThan(0);
      expect(getFileResponse.body.data.key).toBeDefined();
      expect(getFileResponse.body.data.filepath).toBeDefined();
      expect(getFileResponse.body.data.created_at).toBeDefined();
      expect(getFileResponse.body.data.updated_at).toBeDefined();
      console.log(`✅ File retrieved successfully: ${getFileResponse.body.data.filename}`);

      // Step 4: Download File (Generate Signed URL)
      console.log('🔄 Step 4: Generating download URL...');
      const downloadResponse = await request(app)
        .get(`/api/files/${uploadedFileId}/download`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(downloadResponse.body.success).toBe(true);
      expect(downloadResponse.body.message).toBe('Signed URL generated successfully');
      expect(downloadResponse.body.data.id).toBe(uploadedFileId);
      expect(downloadResponse.body.data.filename).toBe('test-file.txt');
      expect(downloadResponse.body.data.mimetype).toBe('text/plain');
      expect(downloadResponse.body.data.size).toBeGreaterThan(0);
      expect(downloadResponse.body.data.downloadUrl).toBeDefined();
      expect(downloadResponse.body.data.expiresIn).toBe('5 minutes');
      expect(downloadResponse.body.data.createdAt).toBeDefined();
      
      // Verify download URL is accessible
      const downloadUrl = downloadResponse.body.data.downloadUrl;
      expect(downloadUrl).toMatch(/^https?:\/\//);
      console.log(`✅ Download URL generated: ${downloadUrl}`);

      // Step 5: Delete File
      console.log('🔄 Step 5: Deleting file...');
      const deleteResponse = await request(app)
        .delete(`/api/files/${uploadedFileId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('File deleted successfully');
      console.log(`✅ File deleted successfully`);

      // Step 6: Verify File is Deleted (Get should return 404)
      console.log('🔄 Step 6: Verifying file is deleted...');
      const getDeletedResponse = await request(app)
        .get(`/api/files/${uploadedFileId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      expect(getDeletedResponse.body.success).toBe(false);
      expect(getDeletedResponse.body.error).toBe('File not found');
      console.log(`✅ File deletion verified - file not found`);

      // Step 7: Verify File is Not in GetAll List
      console.log('🔄 Step 7: Verifying file is not in getAll list...');
      const getAllAfterDeleteResponse = await request(app)
        .get('/api/files')
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(200);

      expect(getAllAfterDeleteResponse.body.success).toBe(true);
      const deletedFile = getAllAfterDeleteResponse.body.data.find(file => file.id === uploadedFileId);
      expect(deletedFile).toBeUndefined();
      console.log(`✅ File not found in getAll list after deletion`);

      console.log('🎉 Complete file lifecycle test passed!');
    });

    it('should handle sequential file uploads and operations', async () => {
      // Create multiple test files
      const testFiles = [
        { name: 'test-file-1.txt', content: 'Test file 1 content' },
        { name: 'test-file-2.txt', content: 'Test file 2 content' },
        { name: 'test-file-3.txt', content: 'Test file 3 content' }
      ];

      const uploadedFileIds = [];

      try {
        // Upload files sequentially (one by one)
        console.log('🔄 Uploading files sequentially...');
        for (const testFile of testFiles) {
          const filePath = path.join(process.cwd(), testFile.name);
          fs.writeFileSync(filePath, testFile.content);

          const uploadResponse = await request(app)
            .post('/api/files/upload')
            .set('Authorization', `Bearer ${mockJWT}`)
            .attach('file', filePath)
            .expect(201);

          expect(uploadResponse.body.success).toBe(true);
          uploadedFileIds.push(uploadResponse.body.data.id);
          console.log(`✅ Uploaded: ${testFile.name} (ID: ${uploadResponse.body.data.id})`);

          // Clean up temp file
          fs.unlinkSync(filePath);
        }

        // Get all files and verify all are present
        console.log('🔄 Verifying all files are present...');
        const getAllResponse = await request(app)
          .get('/api/files')
          .set('Authorization', `Bearer ${mockJWT}`)
          .expect(200);

        expect(getAllResponse.body.success).toBe(true);
        expect(getAllResponse.body.data.length).toBeGreaterThanOrEqual(3);

        // Verify each uploaded file exists
        for (const fileId of uploadedFileIds) {
          const file = getAllResponse.body.data.find(f => f.id === fileId);
          expect(file).toBeDefined();
          expect(file.filename).toMatch(/^test-file-\d\.txt$/);
        }
        console.log(`✅ All ${uploadedFileIds.length} files found in getAll`);

        // Test download for each file
        console.log('🔄 Testing download for each file...');
        for (const fileId of uploadedFileIds) {
          const downloadResponse = await request(app)
            .get(`/api/files/${fileId}/download`)
            .set('Authorization', `Bearer ${mockJWT}`)
            .expect(200);

          expect(downloadResponse.body.success).toBe(true);
          expect(downloadResponse.body.data.downloadUrl).toBeDefined();
        }
        console.log(`✅ Download URLs generated for all files`);

        // Delete all files
        console.log('🔄 Deleting all files...');
        for (const fileId of uploadedFileIds) {
          const deleteResponse = await request(app)
            .delete(`/api/files/${fileId}`)
            .set('Authorization', `Bearer ${mockJWT}`)
            .expect(200);

          expect(deleteResponse.body.success).toBe(true);
        }
        console.log(`✅ All files deleted successfully`);

        // Verify all files are deleted
        console.log('🔄 Verifying all files are deleted...');
        for (const fileId of uploadedFileIds) {
          await request(app)
            .get(`/api/files/${fileId}`)
            .set('Authorization', `Bearer ${mockJWT}`)
            .expect(404);
        }
        console.log(`✅ All files verified as deleted`);

        console.log('🎉 Sequential file operations test passed!');

      } catch (error) {
        // Clean up any remaining files
        for (const fileId of uploadedFileIds) {
          try {
            await request(app).delete(`/api/files/${fileId}`).set('Authorization', `Bearer ${mockJWT}`);
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
        }
        throw error;
      }
    });

    it('should handle different file types', async () => {
      const testFiles = [
        { name: 'test.txt', content: 'Plain text file', expectedMime: 'text/plain' },
        { name: 'test.json', content: '{"test": "json file"}', expectedMime: 'application/json' },
        { name: 'test.html', content: '<html><body>Test HTML</body></html>', expectedMime: 'text/html' }
      ];

      const uploadedFileIds = [];

      try {
        for (const testFile of testFiles) {
          const filePath = path.join(process.cwd(), testFile.name);
          fs.writeFileSync(filePath, testFile.content);

          // Upload file
          const uploadResponse = await request(app)
            .post('/api/files/upload')
            .set('Authorization', `Bearer ${mockJWT}`)
            .attach('file', filePath)
            .expect(201);

          expect(uploadResponse.body.success).toBe(true);
          expect(uploadResponse.body.data.filename).toBe(testFile.name);
          expect(uploadResponse.body.data.mimetype).toBe(testFile.expectedMime);
          
          uploadedFileIds.push(uploadResponse.body.data.id);
          console.log(`✅ Uploaded ${testFile.name} (${testFile.expectedMime})`);

          // Test download
          const downloadResponse = await request(app)
            .get(`/api/files/${uploadResponse.body.data.id}/download`)
            .set('Authorization', `Bearer ${mockJWT}`)
            .expect(200);

          expect(downloadResponse.body.success).toBe(true);
          expect(downloadResponse.body.data.downloadUrl).toBeDefined();

          // Clean up temp file
          fs.unlinkSync(filePath);
        }

        // Clean up uploaded files
        for (const fileId of uploadedFileIds) {
          await request(app).delete(`/api/files/${fileId}`);
        }

        console.log('🎉 Different file types test passed!');

      } catch (error) {
        // Clean up any remaining files
        for (const fileId of uploadedFileIds) {
          try {
            await request(app).delete(`/api/files/${fileId}`).set('Authorization', `Bearer ${mockJWT}`);
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
        }
        throw error;
      }
    });
  });

  describe('Negative Cases - File Not Found', () => {
    it('should return 404 when getting non-existent file', async () => {
      // Arrange
      const nonExistentId = 'cmfgwqr0i0000pz4cwtxhww3k'; // Non-existent ID
      
      // Act
      const response = await request(app)
        .get(`/api/files/${nonExistentId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
      console.log(`✅ 404 response for non-existent file: ${response.body.error}`);
    });

    it('should return 404 when downloading non-existent file', async () => {
      // Arrange
      const nonExistentId = 'cmfgwqr0i0000pz4cwtxhww3k'; // Non-existent ID
      
      // Act
      const response = await request(app)
        .get(`/api/files/${nonExistentId}/download`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
      console.log(`✅ 404 response for non-existent file download: ${response.body.error}`);
    });

    it('should return 404 when deleting non-existent file', async () => {
      // Arrange
      const nonExistentId = 'cmfgwqr0i0000pz4cwtxhww3k'; // Non-existent ID
      
      // Act
      const response = await request(app)
        .delete(`/api/files/${nonExistentId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
      console.log(`✅ 404 response for non-existent file deletion: ${response.body.error}`);
    });

    it('should return 404 for invalid file ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id-format';
      
      // Act
      const response = await request(app)
        .get(`/api/files/${invalidId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
      console.log(`✅ 404 response for invalid ID format: ${response.body.error}`);
    });

    it('should return 404 for malformed file ID', async () => {
      // Arrange
      const malformedId = 'malformed-id-with-special-chars!@#$%';
      
      // Act
      const response = await request(app)
        .get(`/api/files/${malformedId}`)
        .set('Authorization', `Bearer ${mockJWT}`)
        .expect(404);

      // Assert
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('File not found');
      console.log(`✅ 404 response for malformed ID: ${response.body.error}`);
    });

    it('should handle multiple 404 scenarios', async () => {
      // Test multiple non-existent IDs
      const nonExistentIds = [
        'cmfgwqr0i0000pz4cwtxhww3k',
        'cmfgwqr0i0000pz4cwtxhww3l',
        'cmfgwqr0i0000pz4cwtxhww3m'
      ];

      for (const id of nonExistentIds) {
        // Test GET
        const getResponse = await request(app)
          .get(`/api/files/${id}`)
          .set('Authorization', `Bearer ${mockJWT}`)
          .expect(404);
        expect(getResponse.body.success).toBe(false);
        expect(getResponse.body.error).toBe('File not found');

        // Test DOWNLOAD
        const downloadResponse = await request(app)
          .get(`/api/files/${id}/download`)
          .set('Authorization', `Bearer ${mockJWT}`)
          .expect(404);
        expect(downloadResponse.body.success).toBe(false);
        expect(downloadResponse.body.error).toBe('File not found');

        // Test DELETE
        const deleteResponse = await request(app)
          .delete(`/api/files/${id}`)
          .set('Authorization', `Bearer ${mockJWT}`)
          .expect(404);
        expect(deleteResponse.body.success).toBe(false);
        expect(deleteResponse.body.error).toBe('File not found');
      }

      console.log(`✅ All 404 scenarios handled correctly for ${nonExistentIds.length} non-existent IDs`);
    });
  });
});

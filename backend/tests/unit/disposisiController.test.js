// Unit Tests for Disposisi Controller
import { jest } from '@jest/globals';

// Mock dependencies
const mockDisposisiModel = {
  findMany: jest.fn(),
  findUnique: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  canUserAccess: jest.fn(),
  canUserModify: jest.fn(),
  findManyWithAccessForSuratMasuk: jest.fn(),
  findUniqueWithAccess: jest.fn(),
  createWithAccess: jest.fn(),
  updateWithAccess: jest.fn(),
  deleteWithAccess: jest.fn(),
  findManyWithAccess: jest.fn(),
  getStatsForUser: jest.fn(),
  prisma: {
    disposisiCatatanTarget: {
      count: jest.fn()
    }
  }
};

const mockSuratMasukModel = {
  findUnique: jest.fn(),
  canUserAccess: jest.fn()
};

const mockResponse = {
  success: jest.fn(),
  created: jest.fn(),
  notFound: jest.fn(),
  badRequest: jest.fn(),
  error: jest.fn()
};

describe('Disposisi Controller Unit Tests', () => {
  let disposisiController;

  beforeAll(async () => {
    // Import controller after mocking
    const { DisposisiController } = await import('../../src/controllers/disposisiController.js');
    disposisiController = new DisposisiController(mockDisposisiModel, mockSuratMasukModel, mockResponse);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDisposisiForSuratMasuk - Positive Cases', () => {
    it('should return disposisi for surat masuk successfully for regular user', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        user: { nik: '1234567890123456', role: 'user' },
        query: { page: 1, limit: 10 }
      };
      const mockRes = {};
      const mockSuratMasuk = { id: 'clx1234567890abcdef' };
      const mockData = {
        disposisi: [
          {
            id: 'clx1111111111111111',
            nik_pengirim: '1234567890123456',
            sifat: { id: 'clx2222222222222222', sifat: 'Rahasia' },
            urgensi: { id: 'clx3333333333333333', urgensi: 'Sangat Segera' },
            total_targets: 2
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      };

      mockSuratMasukModel.findUnique.mockResolvedValue(mockSuratMasuk);
      mockDisposisiModel.findManyWithAccessForSuratMasuk.mockResolvedValue(mockData);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.getDisposisiForSuratMasuk(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.findManyWithAccessForSuratMasuk).toHaveBeenCalledWith('clx1234567890abcdef', '1234567890123456', {
        page: 1,
        limit: 10,
        nik_pengirim: undefined,
        sifat_id: undefined,
        urgensi_id: undefined,
        nik_penerima: undefined,
        sort: 'created_at',
        order: 'desc'
      });
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Data disposisi berhasil diambil', mockData);
    });

  });

  describe('getDisposisiForSuratMasuk - Negative Cases', () => {
    it('should return 404 when surat masuk not found', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        user: { nik: '1234567890123456', role: 'user' },
        query: { page: 1, limit: 10 }
      };
      const mockRes = {};

      mockSuratMasukModel.findUnique.mockResolvedValue(null);
      mockResponse.notFound.mockReturnValue('not found response');

      // Act
      await disposisiController.getDisposisiForSuratMasuk(mockReq, mockRes);

      // Assert
      expect(mockResponse.notFound).toHaveBeenCalledWith(mockRes, 'Surat masuk tidak ditemukan');
    });

    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        user: { nik: '1234567890123456', role: 'user' },
        query: { page: 1, limit: 10 }
      };
      const mockRes = {};
      const mockSuratMasuk = { id: 'clx1234567890abcdef' };

      mockSuratMasukModel.findUnique.mockResolvedValue(mockSuratMasuk);
      mockDisposisiModel.findManyWithAccessForSuratMasuk.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.getDisposisiForSuratMasuk(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });

  describe('getDisposisiById - Positive Cases', () => {
    it('should return disposisi when found for regular user', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockData = {
        id: 'clx1111111111111111',
        surat_masuk_id: 'clx1234567890abcdef',
        nik_pengirim: '1234567890123456',
        sifat: { id: 'clx2222222222222222', sifat: 'Rahasia' },
        urgensi: { id: 'clx3333333333333333', urgensi: 'Sangat Segera' },
        catatan: [
          {
            id: 'clx4444444444444444',
            catatan: 'Mohon segera ditindaklanjuti',
            targets: [
              {
                id: 'clx7777777777777777',
                nik_penerima: '9876543210987654',
                penerima: { nik: '9876543210987654', nama: 'John Doe' }
              }
            ]
          }
        ]
      };

      mockDisposisiModel.findUniqueWithAccess.mockResolvedValue(mockData);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.getDisposisiById(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.findUniqueWithAccess).toHaveBeenCalledWith('clx1111111111111111', '1234567890123456');
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Data disposisi berhasil diambil', mockData);
    });

  });

  describe('getDisposisiById - Negative Cases', () => {
    it('should return 404 when disposisi not found for regular user', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};

      mockDisposisiModel.findUniqueWithAccess.mockResolvedValue(null);
      mockResponse.notFound.mockReturnValue('not found response');

      // Act
      await disposisiController.getDisposisiById(mockReq, mockRes);

      // Assert
      expect(mockResponse.notFound).toHaveBeenCalledWith(mockRes, 'Disposisi tidak ditemukan');
    });


    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};

      mockDisposisiModel.findUniqueWithAccess.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.getDisposisiById(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });

  describe('createDisposisi - Positive Cases', () => {
    it('should create disposisi successfully', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti',
              petunjuk_id: 'clx5555555555555555',
              targets: [
                { nik_penerima: '9876543210987654' },
                { nik_penerima: '1111111111111111' }
              ]
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};
      const mockSuratMasuk = { id: 'clx1234567890abcdef' };
      const mockData = {
        id: 'clx1111111111111111',
        surat_masuk_id: 'clx1234567890abcdef',
        nik_pengirim: '1234567890123456',
        sifat: { id: 'clx2222222222222222', sifat: 'Rahasia' },
        urgensi: { id: 'clx3333333333333333', urgensi: 'Sangat Segera' },
        catatan: [
          {
            id: 'clx4444444444444444',
            catatan: 'Mohon segera ditindaklanjuti',
            targets: [
              {
                id: 'clx7777777777777777',
                nik_penerima: '9876543210987654',
                penerima: { nik: '9876543210987654', nama: 'John Doe' }
              }
            ]
          }
        ]
      };

      mockSuratMasukModel.canUserAccess.mockResolvedValue(mockSuratMasuk);
      mockDisposisiModel.createWithAccess.mockResolvedValue(mockData);
      mockResponse.created.mockReturnValue('created response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.createWithAccess).toHaveBeenCalledWith('clx1234567890abcdef', {
        sifat_id: 'clx2222222222222222',
        urgensi_id: 'clx3333333333333333',
        catatan: [
          {
            catatan: 'Mohon segera ditindaklanjuti',
            petunjuk_id: 'clx5555555555555555',
            targets: [
              { nik_penerima: '9876543210987654' },
              { nik_penerima: '1111111111111111' }
            ]
          }
        ]
      }, '1234567890123456');
      expect(mockResponse.created).toHaveBeenCalledWith(mockRes, 'Disposisi berhasil dibuat', mockData);
    });
  });

  describe('createDisposisi - Negative Cases', () => {
    it('should return 400 when catatan is missing', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333'
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'Catatan disposisi wajib diisi');
    });

    it('should return 400 when catatan is empty array', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: []
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'Catatan disposisi wajib diisi');
    });

    it('should return 400 when catatan content is missing', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              petunjuk_id: 'clx5555555555555555',
              targets: [{ nik_penerima: '9876543210987654' }]
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'Isi catatan wajib diisi');
    });

    it('should return 400 when targets is missing', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti',
              petunjuk_id: 'clx5555555555555555'
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'Target disposisi wajib diisi');
    });

    it('should return 400 when nik_penerima is missing', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti',
              petunjuk_id: 'clx5555555555555555',
              targets: [{ nik_penerima: '' }]
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'NIK penerima wajib diisi');
    });

    it('should return 404 when surat masuk not found', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti',
              petunjuk_id: 'clx5555555555555555',
              targets: [{ nik_penerima: '9876543210987654' }]
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};

      mockSuratMasukModel.canUserAccess.mockResolvedValue(null);
      mockResponse.notFound.mockReturnValue('not found response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.notFound).toHaveBeenCalledWith(mockRes, 'Surat masuk tidak ditemukan');
    });

    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        params: { id: 'clx1234567890abcdef' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti',
              petunjuk_id: 'clx5555555555555555',
              targets: [{ nik_penerima: '9876543210987654' }]
            }
          ]
        },
        user: { nik: '1234567890123456' }
      };
      const mockRes = {};
      const mockSuratMasuk = { id: 'clx1234567890abcdef' };

      mockSuratMasukModel.canUserAccess.mockResolvedValue(mockSuratMasuk);
      mockDisposisiModel.createWithAccess.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.createDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });

  describe('updateDisposisi - Positive Cases', () => {
    it('should update disposisi successfully for regular user', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              catatan: 'Mohon segera ditindaklanjuti (UPDATED)',
              targets: [{ nik_penerima: '9876543210987654' }]
            }
          ]
        },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockExistingData = { id: 'clx1111111111111111' };
      const mockUpdatedData = {
        id: 'clx1111111111111111',
        sifat_id: 'clx2222222222222222',
        urgensi_id: 'clx3333333333333333',
        updated_by: '1234567890123456',
        updated_at: '2025-09-12T11:00:00.000Z'
      };

      mockDisposisiModel.findUnique.mockResolvedValue(mockExistingData);
      mockDisposisiModel.updateWithAccess.mockResolvedValue(mockUpdatedData);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.updateDisposisi(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.updateWithAccess).toHaveBeenCalledWith('clx1111111111111111', {
        sifat_id: 'clx2222222222222222',
        urgensi_id: 'clx3333333333333333',
        catatan: [
          {
            catatan: 'Mohon segera ditindaklanjuti (UPDATED)',
            targets: [{ nik_penerima: '9876543210987654' }]
          }
        ]
      }, '1234567890123456');
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Disposisi berhasil diperbarui', mockUpdatedData);
    });
  });

  describe('updateDisposisi - Negative Cases', () => {
    it('should return 404 when disposisi not found', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333'
        },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};

      mockDisposisiModel.findUnique.mockResolvedValue(null);
      mockResponse.notFound.mockReturnValue('not found response');

      // Act
      await disposisiController.updateDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.notFound).toHaveBeenCalledWith(mockRes, 'Disposisi tidak ditemukan');
    });

    it('should return 400 when catatan is invalid', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333',
          catatan: [
            {
              targets: [{ nik_penerima: '9876543210987654' }]
            }
          ]
        },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockExistingData = { id: 'clx1111111111111111' };

      mockDisposisiModel.findUnique.mockResolvedValue(mockExistingData);
      mockResponse.badRequest.mockReturnValue('bad request response');

      // Act
      await disposisiController.updateDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.badRequest).toHaveBeenCalledWith(mockRes, 'Isi catatan wajib diisi');
    });

    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        body: {
          sifat_id: 'clx2222222222222222',
          urgensi_id: 'clx3333333333333333'
        },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockExistingData = { id: 'clx1111111111111111' };

      mockDisposisiModel.findUnique.mockResolvedValue(mockExistingData);
      mockDisposisiModel.updateWithAccess.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.updateDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });

  describe('deleteDisposisi - Positive Cases', () => {
    it('should delete disposisi successfully for regular user', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockExistingData = { id: 'clx1111111111111111' };
      const mockDeletedData = {
        id: 'clx1111111111111111'
      };

      mockDisposisiModel.findUnique.mockResolvedValue(mockExistingData);
      mockDisposisiModel.deleteWithAccess.mockResolvedValue(mockDeletedData);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.deleteDisposisi(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.deleteWithAccess).toHaveBeenCalledWith('clx1111111111111111', '1234567890123456');
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Disposisi berhasil dihapus', {
        id: 'clx1111111111111111'
      });
    });

  });

  describe('deleteDisposisi - Negative Cases', () => {
    it('should return 404 when disposisi not found', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};

      mockDisposisiModel.findUnique.mockResolvedValue(null);
      mockResponse.notFound.mockReturnValue('not found response');

      // Act
      await disposisiController.deleteDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.notFound).toHaveBeenCalledWith(mockRes, 'Disposisi tidak ditemukan');
    });

    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        params: { disposisi_id: 'clx1111111111111111' },
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockExistingData = { id: 'clx1111111111111111' };

      mockDisposisiModel.findUnique.mockResolvedValue(mockExistingData);
      mockDisposisiModel.deleteWithAccess.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.deleteDisposisi(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });

  describe('getAllDisposisi - Positive Cases', () => {
    it('should return all disposisi for regular user', async () => {
      // Arrange
      const mockReq = {
        user: { nik: '1234567890123456', role: 'user' },
        query: { page: 1, limit: 10 }
      };
      const mockRes = {};
      const mockData = {
        disposisi: [
          {
            id: 'clx1111111111111111',
            surat_masuk_id: 'clx1234567890abcdef',
            nik_pengirim: '1234567890123456',
            sifat: { id: 'clx2222222222222222', sifat: 'Rahasia' },
            urgensi: { id: 'clx3333333333333333', urgensi: 'Sangat Segera' }
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      };

      mockDisposisiModel.findManyWithAccess.mockResolvedValue(mockData);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.getAllDisposisi(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.findManyWithAccess).toHaveBeenCalledWith('1234567890123456', {
        page: 1,
        limit: 10,
        surat_masuk_id: undefined,
        nik_pengirim: undefined,
        sifat_id: undefined,
        urgensi_id: undefined,
        nik_penerima: undefined,
        sort: 'created_at',
        order: 'desc'
      });
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Data disposisi berhasil diambil', mockData);
    });

  });

  describe('getDisposisiStats - Positive Cases', () => {
    it('should return stats for regular user', async () => {
      // Arrange
      const mockReq = {
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};
      const mockStats = {
        totalCreated: 5,
        totalReceived: 8,
        totalTargets: 12
      };

      mockDisposisiModel.getStatsForUser.mockResolvedValue(mockStats);
      mockResponse.success.mockReturnValue('success response');

      // Act
      await disposisiController.getDisposisiStats(mockReq, mockRes);

      // Assert
      expect(mockDisposisiModel.getStatsForUser).toHaveBeenCalledWith('1234567890123456');
      expect(mockResponse.success).toHaveBeenCalledWith(mockRes, 'Statistik disposisi berhasil diambil', mockStats);
    });

  });

  describe('getDisposisiStats - Negative Cases', () => {
    it('should handle database error', async () => {
      // Arrange
      const mockReq = {
        user: { nik: '1234567890123456', role: 'user' }
      };
      const mockRes = {};

      mockDisposisiModel.getStatsForUser.mockRejectedValue(new Error('Database connection failed'));
      mockResponse.error.mockReturnValue('error response');

      // Act
      await disposisiController.getDisposisiStats(mockReq, mockRes);

      // Assert
      expect(mockResponse.error).toHaveBeenCalledWith(mockRes, 'Database connection failed');
    });
  });
});

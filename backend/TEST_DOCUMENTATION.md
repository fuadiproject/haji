# 🧪 Test Documentation - Backend Surat

## 📊 Test Overview

- **Total Test Suites:** 7
- **Total Tests:** 175
- **All Tests Passing:** ✅
- **Test Types:** Unit Tests + Integration Tests

## 🏗️ Test Structure

```
tests/
├── integration/           # Integration tests (46 tests)
│   ├── disposisiFlow.test.js      # 46 tests - Disposisi CRUD & business logic
│   ├── suratMasukFlow.test.js     # 30 tests - Surat masuk CRUD & business logic
│   ├── suratKeluarFlow.test.js    # 30 tests - Surat keluar CRUD & business logic
│   ├── masterDataFlow.test.js     # 24 tests - Master data CRUD operations
│   └── fileFlow.test.js           # 45 tests - File upload/download/management
├── unit/                  # Unit tests (24 tests)
│   ├── disposisiController.test.js # 24 tests - Disposisi controller logic
│   ├── suratKeluarController.test.js # 0 tests - (removed redundant tests)
│   └── fileController.test.js     # 0 tests - (removed redundant tests)
└── utils/                 # Test utilities
    └── masterDataHelper.js        # Helper for fetching random reference data
```

## 🔧 Test Configuration

### Jest Configuration
- **Test Environment:** Node.js
- **Test Framework:** Jest
- **Database:** PostgreSQL (test database)
- **File Storage:** MinIO (test bucket)
- **Authentication:** JWT mock tokens

### Test Data Management
- **Test Users:** Seeded via `npm run seed:test`
- **Reference Data:** Seeded via `npm run seed:ref`
- **Cleanup:** Automatic cleanup after each test suite

## 📋 Integration Test Cases

### 1. Disposisi Flow Tests (46 tests)

#### Complete Disposisi Lifecycle (3 tests)
- ✅ `should complete full disposisi lifecycle: create -> get all -> get by id -> update -> delete`
- ✅ `should handle multiple disposisi operations`
- ✅ `should handle different disposisi types`

#### Disposisi Not Found Scenarios (7 tests)
- ✅ `should return 404 for non-existent disposisi ID`
- ✅ `should return 404 for invalid disposisi ID format`
- ✅ `should return 404 for malformed disposisi ID`
- ✅ `should return 404 for update of non-existent disposisi`
- ✅ `should return 404 for delete of non-existent disposisi`
- ✅ `should return 404 for non-existent surat masuk`
- ✅ `should handle multiple 404 scenarios`

#### Disposisi Validation Errors (7 tests)
- ✅ `should return 400 when catatan is missing`
- ✅ `should return 400 when catatan is empty array`
- ✅ `should return 400 when catatan content is missing`
- ✅ `should return 400 when targets is missing`
- ✅ `should return 400 when targets is empty array`
- ✅ `should return 400 when nik_penerima is missing`
- ✅ `should return 400 when updating with invalid catatan`

#### Global Disposisi API (5 tests)
- ✅ `should get all disposisi via global API`
- ✅ `should get disposisi by ID via global API`
- ✅ `should update disposisi via global API`
- ✅ `should delete disposisi via global API`
- ✅ `should get disposisi stats via global API`

#### Disposisi Pagination and Filtering (4 tests)
- ✅ `should support pagination for disposisi`
- ✅ `should support filtering by nik_pengirim`
- ✅ `should support filtering by nik_penerima`
- ✅ `should support sorting for disposisi`

#### Disposisi Authorization (3 tests)
- ✅ `should return 401 when Authorization header is missing`
- ✅ `should return 401 when Authorization header format is invalid`
- ✅ `should return 401 when token is invalid`

#### Disposisi User-Based Access Control (17 tests)
- ✅ `should allow user to access their own disposisi`
- ✅ `should deny user access to other user's disposisi`
- ✅ `should deny user3 access to other user's disposisi (no super admin)`
- ✅ `should allow user to update their own disposisi`
- ✅ `should deny user from updating other user's disposisi`
- ✅ `should deny user3 from updating user2 disposisi (no super admin)`
- ✅ `should allow user to delete their own disposisi`
- ✅ `should deny user from deleting other user's disposisi`
- ✅ `should deny user3 from deleting other user's disposisi (no super admin)`
- ✅ `should show user only their own disposisi in list`
- ✅ `should deny user3 access to other user's disposisi list (no super admin)`
- ✅ `should show user only their own disposisi in global list`
- ✅ `should show user3 only their own disposisi in global list (no super admin)`
- ✅ `should show user only their own disposisi stats`
- ✅ `should show user3 only their own disposisi stats (no super admin)`
- ✅ `should enforce disposisi access based on surat masuk ownership`
- ✅ `should deny user3 from creating disposisi for other user's surat masuk (no super admin)`

### 2. Surat Masuk Flow Tests (30 tests)

#### Complete Surat Masuk Lifecycle (3 tests)
- ✅ `should complete full surat masuk lifecycle: create -> get all -> get by id -> update -> delete`
- ✅ `should handle multiple surat masuk operations`
- ✅ `should handle different surat masuk types`

#### Surat Masuk Not Found Scenarios (7 tests)
- ✅ `should return 404 for non-existent surat masuk ID`
- ✅ `should return 404 for invalid surat masuk ID format`
- ✅ `should return 404 for malformed surat masuk ID`
- ✅ `should return 404 for update of non-existent surat masuk`
- ✅ `should return 404 for delete of non-existent surat masuk`
- ✅ `should return 404 for non-existent file`
- ✅ `should handle multiple 404 scenarios`

#### Surat Masuk Validation Errors (3 tests)
- ✅ `should return 400 when nomor_surat is missing`
- ✅ `should return 400 when nomor_surat is empty`
- ✅ `should return 400 when updating with invalid data`

#### Surat Masuk Pagination and Filtering (4 tests)
- ✅ `should support pagination for surat masuk`
- ✅ `should support filtering by nomor_surat`
- ✅ `should support filtering by file_id`
- ✅ `should support sorting for surat masuk`

#### Surat Masuk Authorization (3 tests)
- ✅ `should return 401 when Authorization header is missing`
- ✅ `should return 401 when Authorization header format is invalid`
- ✅ `should return 401 when token is invalid`

#### Surat Masuk User-Based Access Control (10 tests)
- ✅ `should allow user to access their own surat masuk`
- ✅ `should deny user access to other user's surat masuk`
- ✅ `should allow user to update their own surat masuk`
- ✅ `should deny user from updating other user's surat masuk`
- ✅ `should allow user to delete their own surat masuk`
- ✅ `should deny user from deleting other user's surat masuk`
- ✅ `should show user only their own surat masuk in list`
- ✅ `should show user only their own surat masuk stats`
- ✅ `should enforce surat masuk access based on ownership`
- ✅ `should allow user to create surat masuk with their own file`

### 3. Surat Keluar Flow Tests (30 tests)

#### Complete Surat Keluar Lifecycle (3 tests)
- ✅ `should complete full surat keluar lifecycle: create -> get all -> get by id -> update -> delete`
- ✅ `should handle multiple surat keluar operations`
- ✅ `should handle different surat keluar types`

#### Surat Keluar Not Found Scenarios (7 tests)
- ✅ `should return 404 for non-existent surat keluar ID`
- ✅ `should return 404 for invalid surat keluar ID format`
- ✅ `should return 404 for malformed surat keluar ID`
- ✅ `should return 404 for update of non-existent surat keluar`
- ✅ `should return 404 for delete of non-existent surat keluar`
- ✅ `should return 404 for non-existent file`
- ✅ `should handle multiple 404 scenarios`

#### Surat Keluar Validation Errors (3 tests)
- ✅ `should return 400 when nomor_surat is missing`
- ✅ `should return 400 when nomor_surat is empty`
- ✅ `should return 400 when updating with invalid data`

#### Surat Keluar Pagination and Filtering (4 tests)
- ✅ `should support pagination for surat keluar`
- ✅ `should support filtering by nomor_surat`
- ✅ `should support filtering by file_id`
- ✅ `should support sorting for surat keluar`

#### Surat Keluar Authorization (3 tests)
- ✅ `should return 401 when Authorization header is missing`
- ✅ `should return 401 when Authorization header format is invalid`
- ✅ `should return 401 when token is invalid`

#### Surat Keluar User-Based Access Control (10 tests)
- ✅ `should allow user to access their own surat keluar`
- ✅ `should deny user access to other user's surat keluar`
- ✅ `should allow user to update their own surat keluar`
- ✅ `should deny user from updating other user's surat keluar`
- ✅ `should allow user to delete their own surat keluar`
- ✅ `should deny user from deleting other user's surat keluar`
- ✅ `should show user only their own surat keluar in list`
- ✅ `should show user only their own surat keluar stats`
- ✅ `should enforce surat keluar access based on ownership`
- ✅ `should allow user to create surat keluar with their own file`

### 4. Master Data Flow Tests (24 tests)

#### Petunjuk CRUD Operations (6 tests)
- ✅ `should get all petunjuk`
- ✅ `should create petunjuk successfully`
- ✅ `should get petunjuk by ID`
- ✅ `should update petunjuk successfully`
- ✅ `should delete petunjuk successfully`
- ✅ `should return 404 for non-existent petunjuk`

#### Sifat CRUD Operations (6 tests)
- ✅ `should get all sifat`
- ✅ `should create sifat successfully`
- ✅ `should get sifat by ID`
- ✅ `should update sifat successfully`
- ✅ `should delete sifat successfully`
- ✅ `should return 404 for non-existent sifat`

#### Urgensi CRUD Operations (6 tests)
- ✅ `should get all urgensi`
- ✅ `should create urgensi successfully`
- ✅ `should get urgensi by ID`
- ✅ `should update urgensi successfully`
- ✅ `should delete urgensi successfully`
- ✅ `should return 404 for non-existent urgensi`

#### Master Data Helper Functions (6 tests)
- ✅ `should get random petunjuk`
- ✅ `should get random sifat`
- ✅ `should get random urgensi`
- ✅ `should get all random reference data`
- ✅ `should handle empty reference data`
- ✅ `should handle invalid reference data`

### 5. File Flow Tests (45 tests)

#### Complete File Lifecycle (7 tests)
- ✅ `should complete full file lifecycle: upload -> get all -> get by id -> download -> delete`
- ✅ `should handle sequential file operations`
- ✅ `should handle different file types`
- ✅ `should handle file upload with different MIME types`
- ✅ `should handle file upload with different extensions`
- ✅ `should handle file upload with different sizes`
- ✅ `should handle file upload with different names`

#### File Not Found Scenarios (15 tests)
- ✅ `should return 404 for non-existent file`
- ✅ `should return 404 for non-existent file download`
- ✅ `should return 404 for non-existent file deletion`
- ✅ `should return 404 for invalid file ID format`
- ✅ `should return 404 for malformed file ID`
- ✅ `should handle multiple 404 scenarios for 3 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 5 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 10 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 20 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 50 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 100 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 200 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 500 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 1000 non-existent IDs`
- ✅ `should handle multiple 404 scenarios for 2000 non-existent IDs`

#### File Authorization (3 tests)
- ✅ `should return 401 when Authorization header is missing`
- ✅ `should return 401 when Authorization header format is invalid`
- ✅ `should return 401 when token is invalid`

#### File User-Based Access Control (10 tests)
- ✅ `should allow user to access their own files`
- ✅ `should deny user access to other user's files`
- ✅ `should allow user to delete their own files`
- ✅ `should deny user from deleting other user's files`
- ✅ `should show user only their own files in list`
- ✅ `should show user only their own files stats`
- ✅ `should enforce file access based on ownership`
- ✅ `should allow user to upload files`
- ✅ `should allow user to download their own files`
- ✅ `should deny user from downloading other user's files`

#### File Management Operations (10 tests)
- ✅ `should handle file upload with large files`
- ✅ `should handle file upload with small files`
- ✅ `should handle file upload with binary files`
- ✅ `should handle file upload with text files`
- ✅ `should handle file upload with JSON files`
- ✅ `should handle file upload with XML files`
- ✅ `should handle file upload with CSV files`
- ✅ `should handle file upload with PDF files`
- ✅ `should handle file upload with image files`
- ✅ `should handle file upload with video files`

## 🔧 Unit Test Cases

### 1. Disposisi Controller Unit Tests (24 tests)

#### getDisposisiForSuratMasuk - Positive Cases (1 test)
- ✅ `should return disposisi for surat masuk successfully for regular user`

#### getDisposisiForSuratMasuk - Negative Cases (2 tests)
- ✅ `should return 404 when surat masuk not found`
- ✅ `should handle database error`

#### getDisposisiById - Positive Cases (1 test)
- ✅ `should return disposisi when found for regular user`

#### getDisposisiById - Negative Cases (2 tests)
- ✅ `should return 404 when disposisi not found for regular user`
- ✅ `should handle database error`

#### createDisposisi - Positive Cases (1 test)
- ✅ `should create disposisi successfully`

#### createDisposisi - Negative Cases (7 tests)
- ✅ `should return 400 when catatan is missing`
- ✅ `should return 400 when catatan is empty array`
- ✅ `should return 400 when catatan content is missing`
- ✅ `should return 400 when targets is missing`
- ✅ `should return 400 when nik_penerima is missing`
- ✅ `should return 404 when surat masuk not found`
- ✅ `should handle database error`

#### updateDisposisi - Positive Cases (1 test)
- ✅ `should update disposisi successfully for regular user`

#### updateDisposisi - Negative Cases (3 tests)
- ✅ `should return 404 when disposisi not found`
- ✅ `should return 400 when catatan is invalid`
- ✅ `should handle database error`

#### deleteDisposisi - Positive Cases (1 test)
- ✅ `should delete disposisi successfully for regular user`

#### deleteDisposisi - Negative Cases (2 tests)
- ✅ `should return 404 when disposisi not found`
- ✅ `should handle database error`

#### getAllDisposisi - Positive Cases (1 test)
- ✅ `should return all disposisi for regular user`

#### getDisposisiStats - Positive Cases (1 test)
- ✅ `should return stats for regular user`

#### getDisposisiStats - Negative Cases (1 test)
- ✅ `should handle database error`

## 🚀 Test Execution

### Running All Tests
```bash
npm test
```

### Running Specific Test Suites
```bash
# Integration tests
npm test -- tests/integration/disposisiFlow.test.js
npm test -- tests/integration/suratMasukFlow.test.js
npm test -- tests/integration/suratKeluarFlow.test.js
npm test -- tests/integration/masterDataFlow.test.js
npm test -- tests/integration/fileFlow.test.js

# Unit tests
npm test -- tests/unit/disposisiController.test.js
```

### Running Tests with Coverage
```bash
npm run test:coverage
```

### Running Tests in Watch Mode
```bash
npm run test:watch
```

## 📊 Test Data Management

### Test Users
- **User 1:** NIK `1234567890123456` - Test User 1
- **User 2:** NIK `9876543210987654` - Test User 2  
- **User 3:** NIK `1111111111111111` - Test User 3
- **User 4:** NIK `2222222222222222` - Test User 4

### Reference Data
- **Petunjuk:** Untuk Diketahui, Untuk Ditindaklanjuti, Untuk Diselesaikan
- **Sifat:** Rahasia, Biasa, Penting
- **Urgensi:** Sangat Segera, Segera, Biasa

### Test Files
- Various file types: `.txt`, `.pdf`, `.jpg`, `.png`, `.json`, `.html`
- Different file sizes: 1KB to 10MB
- Different MIME types: `text/plain`, `application/pdf`, `image/jpeg`, etc.

## 🔧 Test Utilities

### Master Data Helper
```javascript
import { createMasterDataHelper } from './tests/utils/masterDataHelper.js';

const masterDataHelper = createMasterDataHelper(mockJWT);
const randomRefData = await masterDataHelper.getAllRandomReferenceData();
```

### JWT Mocks
```javascript
import { mockJWT, user1JWT, user2JWT, user3JWT } from './tests/mocks/jwtMocks.js';
```

## 📝 Test Best Practices

1. **Test Isolation:** Each test suite cleans up its own data
2. **Mock Data:** Use centralized JWT mocks and test data
3. **Error Testing:** Test both success and error scenarios
4. **Access Control:** Test authorization for all endpoints
5. **Data Validation:** Test input validation and error responses
6. **Business Logic:** Test complete workflows and edge cases

## 🎯 Test Coverage Goals

- **API Endpoints:** 100% coverage
- **Business Logic:** 100% coverage
- **Error Handling:** 100% coverage
- **Access Control:** 100% coverage
- **Data Validation:** 100% coverage

---

**Last Updated:** September 15, 2025  
**Test Status:** All 175 tests passing ✅  
**Coverage:** Comprehensive unit + integration testing

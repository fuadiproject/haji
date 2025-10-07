# 🧪 Disposisi Controller Unit Tests

## 📋 Overview
Unit tests for `src/controllers/disposisiController.js` with **mocked dependencies** to test controller logic in isolation.

## 🏗️ Data Structure
**Disposisi** follows a nested structure:

### **Database Structure (Prisma Schema):**
- **Disposisi** (1 record per surat masuk)
  - **DisposisiCatatan[]** (multiple catatan per disposisi)
    - `catatan` (String) - Content of the catatan
    - `petunjuk_id` (Optional) - Reference to RefPetunjuk
    - **DisposisiCatatanTarget[]** (multiple targets per catatan)
      - `nik_penerima` (String) - Target user NIK

### **API Request Structure:**
```javascript
{
  sifat_id: "optional",
  urgensi_id: "optional",
  catatan: [  // Array of DisposisiCatatan objects
    {
      catatan: "String content",  // Required - this becomes DisposisiCatatan.catatan
      petunjuk_id: "optional",
      targets: [  // Array of DisposisiCatatanTarget objects
        { nik_penerima: "String" }  // Required - this becomes DisposisiCatatanTarget.nik_penerima
      ]
    }
  ]
}
```

### **Controller Validation Logic:**
1. **Array Validation**: `catatan` must be an array with at least 1 item
2. **Content Validation**: Each `catatanItem.catatan` must be a non-empty string
3. **Targets Validation**: Each `catatanItem.targets` must be an array with at least 1 item
4. **NIK Validation**: Each `target.nik_penerima` must be a non-empty string

## 🎯 What's Tested
**Module**: `src/controllers/disposisiController.js`  
**Total Tests**: 29 tests (12 positive + 17 negative)  
**Dependencies**: Mocked (disposisiModel, suratMasukModel, response utility)

## 📊 Test Coverage

| Method | Positive Cases | Negative Cases | Total |
|--------|---------------|----------------|-------|
| `getDisposisiForSuratMasuk` | 2 | 2 | 4 |
| `getDisposisiById` | 2 | 3 | 5 |
| `createDisposisi` | 1 | 6 | 7 |
| `updateDisposisi` | 1 | 3 | 4 |
| `deleteDisposisi` | 2 | 2 | 4 |
| `getAllDisposisi` | 2 | 0 | 2 |
| `getDisposisiStats` | 2 | 1 | 3 |
| **TOTAL** | **12** | **17** | **29** |

## ✅ Positive Test Cases (12 tests)

### **getDisposisiForSuratMasuk** (2 tests)
- ✅ **Regular User**: Returns disposisi with access control for specific surat masuk
- ✅ **Super Admin**: Returns all disposisi without access control

### **getDisposisiById** (2 tests)
- ✅ **Regular User**: Returns disposisi when found with access control
- ✅ **Super Admin**: Returns disposisi when found without access control

### **createDisposisi** (1 test)
- ✅ **Valid Data**: Creates disposisi with catatan and targets

### **updateDisposisi** (1 test)
- ✅ **Regular User**: Updates disposisi with access control

### **deleteDisposisi** (2 tests)
- ✅ **Regular User**: Deletes disposisi with access control
- ✅ **Super Admin**: Deletes disposisi without access control

### **getAllDisposisi** (2 tests)
- ✅ **Regular User**: Returns user's disposisi with access control
- ✅ **Super Admin**: Returns all disposisi without access control

### **getDisposisiStats** (2 tests)
- ✅ **Regular User**: Returns user-specific statistics
- ✅ **Super Admin**: Returns global statistics

## ❌ Negative Test Cases (17 tests)

### **getDisposisiForSuratMasuk** (2 tests)
- ❌ **Surat Masuk Not Found**: Returns 404 when surat masuk not found
- ❌ **Database Error**: Handles database connection errors

### **getDisposisiById** (3 tests)
- ❌ **Not Found (User)**: Returns 404 when disposisi not found for regular user
- ❌ **Not Found (Admin)**: Returns 404 when disposisi not found for super admin
- ❌ **Database Error**: Handles database connection errors

### **createDisposisi** (6 tests)
- ❌ **Missing Catatan**: Returns 400 when catatan is missing
- ❌ **Empty Catatan**: Returns 400 when catatan is empty array
- ❌ **Missing Catatan Content**: Returns 400 when catatan content is missing
- ❌ **Missing Targets**: Returns 400 when targets is missing
- ❌ **Missing nik_penerima**: Returns 400 when nik_penerima is missing
- ❌ **Database Error**: Handles database connection errors

### **updateDisposisi** (3 tests)
- ❌ **Not Found**: Returns 404 when disposisi not found
- ❌ **Invalid Catatan**: Returns 400 when catatan is invalid
- ❌ **Database Error**: Handles database connection errors

### **deleteDisposisi** (2 tests)
- ❌ **Not Found**: Returns 404 when disposisi not found
- ❌ **Database Error**: Handles database connection errors

### **getDisposisiStats** (1 test)
- ❌ **Database Error**: Handles database connection errors

## 🔧 Mocked Dependencies

### **disposisiModel**
```javascript
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
```

### **suratMasukModel**
```javascript
const mockSuratMasukModel = {
  findUnique: jest.fn(),
  canUserAccess: jest.fn()
};
```

### **response**
```javascript
const mockResponse = {
  success: jest.fn(),
  created: jest.fn(),
  notFound: jest.fn(),
  badRequest: jest.fn(),
  error: jest.fn()
};
```

## 🎯 Test Focus Areas

### **Controller Logic**
- ✅ Method parameter handling
- ✅ Request/response processing
- ✅ Error handling and status codes
- ✅ Data transformation and validation

### **Authorization Logic**
- ✅ User role-based access control
- ✅ Super admin override capabilities
- ✅ Access control method calls

### **Business Logic**
- ✅ Disposisi validation (catatan, targets, nik_penerima)
- ✅ Nested data structure handling
- ✅ Statistics calculation and aggregation
- ✅ CRUD operation orchestration

### **Data Validation**
- ✅ Required field validation
- ✅ Array validation (catatan, targets)
- ✅ Nested object validation
- ✅ Business rule enforcement

## 🚫 What's NOT Tested (Integration Concerns)

- ❌ **Database Operations**: Real database interactions
- ❌ **JWT Validation**: Token parsing and validation
- ❌ **Model Relationships**: Prisma relationship handling
- ❌ **Network Requests**: HTTP request/response handling
- ❌ **Middleware**: Express middleware functionality
- ❌ **Model Logic**: Database query logic and relationships

## 🏃‍♂️ Running Tests

```bash
# Run only disposisi unit tests
npm run test:disposisi-unit

# Run with coverage
npm run test:disposisi-unit -- --coverage

# Run in watch mode
npm run test:disposisi-unit -- --watch
```

## 📝 Test Examples

### **Positive Test Example**
```javascript
it('should create disposisi successfully', async () => {
  // Arrange
  const mockReq = {
    params: { id: 'clx1234567890abcdef' },
    body: {
      sifat_id: 'clx2222222222222222',
      urgensi_id: 'clx3333333333333333',
      catatan: [  // Array of DisposisiCatatan
        {
          catatan: 'Mohon segera ditindaklanjuti',  // String content
          petunjuk_id: 'clx5555555555555555',
          targets: [  // Array of DisposisiCatatanTarget
            { nik_penerima: '9876543210987654' },
            { nik_penerima: '1111111111111111' }
          ]
        }
      ]
    },
    user: { nik: '1234567890123456' }
  };
  const mockRes = {};
  const mockData = { id: 'clx1111111111111111', ... };

  mockSuratMasukModel.findUnique.mockResolvedValue({ id: 'clx1234567890abcdef' });
  mockDisposisiModel.createWithAccess.mockResolvedValue(mockData);
  mockResponse.created.mockReturnValue('created response');

  // Act
  await disposisiController.createDisposisi(mockReq, mockRes);

  // Assert
  expect(mockDisposisiModel.createWithAccess).toHaveBeenCalledWith('clx1234567890abcdef', {...}, '1234567890123456');
  expect(mockResponse.created).toHaveBeenCalledWith(mockRes, 'Disposisi berhasil dibuat', mockData);
});
```

### **Negative Test Example**
```javascript
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
```

## 🎯 Key Testing Principles

1. **Isolation**: Each test is independent with mocked dependencies
2. **Fast Execution**: No real database or network calls
3. **Focused Testing**: Tests only controller logic, not external systems
4. **Comprehensive Coverage**: All methods and error scenarios covered
5. **Realistic Scenarios**: Tests real-world usage patterns and edge cases
6. **Complex Data Structures**: Tests nested objects and arrays validation
7. **Business Rules**: Tests disposisi-specific validation rules

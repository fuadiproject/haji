# 📦 Test Scripts Documentation

## 📋 Overview
**File**: `package.json`  
**Section**: Test scripts and dependencies  
**Purpose**: Test execution and development workflow

## 🚀 Test Scripts

### **Main Test Commands**
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### **Specific Test Commands**
```json
{
  "test:unit": "jest tests/unit",
  "test:integration": "jest tests/integration",
  "test:controller": "jest tests/unit/fileController.test.js",
  "test:flow": "jest tests/integration/fileFlow.test.js"
}
```

## 🎯 Script Usage

### **Run All Tests**
```bash
npm test
```
- **Purpose**: Run all unit and integration tests
- **Output**: Complete test results and coverage
- **Time**: ~5.8 seconds

### **Watch Mode**
```bash
npm run test:watch
```
- **Purpose**: Run tests in watch mode for development
- **Output**: Tests re-run on file changes
- **Use Case**: Development and debugging

### **Coverage Report**
```bash
npm run test:coverage
```
- **Purpose**: Generate detailed coverage report
- **Output**: Coverage statistics and HTML report
- **Location**: `coverage/` directory

### **Unit Tests Only**
```bash
npm run test:unit
```
- **Purpose**: Run only unit tests
- **Output**: 23 unit test results
- **Time**: ~2 seconds

### **Integration Tests Only**
```bash
npm run test:integration
```
- **Purpose**: Run only integration tests
- **Output**: 9 integration test results
- **Time**: ~3.8 seconds

### **Specific Test Files**
```bash
# File controller unit tests
npm run test:controller

# File flow integration tests
npm run test:flow
```
- **Purpose**: Run specific test files
- **Output**: Targeted test results
- **Use Case**: Focused testing and debugging

## 📦 Dependencies

### **Production Dependencies**
```json
{
  "@prisma/client": "^5.0.0",
  "express": "^4.18.0",
  "multer": "^1.4.5",
  "multer-s3": "^3.0.1",
  "@aws-sdk/client-s3": "^3.0.0",
  "@aws-sdk/s3-request-presigner": "^3.0.0",
  "dompurify": "^3.0.0",
  "jsdom": "^22.0.0"
}
```

### **Development Dependencies**
```json
{
  "jest": "^29.0.0",
  "supertest": "^6.0.0",
  "@babel/core": "^7.0.0",
  "@babel/preset-env": "^7.0.0",
  "babel-jest": "^29.0.0",
  "nodemon": "^3.0.0",
  "prisma": "^5.0.0"
}
```

## 🔧 Configuration

### **ES Modules Support**
```json
{
  "type": "module"
}
```
- **Purpose**: Enable ES modules throughout project
- **Impact**: All imports/exports use modern syntax

### **Test Environment**
- **Jest**: Configured for Node.js environment
- **Babel**: ES modules transformation
- **Timeout**: 30 seconds for integration tests
- **Coverage**: HTML and LCOV reports

## 📊 Script Results

### **Test Execution Times**
| Script | Tests | Time | Type |
|--------|-------|------|------|
| `npm test` | 32 | ~5.8s | All tests |
| `npm run test:unit` | 23 | ~2.0s | Unit only |
| `npm run test:integration` | 9 | ~3.8s | Integration only |
| `npm run test:controller` | 23 | ~2.0s | Controller unit |
| `npm run test:flow` | 9 | ~3.8s | Flow integration |

### **Coverage Results**
```
File      | % Stmts | % Branch | % Funcs | % Lines
----------|---------|----------|---------|--------
All files |   100   |   100    |   100   |   100
```

## 🎯 Development Workflow

### **Development Cycle**
1. **Write Code**: Implement features
2. **Run Tests**: `npm run test:watch`
3. **Check Coverage**: `npm run test:coverage`
4. **Fix Issues**: Address test failures
5. **Commit**: All tests passing

### **CI/CD Integration**
```bash
# Continuous Integration
npm test

# Coverage reporting
npm run test:coverage
```

## 🚨 Troubleshooting

### **Common Issues**
1. **ES Modules Error**: Ensure `"type": "module"` in package.json
2. **Babel Error**: Check `babel.config.js` configuration
3. **Timeout Error**: Increase timeout in `jest.config.js`
4. **Import Error**: Verify file paths and extensions

### **Debug Commands**
```bash
# Verbose output
npm test -- --verbose

# Specific test file
npm test -- tests/unit/fileController.test.js

# Watch specific file
npm run test:watch -- tests/unit/fileController.test.js
```

---
**Last Updated**: September 12, 2025  
**Scripts**: 7 test commands  
**Dependencies**: 8 production + 7 development  
**Coverage**: 100% of controller methods and API endpoints

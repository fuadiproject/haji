# ⚙️ Test Setup & Configuration

## 📋 Overview
**File**: `tests/setup.js`  
**Purpose**: Test environment configuration and setup  
**Type**: Test configuration file

## 🔧 Setup Configuration

### **Environment Variables**
```javascript
// Load test environment variables
dotenv.config({ path: '.env.test' });
dotenv.config({ path: '.env' });
```

### **Test Environment**
```javascript
// Set test environment
process.env.NODE_ENV = 'test';
```

### **Global Test Timeout**
```javascript
// Set global test timeout
jest.setTimeout(30000); // 30 seconds
```

### **Console Mocking**
```javascript
// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
```

## 📁 Configuration Files

### **Jest Configuration** (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000
};
```

### **Babel Configuration** (`babel.config.js`)
```javascript
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
};
```

## 🎯 Setup Features

### **Environment Loading**
- ✅ **Test Environment**: `.env.test` file loaded first
- ✅ **Default Environment**: `.env` file loaded as fallback
- ✅ **Environment Variables**: All required variables available

### **Test Configuration**
- ✅ **Node Environment**: Set to 'test' mode
- ✅ **Timeout**: 30 seconds for integration tests
- ✅ **Console Mocking**: Reduced noise in test output

### **Module Support**
- ✅ **ES Modules**: Babel transformation enabled
- ✅ **Import/Export**: Modern JavaScript syntax support
- ✅ **Async/Await**: Full async support

## 🚀 Usage

### **Automatic Setup**
- Setup runs automatically before all tests
- No manual configuration required
- Environment variables loaded automatically

### **Manual Setup**
```javascript
// Import setup in test files if needed
import '../setup.js';
```

## 🔍 Dependencies

### **Required Packages**
- `dotenv` - Environment variable loading
- `jest` - Test framework
- `@babel/core` - JavaScript transformation
- `@babel/preset-env` - Babel preset
- `babel-jest` - Jest transformer

### **Environment Files**
- `.env.test` - Test environment variables
- `.env` - Default environment variables

## 📊 Setup Results
- ✅ **Environment**: Test environment configured
- ✅ **Variables**: All environment variables loaded
- ✅ **Timeout**: 30-second timeout set
- ✅ **Console**: Mocked for clean output
- ✅ **Modules**: ES modules support enabled

---
**Last Updated**: September 12, 2025  
**Setup Type**: Automatic test configuration  
**Dependencies**: dotenv, jest, babel
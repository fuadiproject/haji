# ⚙️ Jest Configuration Documentation

## 📋 Overview
**File**: `jest.config.js`  
**Purpose**: Jest test runner configuration  
**Type**: Test framework configuration

## 🔧 Configuration Details

### **Test Environment**
```javascript
testEnvironment: 'node'
```
- **Purpose**: Set test environment to Node.js
- **Impact**: Tests run in Node.js environment (not browser)
- **Use Case**: Backend API testing

### **Module Transformation**
```javascript
transform: {
  '^.+\\.js$': 'babel-jest'
}
```
- **Purpose**: Transform JavaScript files using Babel
- **Impact**: ES modules converted to CommonJS for Jest
- **Use Case**: Modern JavaScript syntax support

### **Test File Matching**
```javascript
testMatch: ['**/tests/**/*.test.js']
```
- **Purpose**: Define test file patterns
- **Impact**: Only files matching pattern are executed
- **Pattern**: All `.test.js` files in `tests/` directory

### **Coverage Collection**
```javascript
collectCoverageFrom: [
  'src/**/*.js',
  '!src/**/*.test.js',
  '!src/**/*.spec.js'
]
```
- **Purpose**: Define files to include in coverage
- **Include**: All `.js` files in `src/` directory
- **Exclude**: Test files and spec files

### **Coverage Directory**
```javascript
coverageDirectory: 'coverage'
```
- **Purpose**: Set coverage report output directory
- **Location**: `coverage/` folder in project root
- **Content**: HTML and LCOV coverage reports

### **Coverage Reporters**
```javascript
coverageReporters: ['text', 'lcov', 'html']
```
- **Purpose**: Define coverage report formats
- **Formats**: 
  - `text`: Console output
  - `lcov`: LCOV format for CI/CD
  - `html`: HTML report for browsers

### **Setup Files**
```javascript
setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
```
- **Purpose**: Run setup file after test environment
- **File**: `tests/setup.js`
- **Content**: Environment variables, timeouts, console mocking

### **Test Timeout**
```javascript
testTimeout: 30000
```
- **Purpose**: Set global test timeout
- **Duration**: 30 seconds
- **Use Case**: Integration tests with real dependencies

## 🎯 Configuration Features

### **ES Modules Support**
- ✅ **Babel Transformation**: ES modules to CommonJS
- ✅ **Import/Export**: Modern JavaScript syntax
- ✅ **Async/Await**: Full async support

### **Test Discovery**
- ✅ **Pattern Matching**: Automatic test file discovery
- ✅ **Directory Structure**: Organized test structure
- ✅ **File Naming**: Consistent `.test.js` naming

### **Coverage Reporting**
- ✅ **Multiple Formats**: Text, LCOV, HTML
- ✅ **Selective Collection**: Source files only
- ✅ **Exclusion Rules**: Test files excluded

### **Environment Setup**
- ✅ **Node Environment**: Backend testing environment
- ✅ **Setup Files**: Automatic configuration
- ✅ **Timeout**: Appropriate for integration tests

## 📊 Configuration Results

### **Test Execution**
- **Environment**: Node.js
- **Transformation**: Babel (ES modules)
- **Discovery**: Automatic test file finding
- **Timeout**: 30 seconds

### **Coverage Collection**
- **Source Files**: All `.js` files in `src/`
- **Excluded Files**: Test and spec files
- **Output Directory**: `coverage/`
- **Report Formats**: Text, LCOV, HTML

## 🔍 Dependencies

### **Required Packages**
- `jest` - Test framework
- `@babel/core` - JavaScript transformation
- `@babel/preset-env` - Babel preset
- `babel-jest` - Jest transformer

### **Configuration Files**
- `jest.config.js` - Jest configuration
- `babel.config.js` - Babel configuration
- `tests/setup.js` - Test setup

## 🚀 Usage

### **Automatic Configuration**
- Configuration loaded automatically by Jest
- No manual setup required
- All tests use same configuration

### **Command Line Override**
```bash
# Override timeout
npm test -- --testTimeout=60000

# Override environment
npm test -- --testEnvironment=jsdom

# Override coverage
npm test -- --coverage=false
```

## 🚨 Troubleshooting

### **Common Issues**
1. **ES Modules Error**: Check Babel configuration
2. **Timeout Error**: Increase `testTimeout`
3. **Coverage Error**: Check `collectCoverageFrom` paths
4. **Setup Error**: Verify `setupFilesAfterEnv` path

### **Debug Commands**
```bash
# Verbose output
npm test -- --verbose

# Debug mode
npm test -- --detectOpenHandles

# Coverage debug
npm test -- --coverage --verbose
```

---
**Last Updated**: September 12, 2025  
**Configuration**: Jest test runner  
**Dependencies**: jest, babel-jest, @babel/core  
**Coverage**: 100% of source files

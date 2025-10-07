# Backend SuperApp - Express.js API

Aplikasi backend untuk sistem manajemen SuperApp.

## 🚀 Features

- **File Management** - Upload, download, dan manajemen file

## 📋 API Endpoints

### File Management
- `GET /api/master/petunjuk` - Get all petunjuk
- `POST /api/files` - Create file
- `GET /api/files/:id` - Get file by ID
- `PUT /api/files/:id` - Update file
- `DELETE /api/files/:id` - Delete file


## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- tests/integration/disposisiFlow.test.js
npm test -- tests/unit/disposisiController.test.js
```

## 📊 Test Coverage

- **Total Test Suites:** 7
- **Total Tests:** 175
- **All Tests Passing:** ✅

### Test Structure
```
tests/
├── integration/
│   └── fileFlow.test.js           # File management integration tests
├── unit/
│   └── fileController.test.js     # File controller unit tests
└── utils/
    └── masterDataHelper.js        # Helper for master data testing
```

## 🚀 Scripts

```bash
# Development
npm run dev          # Start development server
npm start           # Start production server

# Database
npm run seed:test   # Seed test users
npm run seed:ref    # Seed reference data
npm run cleanup:db  # Cleanup test data

# Testing
npm test            # Run all tests
```

## 📄 License

MIT

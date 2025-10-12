# Authentication API Documentation

This document describes the authentication API endpoints for the SuperApp backend.

## Base URL
```
http://localhost:3000/api/auth
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Login
**POST** `/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "role": "superadmin|admin",
      "created_at": "datetime",
      "updated_at": "datetime"
    },
    "token": "jwt-token"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Invalid credentials

---

### 2. Get Profile
**GET** `/profile`

Get current user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "string",
    "username": "string",
    "role": "superadmin|admin",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - User not found

---

### 3. Create User (Superadmin Only)
**POST** `/users`

Create a new user account.

**Headers:**
```
Authorization: Bearer <superadmin-token>
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "role": "superadmin|admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "string",
    "username": "string",
    "role": "superadmin|admin",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Superadmin access required
- `409` - Username already exists

---

### 4. Get All Users (Superadmin Only)
**GET** `/users`

Get paginated list of all users.

**Headers:**
```
Authorization: Bearer <superadmin-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by username
- `role` (optional): Filter by role (superadmin|admin)

**Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "string",
      "username": "string",
      "role": "superadmin|admin",
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Superadmin access required

---

### 5. Update User Role (Superadmin Only)
**PUT** `/users/:id/role`

Update user role.

**Headers:**
```
Authorization: Bearer <superadmin-token>
```

**Request Body:**
```json
{
  "role": "superadmin|admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "string",
    "username": "string",
    "role": "superadmin|admin",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `401` - Unauthorized
- `403` - Superadmin access required
- `404` - User not found

---

### 6. Delete User (Superadmin Only)
**DELETE** `/users/:id`

Delete a user account.

**Headers:**
```
Authorization: Bearer <superadmin-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete your own account
- `401` - Unauthorized
- `403` - Superadmin access required
- `404` - User not found

---

## Roles

### Superadmin
- Full access to all endpoints
- Can create, read, update, and delete users
- Can manage all system resources

### Admin
- Limited access to most endpoints
- Cannot manage users
- Can access most system resources

---

## JWT Token

The JWT token contains the following payload:
```json
{
  "id": "user-id",
  "username": "username",
  "role": "superadmin|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

- `iat`: Issued at timestamp
- `exp`: Expiration timestamp
- Token expires in 24 hours by default

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

---

## Default Credentials

After running the seed script, you can use these default credentials:

**Superadmin:**
- Username: `superadmin`
- Password: `superadmin123`

**Admin:**
- Username: `admin`
- Password: `admin123`

---

## Running the Seed Script

To create default users, run:
```bash
npm run seed:auth
```

Or manually:
```bash
node prisma/seed-auth.js
```

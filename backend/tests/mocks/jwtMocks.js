// Mock JWT tokens for integration testing
// These tokens contain test user data and are used across all integration tests
// All users have equal access level - no super admin

export const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2x4MTIzNDU2Nzg5MGFiY2RlZiIsIm5payI6IjEyMzQ1Njc4OTAxMjM0NTYiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDUxNTIwMCwiZXhwIjoxNjk0NjAxNjAwfQ.test_signature';

export const user1JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2x4MTIzNDU2Nzg5MGFiY2RlZiIsIm5payI6IjEyMzQ1Njc4OTAxMjM0NTYiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDUxNTIwMCwiZXhwIjoxNjk0NjAxNjAwfQ.user1_signature';

export const user2JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2x4OTg3NjU0MzIxMGZlZGNiYSIsIm5payI6Ijk4NzY1NDMyMTA5ODc2NTQiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDUxNTIwMCwiZXhwIjoxNjk0NjAxNjAwfQ.user2_signature';

export const user3JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiY2x4NTU1NTU1NTU1NTU1NTU1NSIsIm5payI6IjU1NTU1NTU1NTU1NTU1NTUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDUxNTIwMCwiZXhwIjoxNjk0NjAxNjAwfQ.user3_signature';

// JWT payload information for reference:
// mockJWT & user1JWT: { user_id: "clx1234567890abcdef", nik: "1234567890123456", role: "user" }
// user2JWT: { user_id: "clx9876543210fedcba", nik: "9876543210987654", role: "user" }
// user3JWT: { user_id: "clx5555555555555555", nik: "5555555555555555", role: "user" }

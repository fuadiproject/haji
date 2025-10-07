# 📚 API Documentation - Surat Masuk & Disposisi

## 🔐 Authentication & Authorization

### **JWT Structure**
```json
{
  "user_id": "clx1234567890abcdef",
  "nik": "1234567890123456",
  "role": "user",  // "user" | "admin"
  "iat": 1694515200,
  "exp": 1694601600
}
```

### **Authorization Rules**

#### **Surat Masuk CRUD:**
- **CREATE**: ✅ Semua user bisa create
- **READ**: ✅ Hanya bisa lihat surat masuk yang:
  - Mereka yang buat, ATAU
  - Mereka masuk dalam `nik_penerima` di disposisi
- **UPDATE**: ✅ Hanya bisa update surat masuk yang mereka buat
- **DELETE**: ✅ Hanya bisa delete surat masuk yang mereka buat


## 📄 Surat Masuk API

### **POST /api/surat-masuk** - Create Surat Masuk

#### **Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### **Payload:**
```json
{
  "file_id": "clx9876543210fedcba",     // Optional: ID file yang sudah diupload
  "nomor_surat": "SM/001/2025/IX"      // Required: Nomor surat masuk
}
```

#### **Response:**
```json
{
  "success": true,
  "message": "Surat masuk berhasil dibuat",
  "data": {
    "id": "clx1234567890abcdef",
    "file_id": "clx9876543210fedcba",
    "nomor_surat": "SM/001/2025/IX",
    "file": {
      "id": "clx9876543210fedcba",
      "filename": "surat_masuk_001.pdf",
      "filepath": "https://minio.example.com/bucket/surat_masuk_001.pdf",
      "key": "surat_masuk_001.pdf",
      "mimetype": "application/pdf",
      "size": 1024000
    },
    "created_at": "2025-09-12T10:30:00.000Z",
    "updated_at": "2025-09-12T10:30:00.000Z",
    "version": 1
  }
}
```


## 🔄 Complete API Structure

```
/api/surat-masuk
├── GET    /                           # Get all surat masuk
├── POST   /                           # Create surat masuk
├── GET    /stats                      # Get surat masuk statistics
├── GET    /:id                        # Get surat masuk by ID
├── PUT    /:id                        # Update surat masuk
├── DELETE /:id                        # Delete surat masuk
└── /:id/disposisi
    ├── GET    /                       # Get all disposisi untuk surat masuk
    ├── POST   /                       # Create disposisi untuk surat masuk
    ├── GET    /:disposisi_id          # Get disposisi by ID
    ├── PUT    /:disposisi_id          # Update disposisi
    └── DELETE /:disposisi_id          # Delete disposisi

/api/disposisi (global - untuk admin/reporting)
├── GET    /                           # Get all disposisi (global)
├── GET    /stats                      # Get disposisi statistics
├── GET    /:id                        # Get disposisi by ID (global)
├── PUT    /:id                        # Update disposisi (global)
└── DELETE /:id                        # Delete disposisi (global)
```

## 🚨 Error Responses

### **401 Unauthorized**
```json
{
  "success": false,
  "error": "Authorization header required"
}
```

### **403 Forbidden**
```json
{
  "success": false,
  "error": "Access denied to this surat masuk"
}
```

### **404 Not Found**
```json
{
  "success": false,
  "error": "Surat masuk tidak ditemukan"
}
```

### **400 Bad Request**
```json
{
  "success": false,
  "error": "Nomor surat wajib diisi"
}
```

## 📝 Notes

1. **File Upload**: File harus diupload terpisah menggunakan `/api/files/upload` sebelum membuat surat masuk
2. **Authorization**: Semua endpoint memerlukan JWT token di header Authorization
3. **Access Control**: User hanya bisa akses surat masuk/disposisi yang mereka buat atau yang mereka terima
4. **Access Control**: Semua user memiliki level akses yang sama berdasarkan ownership
5. **Hard Delete**: Delete operation menggunakan hard delete (data dihapus permanen)
6. **Pagination**: Semua list endpoint mendukung pagination
7. **Search & Filter**: Semua list endpoint mendukung search dan filter
8. **Sanitization**: Semua input disanitasi untuk mencegah XSS

---
**Last Updated**: September 12, 2025  
**Version**: 1.0.0  
**Authentication**: JWT (decode only, validation by API Manager)

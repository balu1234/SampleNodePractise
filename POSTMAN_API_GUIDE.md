# API Testing Guide - Postman

## Base URL
```
http://localhost:3000
```

---

## 1. HEALTH CHECK
### Get Server Status
```
GET http://localhost:3000/api/health
```
**Headers:** None
**Response:**
```json
{
  "status": "Backend API is running"
}
```

---

## 2. AUTHENTICATION ROUTES

### 2.1 Register New User
```
POST http://localhost:3000/api/auth/register
```
**Content-Type:** `application/json`

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword@123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "emailStatus": "sent",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### 2.2 Login User
```
POST http://localhost:3000/api/auth/login
```
**Content-Type:** `application/json`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword@123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

## 3. PRODUCT ROUTES
**⚠️ All product routes require authentication**

**Headers for all product requests:**
```
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json
```

### 3.1 Get All Products
```
GET http://localhost:3000/api/product
```
**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Laptop",
    "description": "High performance laptop",
    "image": "https://example.com/laptop.jpg",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "category": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Electronics",
      "description": "Electronic devices"
    },
    "tags": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "name": "High-Tech",
        "color": "#FF0000"
      }
    ],
    "relatedProducts": [],
    "createdAt": "2026-02-05T10:30:00.000Z",
    "updatedAt": "2026-02-05T10:30:00.000Z"
  }
]
```

---

### 3.2 Get Product by ID
```
GET http://localhost:3000/api/product/507f1f77bcf86cd799439011
```
**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Laptop",
  "description": "High performance laptop",
  "image": "https://example.com/laptop.jpg",
  "user": {...},
  "category": {...},
  "tags": [...],
  "relatedProducts": []
}
```

---

### 3.3 Create New Product
```
POST http://localhost:3000/api/product
```
**Body:**
```json
{
  "title": "Gaming Laptop",
  "description": "High performance laptop for gaming",
  "image": "https://example.com/gaming-laptop.jpg",
  "category": "507f1f77bcf86cd799439013",
  "tags": ["507f1f77bcf86cd799439014"],
  "relatedProducts": []
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "title": "Gaming Laptop",
  "description": "High performance laptop for gaming",
  "image": "https://example.com/gaming-laptop.jpg",
  "user": {...},
  "category": {...},
  "tags": [...],
  "relatedProducts": []
}
```

---

### 3.4 Update Product (Full Update)
```
PUT http://localhost:3000/api/product/507f1f77bcf86cd799439011
```
**Body:**
```json
{
  "title": "Updated Laptop",
  "description": "Updated description",
  "image": "https://example.com/updated-laptop.jpg",
  "category": "507f1f77bcf86cd799439013",
  "tags": ["507f1f77bcf86cd799439014"],
  "relatedProducts": []
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated Laptop",
  "description": "Updated description",
  ...
}
```

---

### 3.5 Partial Update Product
```
PATCH http://localhost:3000/api/product/507f1f77bcf86cd799439011
```
**Body (only update what you need):**
```json
{
  "title": "Partially Updated Laptop"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Partially Updated Laptop",
  ...
}
```

---

### 3.6 Delete Product
```
DELETE http://localhost:3000/api/product/507f1f77bcf86cd799439011
```
**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## 4. CATEGORY ROUTES
**⚠️ All category routes require authentication**

**Headers for all category requests:**
```
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json
```

### 4.1 Get All Categories
```
GET http://localhost:3000/api/categories
```
**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Electronics",
    "description": "Electronic devices and accessories"
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Books",
    "description": "Physical and digital books"
  }
]
```

---

### 4.2 Get Category by ID
```
GET http://localhost:3000/api/categories/507f1f77bcf86cd799439013
```
**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

---

### 4.3 Create Category
```
POST http://localhost:3000/api/categories
```
**Body:**
```json
{
  "name": "Furniture",
  "description": "Home and office furniture"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "name": "Furniture",
  "description": "Home and office furniture"
}
```

---

### 4.4 Update Category
```
PUT http://localhost:3000/api/categories/507f1f77bcf86cd799439013
```
**Body:**
```json
{
  "name": "Electronics & Gadgets",
  "description": "All electronic devices, gadgets, and accessories"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Electronics & Gadgets",
  "description": "All electronic devices, gadgets, and accessories"
}
```

---

### 4.5 Delete Category
```
DELETE http://localhost:3000/api/categories/507f1f77bcf86cd799439013
```
**Response (200 OK):**
```json
{
  "message": "Category deleted successfully"
}
```

---

## 5. TAG ROUTES
**⚠️ All tag routes require authentication**

**Headers for all tag requests:**
```
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json
```

### 5.1 Get All Tags
```
GET http://localhost:3000/api/tags
```
**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "High-Tech",
    "color": "#FF0000"
  },
  {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Budget-Friendly",
    "color": "#00FF00"
  }
]
```

---

### 5.2 Get Tag by ID
```
GET http://localhost:3000/api/tags/507f1f77bcf86cd799439014
```
**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "High-Tech",
  "color": "#FF0000"
}
```

---

### 5.3 Create Tag
```
POST http://localhost:3000/api/tags
```
**Body:**
```json
{
  "name": "Premium",
  "color": "#FFD700"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439022",
  "name": "Premium",
  "color": "#FFD700"
}
```

---

### 5.4 Update Tag
```
PUT http://localhost:3000/api/tags/507f1f77bcf86cd799439014
```
**Body:**
```json
{
  "name": "Advanced Tech",
  "color": "#FF6600"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Advanced Tech",
  "color": "#FF6600"
}
```

---

### 5.5 Delete Tag
```
DELETE http://localhost:3000/api/tags/507f1f77bcf86cd799439014
```
**Response (200 OK):**
```json
{
  "message": "Tag deleted successfully"
}
```

---

## 6. ADMIN ROUTES
**⚠️ All admin routes require authentication + admin role**

**Headers for all admin requests:**
```
Authorization: Bearer <ADMIN_TOKEN_HERE>
Content-Type: application/json
```

### 6.1 Get All Users
```
GET http://localhost:3000/api/admin/users
```
**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

---

### 6.2 Get User by ID
```
GET http://localhost:3000/api/admin/users/507f1f77bcf86cd799439011
```
**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "user"
}
```

---

### 6.3 Create User (Admin)
```
POST http://localhost:3000/api/admin/users
```
**Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "SecurePassword@123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439023",
  "username": "newuser",
  "email": "newuser@example.com",
  "role": "user"
}
```

---

### 6.4 Update User (Admin)
```
PUT http://localhost:3000/api/admin/users/507f1f77bcf86cd799439011
```
**Body:**
```json
{
  "username": "updatedjohndoe",
  "email": "newemail@example.com",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "updatedjohndoe",
  "email": "newemail@example.com",
  "role": "admin"
}
```

---

### 6.5 Delete User (Admin)
```
DELETE http://localhost:3000/api/admin/users/507f1f77bcf86cd799439011
```
**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 6.6 Send Email (Admin)
```
POST http://localhost:3000/api/admin/send-email
```
**Content-Type:** `multipart/form-data`

**Form Data:**
- `to` (text): recipient@example.com
- `subject` (text): Welcome to our platform
- `message` (text): Thanks for joining us!
- `attachment` (file): Optional - PDF, DOC, DOCX, JPG, PNG, or GIF (max 100MB)

**Response (200 OK):**
```json
{
  "message": "Email sent successfully"
}
```

---

## 7. SMS ROUTES
**⚠️ All SMS routes require authentication**

**Headers for all SMS requests:**
```
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json
```

### 7.1 Send Verification Code
```
POST http://localhost:3000/api/sms/send-verification
```
**Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "message": "Verification code sent successfully"
}
```

---

### 7.2 Verify Phone Number
```
POST http://localhost:3000/api/sms/verify
```
**Body:**
```json
{
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "message": "Phone number verified successfully"
}
```

---

### 7.3 Send Custom Message (Admin)
```
POST http://localhost:3000/api/sms/send-custom
```
**Body:**
```json
{
  "phoneNumber": "+1234567890",
  "message": "Hello! This is a custom message."
}
```

**Response (200 OK):**
```json
{
  "message": "SMS sent successfully"
}
```

---

## Testing Workflow

### Step 1: Register and Get Token
1. POST to `/api/auth/register` with your credentials
2. Save the returned `token`

### Step 2: Test Protected Routes
1. Add `Authorization: Bearer <YOUR_TOKEN>` header to all requests
2. Test products, categories, tags

### Step 3: Test Admin Features (if admin user)
1. Use admin token in Authorization header
2. Test `/api/admin/*` endpoints

---

## Common HTTP Status Codes
- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input or validation error
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User lacks required permissions (not admin)
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error

---

## Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

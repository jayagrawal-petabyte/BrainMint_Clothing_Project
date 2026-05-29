# BrainMint Clothing Project — Authentication Module

## Person 1 — Authentication & User Management

This module handles:

* User Registration
* User Login
* JWT Authentication
* Role Handling (Admin/User)
* Password Hashing
* Forgot Password
* Reset Password
* Protected Routes

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nodemailer

---

# Installation

## Clone Repository

```bash
git clone <repository_url>
```

---

## Navigate to Project

```bash
cd backend/person1-auth
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

# Run Server

```bash
npm run dev
```

Server runs on:

```txt
http://localhost:5000
```

---

# API Endpoints

## Register User

POST `/api/auth/register`

---

## Login User

POST `/api/auth/login`

---

## Get Profile

GET `/api/auth/profile`

Requires JWT Token

---

## Update Profile

PUT `/api/auth/profile`

Requires JWT Token

---

## Forgot Password

POST `/api/auth/forgot-password`

---

## Reset Password

POST `/api/auth/reset-password`

---

# JWT Token Format

```txt
Authorization: Bearer <token>
```

---

# Role Structure

```js
role: "admin" | "user"
```

---

# Response Format

## Success Response

```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

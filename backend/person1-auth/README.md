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

# Test Admin Account

Use this script on the deployed database to create or update a temporary admin account for frontend testing.

```env
MONGO_URI=your_deployed_mongodb_connection_string
ADMIN_NAME=Test Admin
ADMIN_EMAIL=admin.testing@example.com
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=change-this-password
```

```bash
npm run seed:admin
```

The script creates the user if it does not exist. If a user already exists with the same email or phone number, it updates that user to `role: "admin"` and resets the password.

---

# Cleanup Old Unverified Users

Dry run first:

```bash
npm run cleanup:unverified
```

Delete matched users after reviewing the dry-run output:

```bash
npm run cleanup:unverified -- --confirm
```

Optional cutoff age, default is 7 days:

```bash
npm run cleanup:unverified -- --days=14 --confirm
```

The cleanup excludes admins and only targets users explicitly marked unverified by `isEmailVerified`, `isVerified`, `emailVerified`, `phoneVerified`, or `verified` fields.

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

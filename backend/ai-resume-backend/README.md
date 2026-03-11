# AI Resume Backend

An intelligent resume analysis and optimization backend application that uses AI to analyze resumes against job descriptions, generate ATS-optimized scores, and provide resume management features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Frontend Integration Guide](#frontend-integration-guide)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## 📖 Project Overview

**AI Resume Backend** is a comprehensive resume management and analysis platform that helps users:
- Create and manage multiple resumes
- Analyze resumes against job descriptions
- Get ATS (Applicant Tracking System) compatibility scores
- Generate PDF versions of resumes
- Manage subscriptions and premium features
- Access admin dashboard for user and template management

This is a **Node.js/Express backend** designed to work with a React/Vue/Angular frontend application.

---

## ✨ Features

### Core Features
- **User Authentication**: Register, login with JWT-based token authentication
- **Resume Management**: Create, read, update, and delete resumes
- **ATS Analysis**: Analyze resume compatibility with job descriptions
- **Keyword Matching**: Extract and match keywords from job descriptions
- **PDF Generation**: Generate downloadable PDF versions of resumes
- **Job Matching**: Check resume match percentage against job postings
- **Subscription System**: Support for free and premium subscription plans
- **Admin Dashboard**: User management and resume template management
- **Secure Authentication**: Password hashing with bcryptjs, JWT tokens with 7-day expiration

---

## 🛠️ Technology Stack

### Backend Technologies
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (jsonwebtoken v9.0.3), bcryptjs v3.0.3
- **PDF Generation**: PDFKit v0.17.2
- **Natural Language Processing**: natural v8.1.0
- **CORS**: cors v2.8.6
- **Environment Management**: dotenv v17.3.1
- **Development**: Nodemon v3.1.14 (for hot reload)

### Package Manager
- npm

---

## 📁 Project Structure

```
ai-resume-backend/
│
├── src/
│   ├── server.js                    # Main application entry point
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection configuration
│   │
│   ├── controllers/                 # Business logic handlers
│   │   ├── authController.js       # Registration & login
│   │   ├── resumeController.js     # Resume CRUD operations
│   │   ├── atsController.js        # ATS analysis operations
│   │   ├── pdfController.js        # PDF generation
│   │   ├── subscriptionController.js # Subscription management
│   │   └── adminController.js      # Admin operations
│   │
│   ├── middlewares/                 # Express middlewares
│   │   ├── authMiddleware.js       # JWT token verification
│   │   └── adminMiddleware.js      # Admin role verification
│   │
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js                 # User schema
│   │   ├── Resume.js               # Resume schema
│   │   ├── Subscription.js         # Subscription schema
│   │   └── JobAnalysis.js          # Job analysis schema
│   │
│   ├── routes/                      # Route definitions
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── resumeRoutes.js         # Resume endpoints
│   │   ├── atsRoutes.js            # ATS analysis endpoints
│   │   ├── pdfRoutes.js            # PDF generation endpoints
│   │   ├── subscriptionRoutes.js   # Subscription endpoints
│   │   └── adminRoutes.js          # Admin endpoints
│   │
│   ├── services/                    # Business logic services
│   │   ├── aiService.js            # AI text improvement
│   │   ├── atsService.js           # ATS analysis logic
│   │   ├── keywordService.js       # Keyword extraction
│   │   └── pdfservice.js           # PDF generation service
│   │
│   ├── cron/
│   │   └── cleanupJob.js           # Scheduled cleanup tasks
│   │
│   └── utils/
│       └── logger.js                # Logging utility
│
├── .env                             # Environment variables (see below)
├── package.json                     # Project dependencies
├── package-lock.json                # Dependency lock file
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for cloning)

### Step 1: Clone & Navigate to Project
```bash
cd ai-resume-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- express (v5.2.1)
- mongoose (v9.2.1)
- jsonwebtoken (v9.0.3)
- bcryptjs (v3.0.3)
- pdfkit (v0.17.2)
- natural (v8.1.0)
- cors (v2.8.6)
- dotenv (v17.3.1)
- nodemon (v3.1.14)

### Step 3: Create MongoDB Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user and get the connection URI
4. Copy the URI (format: `mongodb+srv://username:password@cluster.mongodb.net/databasename`)

### Step 4: Create `.env` File
Create a `.env` file in the project root with the following variables:

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://resumeadmin:admin%4012345@cluster0.bmlpjdv.mongodb.net/ai_resume

# Server Configuration
PORT=5000

# JWT Configuration (Secret key for token signing)
JWT_SECRET=supersecret

# Add additional variables as needed
# Example for future integrations:
# STRIPE_API_KEY=your_stripe_key
# EMAIL_SERVICE_API_KEY=your_email_service_key
```

### Important Notes:
- **MONGO_URI**: Replace with your actual MongoDB Atlas connection string
- **PORT**: Default is 5000 (change if you need a different port)
- **JWT_SECRET**: Use a strong, random string in production
- **⚠️ SECURITY**: Never commit `.env` file to git; add it to `.gitignore`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

### **1. AUTHENTICATION ROUTES** (`/api`)

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "message": "Registered successfully"
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "subscriptionStatus": "free",
    "subscriptionPlan": "free",
    "createdAt": "2024-03-01T12:00:00.000Z"
  }
}
```

---

### **2. RESUME ROUTES** (`/api/resume`)

#### Create Resume
```http
POST /api/resume
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Software Engineer Resume",
  "templateId": "basic",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY"
  },
  "summary": "Experienced software engineer with 5+ years in full-stack development",
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "duration": "2020-Present",
      "description": "Led development of microservices"
    }
  ],
  "education": [
    {
      "school": "MIT",
      "degree": "BS Computer Science",
      "year": "2018"
    }
  ],
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "projects": [
    {
      "name": "AI Resume Builder",
      "description": "Intelligent resume analysis tool",
      "link": "github.com/project"
    }
  ],
  "certifications": [
    {
      "name": "AWS Solutions Architect",
      "issuer": "Amazon"
    }
  ]
}
```
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "title": "Software Engineer Resume",
  "templateId": "basic",
  "personalInfo": {...},
  "summary": "...",
  "experience": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...],
  "atsScore": 0,
  "createdAt": "2024-03-01T12:00:00.000Z"
}
```

#### Get Resume
```http
GET /api/resume/:resumeId
Authorization: Bearer <TOKEN>
```
**Response (200):** Returns full resume object

#### Update Resume
```http
PUT /api/resume/:resumeId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Updated Resume Title",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB", "PostgreSQL"]
}
```
**Response (200):** Returns updated resume object

#### Delete Resume
```http
DELETE /api/resume/:resumeId
Authorization: Bearer <TOKEN>
```
**Response (200):**
```json
{
  "message": "Deleted"
}
```

---

### **3. ATS ANALYSIS ROUTES** (`/api`)

#### Analyze Resume vs Job Description
```http
POST /api/analyze
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "resumeId": "507f1f77bcf86cd799439012",
  "jobDescription": "Looking for senior developer with 5+ years experience in JavaScript, React, Node.js, MongoDB. Must have AWS experience and microservices architecture knowledge."
}
```
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "resumeId": "507f1f77bcf86cd799439012",
  "jobDescription": "...",
  "matchedKeywords": ["javascript", "react", "nodejs", "mongodb", "microservices"],
  "missingKeywords": ["aws", "kubernetes", "docker"],
  "score": 85
}
```

#### Get Job Match Score
```http
POST /api/job-match
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "resumeId": "507f1f77bcf86cd799439012",
  "jobDescription": "..."
}
```
**Response (200):** Same as analyze endpoint

---

### **4. PDF GENERATION ROUTES** (`/api`)

#### Generate Resume PDF
```http
POST /api/generate-pdf
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "resumeId": "507f1f77bcf86cd799439012"
}
```
**Response (200):** PDF file download (Content-Type: application/pdf)

---

### **5. SUBSCRIPTION ROUTES** (`/api`)

#### Subscribe to Plan
```http
POST /api/subscribe
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "plan": "pro"
}
```
**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "plan": "pro",
  "paymentId": "dummy-payment",
  "startDate": "2024-03-01T12:00:00.000Z",
  "expiryDate": "2024-03-31T12:00:00.000Z"
}
```

#### Get Subscription Status
```http
GET /api/subscription
Authorization: Bearer <TOKEN>
```
**Response (200):** Returns subscription object (or null if no active subscription)

---

### **6. ADMIN ROUTES** (`/api`)

#### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <ADMIN_TOKEN>
```
**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "subscriptionStatus": "free",
    "subscriptionPlan": "free",
    "createdAt": "2024-03-01T12:00:00.000Z"
  },
  {...}
]
```

#### Get Templates (Admin Only)
```http
GET /api/admin/templates
Authorization: Bearer <ADMIN_TOKEN>
```
**Response (200):**
```json
[
  {
    "id": "basic",
    "name": "Basic Template"
  },
  {
    "id": "pro",
    "name": "Pro Template"
  }
]
```

---

## 💾 Database Models

### **User Model**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (default: "user"),
  subscriptionStatus: String (default: "free"),
  subscriptionPlan: String (default: "free"),
  createdAt: Date (default: current date)
}
```

### **Resume Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  title: String,
  templateId: String,
  personalInfo: Object,
  summary: String,
  experience: Array [
    {
      company: String,
      position: String,
      duration: String,
      description: String
    }
  ],
  education: Array [
    {
      school: String,
      degree: String,
      year: String
    }
  ],
  skills: Array [String],
  projects: Array [
    {
      name: String,
      description: String,
      link: String
    }
  ],
  certifications: Array [
    {
      name: String,
      issuer: String
    }
  ],
  atsScore: Number,
  createdAt: Date (default: current date)
}
```

### **Subscription Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  plan: String,
  paymentId: String,
  startDate: Date,
  expiryDate: Date
}
```

### **JobAnalysis Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  resumeId: ObjectId (references Resume),
  jobDescription: String,
  matchedKeywords: Array [String],
  missingKeywords: Array [String],
  score: Number (0-100)
}
```

---

## 🔐 Authentication

### JWT Authentication Flow

1. **Register**: User creates account → Password is hashed with bcryptjs
2. **Login**: User provides email/password → System verifies → JWT token is generated
3. **Token Format**: 
   ```
   Header: Bearer <JWT_TOKEN>
   Payload: { id: userId }
   Expiration: 7 days
   ```
4. **Protected Routes**: Middleware verifies JWT token on each protected request
5. **Token Verification**: `authMiddleware.js` extracts and verifies token

### Security Features
- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token with 7-day expiration
- ✅ Role-based access control (user/admin)
- ✅ CORS enabled for frontend communication

---

## 🔗 Frontend Integration Guide

### For Your Frontend Team

#### 1. **API Base URL Configuration**
Configure your frontend to use:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### 2. **CORS Configuration**
The backend is configured with CORS enabled. Your frontend can be on any origin.

#### 3. **Authentication Flow**

**Step 1: Registration**
```javascript
async function register(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
}
```

**Step 2: Login**
```javascript
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}
```

**Step 3: Making Protected Requests**
```javascript
async function getResume(resumeId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

#### 4. **Common Integration Points**

| Feature | Endpoint | Method | Auth Required |
|---------|----------|--------|----------------|
| Register | `/register` | POST | No |
| Login | `/login` | POST | No |
| Create Resume | `/resume` | POST | Yes |
| Get Resume | `/resume/:id` | GET | Yes |
| Update Resume | `/resume/:id` | PUT | Yes |
| Delete Resume | `/resume/:id` | DELETE | Yes |
| Analyze ATS | `/analyze` | POST | Yes |
| Job Match | `/job-match` | POST | Yes |
| Generate PDF | `/generate-pdf` | POST | Yes |
| Subscribe | `/subscribe` | POST | Yes |
| Get Subscription | `/subscription` | GET | Yes |
| Admin Users | `/admin/users` | GET | Yes (Admin) |
| Admin Templates | `/admin/templates` | GET | Yes (Admin) |

#### 5. **Error Handling Examples**

```javascript
async function apiCall(endpoint, method, body = null) {
  try {
    const token = localStorage.getItem('token');
    const config = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (body) {
      config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (response.status === 403) {
      // Unauthorized (admin only)
      throw new Error('Admin access required');
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'API Error');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

#### 6. **Required Frontend Components**
Your frontend should include:
- ✅ Authentication pages (Register, Login)
- ✅ Resume builder/editor
- ✅ Resume list/management
- ✅ ATS analysis display
- ✅ PDF download functionality
- ✅ Subscription management
- ✅ Admin dashboard (for admin users)

---

## ▶️ Running the Application

### Development Mode (with Hot Reload)
```bash
npm run dev
```
The server will start on `http://localhost:5000` and automatically reload on file changes.

### Production Mode
```bash
node src/server.js
```

### Verify Server is Running
Open in browser or terminal:
```bash
curl http://localhost:5000/api/register
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify MongoDB Atlas connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure MONGO_URI in .env is properly formatted

#### 2. **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Change PORT in .env to 5001
PORT=5001
```
Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

#### 3. **CORS Error in Frontend**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Backend already has CORS enabled
- Verify frontend is using correct API URL
- Check that Authorization header is properly formatted

#### 4. **JWT Token Invalid**
```
Invalid token or No token provided
```
**Solution:**
- Ensure token is stored correctly after login
- Send token in header: `Authorization: Bearer <TOKEN>`
- Check if token has expired (7-day expiration)
- Re-login to get a new token

#### 5. **Resume Not Found**
```
Resume not found error
```
**Solution:**
- Verify resumeId matches database ID
- Ensure user owns the resume (belongs to their userId)
- Check that resume wasn't deleted

#### 6. **Admin Middleware Error**
```
Admin only error
```
**Solution:**
- Only admin users can access admin routes
- Check user role in database
- Contact database administrator to update user role to "admin"

### Debug Mode

Enable detailed logs:
```bash
# Check server logs
npm run dev
```

### Database Check

To manually check your database:
1. Go to MongoDB Atlas Dashboard
2. Click "Database" → "Browse Collections"
3. Verify data in `ai_resume` database

---

## 📝 Notes

- Backend runs on port **5000**
- JWT tokens expire after **7 days**
- Passwords are hashed with **bcryptjs**
- MongoDB is required for data persistence
- CORS is enabled for all origins
- Admin routes require admin role in database

---

## 🤝 Frontend Developer Checklist

Before integrating frontend with this backend:

- [ ] Backend server is running (`npm run dev`)
- [ ] MongoDB connection is active
- [ ] `.env` file is properly configured
- [ ] Frontend API_BASE_URL is set to `http://localhost:5000/api`
- [ ] CORS headers are understood
- [ ] Token storage strategy is decided (localStorage/sessionStorage/cookies)
- [ ] Login flow is implemented
- [ ] Protected routes are checking for token
- [ ] Error handling for 401 (unauthorized) is implemented
- [ ] Error handling for 403 (forbidden/admin) is implemented
- [ ] Resume creation form matches Resume schema
- [ ] ATS analysis display shows score, matched, and missing keywords
- [ ] PDF download is tested
- [ ] Subscription management is implemented

---

## 📞 Support & Next Steps

### For Backend Issues:
- Check `.env` configuration
- Review MongoDB connection
- Check server logs in terminal
- Verify API endpoints using Postman/curl

### For Frontend Integration:
- Use Postman to test all endpoints first
- Follow the Frontend Integration Guide above
- Implement error handling for all API calls
- Store JWT token securely

### Database Credentials
- MongoDB Atlas connection string is in `.env`
- Username: `resumeadmin`
- Database: `ai_resume`

---

## 📄 License

ISC License

---

**Version**: 1.0.0  
**Last Updated**: March 1, 2026  
**Author**: AI Resume Team


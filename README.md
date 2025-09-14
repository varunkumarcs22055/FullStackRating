# 🏪 Full-Stack Authentication & Store Rating System

A comprehensive full-stack application featuring user authentication, individual store ownership, and rating management system built with Node.js/Express backend and React frontend.

![Full-Stack Application](https://img.shields.io/badge/Full--Stack-Application-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![React](https://img.shields.io/badge/React-Frontend-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

## 🌟 Features

### 🔐 Authentication System
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin, Store Owners, Users)
- **Password Hashing** with bcrypt security
- **Individual Store Ownership** - Each store has its dedicated owner

### 🏬 Store Management
- **13 Individual Store Owners** with unique credentials
- **Dedicated Store Dashboards** for each owner
- **Store Information Management** (name, email, address)
- **Individual Store Isolation** - owners see only their store

### ⭐ Rating System
- **Store Rating & Reviews** functionality
- **Average Rating Calculation** display
- **Customer Feedback Management**
- **Rating History** for store owners

### 🎨 User Interface
- **Comprehensive Login Interface** showing all users
- **Quick-Login Buttons** for easy testing
- **Role-specific Dashboards** (Admin, Store Owner, User)
- **Responsive Design** for all devices

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **CSS3** - Styling
- **Fetch API** - HTTP requests
- **Local Storage** - Token management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/varunkumarcs22055/FullStackRating.git
cd FullStackRating
```

### 2. PostgreSQL Database Setup

#### Option A: Install PostgreSQL Locally

1. **Download and Install PostgreSQL:**
   - Visit [PostgreSQL Downloads](https://www.postgresql.org/download/)
   - Install for your operating system
   - Remember the password you set for the `postgres` user

2. **Create Database:**
   ```sql
   -- Connect to PostgreSQL (using pgAdmin or command line)
   psql -U postgres
   
   -- Create database
   CREATE DATABASE fullstack_auth;
   
   -- Exit PostgreSQL
   \q
   ```

#### Option B: Use PostgreSQL with Docker

```bash
# Pull and run PostgreSQL container
docker run --name postgres-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=fullstack_auth -p 5432:5432 -d postgres:13

# Connect to container
docker exec -it postgres-db psql -U postgres -d fullstack_auth
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
# Copy and paste this into .env file:
```

Create `backend/.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fullstack_auth
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 5. Database Schema Setup

The application will automatically create tables when you first run it. The database includes:

- **users** table - Stores user authentication and profile data
- **stores** table - Stores store information and ownership
- **ratings** table - Stores customer ratings and reviews

**Pre-configured Users:**
- **1 Admin:** `admin@demo.com`
- **13 Store Owners:** `owner.tech@techworld.com`, `owner.fashion@fashioncentral.com`, etc.
- **3 Regular Users:** `test@example.com`, `test@test.com`, `varun@kkk.com`
- **All Passwords:** `Password123!`

## 🏃‍♂️ Running the Application

### Option 1: Using Batch Files (Windows)

```bash
# Start backend (from project root)
start-backend.bat

# Start frontend (from project root)  
start-frontend.bat
```

### Option 2: Manual Commands

#### Terminal 1 - Backend Server:
```bash
cd backend
npm start
```

#### Terminal 2 - Frontend Server:
```bash
cd frontend
npm start
```

#### For Node.js compatibility issues:
```bash
cd frontend
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## 👤 Login Credentials

### Admin Account
- **Email:** `admin@demo.com`
- **Password:** `Password123!`
- **Role:** Full system access

### Store Owner Accounts (13 Individual Owners)
- **Tech World Electronics:** `owner.tech@techworld.com`
- **Fashion Central:** `owner.fashion@fashioncentral.com`
- **Book Haven:** `owner.books@bookhaven.com`
- **Food Paradise:** `owner.food@foodparadise.com`
- **Sports Zone:** `owner.sports@sportszone.com`
- **Home & Garden:** `owner.home@homeandgarden.com`
- **Beauty Corner:** `owner.beauty@beautycorner.com`
- **Toy Land:** `owner.toys@toyland.com`
- **Music Store:** `owner.music@musicstore.com`
- **Pet Paradise:** `owner.pets@petparadise.com`
- **Coffee Shop:** `owner.coffee@coffeeshop.com`
- **Fitness Center:** `owner.fitness@fitnesscenter.com`
- **Electronics Plus:** `owner.electronics@electronicsplus.com`
- **All Passwords:** `Password123!`

### Regular User Accounts
- **User 1:** `test@example.com` / `Password123!`
- **User 2:** `test@test.com` / `Password123!`
- **User 3:** `varun@kkk.com` / `Password123!`

## 📁 Project Structure

```
FullStackRating/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 config/          # Database configuration
│   │   ├── 📁 controllers/     # Business logic
│   │   ├── 📁 middleware/      # Authentication middleware
│   │   ├── 📁 models/          # Database models
│   │   ├── 📁 routes/          # API routes
│   │   ├── 📁 utils/           # Utility functions
│   │   └── 📄 app.js           # Main application file
│   ├── 📄 package.json
│   └── 📄 .env                 # Environment variables
├── 📁 frontend/
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   └── 📁 dashboards/  # Role-specific dashboards
│   │   ├── 📁 services/        # API services
│   │   └── 📁 utils/           # Utility functions
│   └── 📄 package.json
├── 📄 README.md
├── 📄 database_setup.sql       # Database schema
└── 📄 .gitignore
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `PUT /api/auth/update-password` - Password update

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get user profile

### Stores
- `GET /api/stores` - Get all stores
- `GET /api/stores/my-store` - Get store for logged-in owner
- `POST /api/stores` - Create new store (Admin only)

### Ratings
- `GET /api/ratings` - Get all ratings
- `GET /api/ratings/my-store-ratings` - Get ratings for owner's store
- `POST /api/ratings` - Submit new rating

## 🛠 Troubleshooting

### Common Issues & Solutions

#### 1. Backend won't start
```bash
# Check if PostgreSQL is running
# Windows: Check Services or Task Manager
# Make sure port 5432 is not blocked

# Verify database connection
psql -U postgres -d fullstack_auth
```

#### 2. Frontend build errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use legacy OpenSSL provider
set NODE_OPTIONS=--openssl-legacy-provider
```

#### 3. Database connection errors
- Verify PostgreSQL is running on port 5432
- Check `.env` file credentials match your PostgreSQL setup
- Ensure `fullstack_auth` database exists

#### 4. Port already in use
```bash
# Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use different port in .env file
PORT=5001
```

## 🔒 Security Features

- **JWT Token Authentication** with secure secret
- **Password Hashing** using bcrypt
- **Role-based Authorization** middleware
- **Input Validation** for all API endpoints
- **CORS Configuration** for secure cross-origin requests
- **Environment Variables** for sensitive data

## 🚀 Deployment

### Heroku Deployment
1. Create Heroku app: `heroku create your-app-name`
2. Add PostgreSQL addon: `heroku addons:create heroku-postgresql:hobby-dev`
3. Set environment variables: `heroku config:set JWT_SECRET=your-secret`
4. Deploy: `git push heroku main`

### Vercel/Netlify (Frontend only)
1. Build frontend: `npm run build`
2. Deploy `build` folder to hosting platform
3. Update API URLs to point to deployed backend

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to branch:** `git push origin feature/AmazingFeature`
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Varun Kumar Thakur**
- GitHub: [@varunkumarcs22055](https://github.com/varunkumarcs22055)
- Email: varunkumart.cse22@sbjit.edu.in

## 🙏 Acknowledgments

- Express.js for the robust backend framework
- React for the dynamic frontend
- PostgreSQL for reliable data storage
- JWT for secure authentication
- All open-source contributors

---

⭐ **Star this repository if you found it helpful!** ⭐

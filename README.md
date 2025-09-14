# Fullstack Authentication Application

This project is a full-stack application that implements user authentication and role management using Express.js for the backend and React.js for the frontend. It utilizes PostgreSQL or MySQL as the database for storing user information.

## Features

- User signup and login functionality
- JWT-based authentication
- Role management for users
- Input validation for user data

## Technologies Used

- **Backend**: 
  - Node.js
  - Express.js
  - PostgreSQL/MySQL
  - JWT for authentication
- **Frontend**: 
  - React.js
  - Axios for API calls

## Project Structure

```
fullstack-auth-app
├── backend
│   ├── src
│   │   ├── app.js
│   │   ├── config
│   │   │   └── database.js
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   └── userController.js
│   │   ├── middleware
│   │   │   └── authMiddleware.js
│   │   ├── models
│   │   │   └── User.js
│   │   ├── routes
│   │   │   ├── auth.js
│   │   │   └── users.js
│   │   └── utils
│   │       └── validation.js
│   ├── package.json
│   └── .env
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── Dashboard.js
│   │   ├── services
│   │   │   └── authService.js
│   │   ├── utils
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── # Fullstack Authentication App

A complete fullstack authentication system with role-based access control built with Express.js, PostgreSQL, and React.js.

## 🚀 Features

### Backend Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Secure password storage using bcryptjs
- **Role-Based Access Control** - Three user roles: `user`, `store_owner`, `admin`
- **Input Validation** - Comprehensive validation using Joi
- **Database Integration** - PostgreSQL with connection pooling
- **Error Handling** - Structured error responses
- **CORS Configuration** - Secure cross-origin requests

### Frontend Features
- **Login/Signup Forms** - Beautiful, responsive forms with validation
- **Role-Based Dashboards** - Different dashboards for each user type
- **Protected Routes** - Automatic redirects based on authentication status
- **Local Storage Management** - Secure token storage and management
- **Form Validation** - Client-side validation with user feedback
- **Responsive Design** - Mobile-friendly interface

### User Roles
1. **User** - Can rate stores and browse restaurants
2. **Store Owner** - Can manage their store and handle orders
3. **Admin** - Can manage all users and approve stores

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fullstack-auth-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=fullstack_auth
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

1. Create a PostgreSQL database named `fullstack_auth`
2. Run the database setup script:
```bash
psql -U postgres -d fullstack_auth -f ../database_setup.sql
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## 📝 API Endpoints

### Authentication Routes

#### POST /auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "user" // or "store_owner"
}
```

#### POST /auth/login
Authenticate user
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

## 🎯 Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | admin@demo.com | Password123! | Full platform management |
| Store Owner | store@demo.com | Password123! | Store management dashboard |
| User | user@demo.com | Password123! | User dashboard and store rating |

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

### Authentication
- JWT tokens with 24-hour expiration
- Secure password hashing with bcryptjs
- Protected routes with role verification

### Validation
- Server-side validation using Joi
- Client-side form validation
- Email format validation
- Password strength requirements

## 🎨 Frontend Structure

```
frontend/src/
├── components/
│   ├── Login.js          # Login form component
│   ├── Signup.js         # Registration form component
│   └── Dashboard.js      # Role-based dashboard
├── services/
│   └── authService.js    # API communication service
├── utils/
│   └── api.js           # API configuration
├── App.js               # Main app with routing
└── index.js             # Entry point
```

## 🔧 Backend Structure

```
backend/src/
├── config/
│   └── database.js      # Database configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   └── userController.js # User management
├── middleware/
│   └── authMiddleware.js # JWT verification
├── models/
│   └── User.js          # User data model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── users.js         # User routes
├── utils/
│   └── validation.js    # Input validation schemas
└── app.js               # Express app configuration
```

## 🔄 User Flow

### Registration Flow
1. User fills out signup form with role selection
2. Frontend validates input (email format, password strength)
3. Backend validates data using Joi schemas
4. Password is hashed with bcryptjs
5. User is stored in PostgreSQL database
6. JWT token is generated and returned
7. User is redirected to appropriate dashboard

### Login Flow
1. User enters email and password
2. Backend verifies credentials
3. JWT token is generated on successful login
4. Token is stored in localStorage
5. User is redirected based on their role:
   - `admin` → Admin Dashboard
   - `store_owner` → Store Owner Dashboard
   - `user` → User Dashboard

### Route Protection
- Public routes redirect authenticated users to their dashboard
- Protected routes verify JWT token
- Role-based routes check user permissions
- Invalid/expired tokens redirect to login

## 🛡️ Admin Management

Admins cannot be created through the signup process for security reasons. To create an admin user:

1. **Database Method** (Recommended):
```sql
INSERT INTO users (name, email, password, role, is_verified)
VALUES ('Admin Name', 'admin@example.com', '<hashed_password>', 'admin', true);
```

2. **Application Method**:
Create a user normally, then update their role in the database.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use a production PostgreSQL database
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy to platforms like Netlify, Vercel, or AWS S3

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=<secure-random-string>
DB_HOST=<production-db-host>
DB_USER=<production-db-user>
DB_PASSWORD=<production-db-password>
DB_NAME=<production-db-name>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**JWT Token Invalid**
- Check JWT_SECRET in backend `.env`
- Verify token is being sent with requests
- Check token expiration

**CORS Issues**
- Verify frontend URL in backend CORS configuration
- Check if both servers are running

**Build Errors**
- Run `npm install` in both directories
- Check Node.js version compatibility
- Clear node_modules and reinstall if needed

## 🔗 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/) - JWT token debugger
```

## Setup Instructions

### Backend

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your database connection details and JWT secret:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm start
   ```

## Usage

- Access the frontend application in your browser at `http://localhost:3000`.
- Use the signup page to create a new account and the login page to authenticate.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.
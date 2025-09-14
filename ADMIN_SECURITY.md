# 🔐 ADMIN USER SECURITY GUIDE

## ⚠️ IMPORTANT SECURITY CHANGES

### 🚫 **Admin Role Removed from Public Signup**
- Regular users **CANNOT** signup as admin through the website
- Only "User" and "Store Owner" roles are available in signup form
- Backend validation prevents admin role in signup requests

### 🔒 **Admin Creation Methods**

#### Method 1: Secure Script (Recommended)
```bash
cd backend
node add-admin.js "Admin Name" "admin@company.com" "SecurePassword123!"
```

#### Method 2: Direct Database (Advanced Users)
```sql
-- In pgAdmin Query Tool
INSERT INTO users (name, email, password, role, is_verified) 
VALUES (
    'Admin Name', 
    'admin@company.com', 
    '$2a$10$[HASHED_PASSWORD]', 
    'admin', 
    true
);
```

### 🛡️ **Security Benefits**
✅ Admin accounts can only be created by system administrators
✅ No accidental admin account creation through website
✅ Admin credentials kept separate from regular user flow
✅ Existing admin accounts still work for login

### 👥 **Available Roles**
- **User**: Regular user access through signup
- **Store Owner**: Business owner access through signup  
- **Admin**: System administrator (script/database only)

### 🔐 **Current Admin Account**
- Email: `admin@demo.com`
- Password: `Password123!`
- Access: Full system admin dashboard

### 📝 **Best Practices**
1. Change default admin passwords immediately
2. Use strong, unique passwords for admin accounts
3. Limit number of admin users
4. Regularly audit admin access
5. Keep admin creation script secure
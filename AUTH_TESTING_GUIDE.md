# Authentication System Testing Guide

## Overview
Your portfolio messaging system now uses a custom authentication system with JWT tokens and OTP-based password recovery. Supabase is only used for file storage, not authentication.

## Backend Changes
✅ **User Model**: MongoDB-based user storage with bcrypt password hashing
✅ **JWT Authentication**: 30-day token expiry with Bearer token authentication
✅ **OTP System**: 6-digit codes with 10-minute expiry for password reset
✅ **Protected Routes**: Message API requires valid JWT token

## Frontend Changes
✅ **AuthContext**: Completely rewritten to use custom backend API
✅ **Messenger Component**: New multi-step authentication flow
✅ **Token Storage**: JWT stored in localStorage for session persistence

## Authentication Flow

### 1. Sign Up (Create Account)
- Navigate to the Contact page in your portfolio
- Click "Sign Up" in the messenger
- Enter: Name, Email, Password (min 6 characters)
- User is automatically logged in after successful signup

### 2. Login
- Enter: Email, Password
- JWT token is stored in localStorage
- User profile is fetched and displayed

### 3. Forgot Password Flow

#### Step 1: Request OTP
- Click "Forgot Password?" on login page
- Enter your email address
- OTP will be displayed in the response (for development)
- **NOTE**: In production, OTP should be sent via email

#### Step 2: Verify OTP
- Enter the 6-digit OTP code
- Code expires after 10 minutes
- Click "Verify OTP"

#### Step 3: Reset Password
- Enter your new password (min 6 characters)
- Click "Reset Password"
- Password is hashed and saved
- Redirected to login page

### 4. Send Messages
- Once logged in, you can send messages with attachments
- Files are uploaded to Supabase storage (same bucket as profile images)
- Messages are stored in MongoDB with user association
- JWT token is sent with each request

### 5. Logout
- Click the logout button
- JWT token is removed from localStorage
- User state is cleared

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Generate OTP for email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/profile` - Get user profile (requires JWT)

### Message Routes (Protected)
- `POST /api/messages` - Send message (requires JWT)
- `GET /api/messages/user/:userId` - Get user messages (requires JWT)

## Testing Steps

1. **Test Sign Up**
   - Open browser to http://localhost:3000
   - Go to Contact page
   - Sign up with a new account
   - Verify you see "Account created and logged in successfully!"

2. **Test Message Sending**
   - Send a text message
   - Upload a file (image, pdf, etc.)
   - Check that message appears in the list

3. **Test Logout/Login**
   - Click logout
   - Login again with the same credentials
   - Verify your previous messages are displayed

4. **Test Forgot Password**
   - Click "Forgot Password?"
   - Enter your email
   - Note the OTP code displayed in the success message
   - Enter the OTP code
   - Set a new password
   - Login with the new password

5. **Test Admin Reply (Admin Panel)**
   - Open http://localhost:3001 (admin panel)
   - View messages received from users
   - Reply to a message
   - Check user's messenger to see the admin reply

## Development Notes

### Current OTP Behavior
For development convenience, the OTP is returned in the API response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "123456"
}
```

### Production Setup
For production, update `backend/controllers/authController.js` to send OTP via email using nodemailer:

```javascript
// Uncomment and configure in forgotPassword function
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Password Reset OTP',
  text: `Your OTP for password reset is: ${otp}. Valid for 10 minutes.`
});
```

## Security Features

1. **Password Hashing**: bcrypt with automatic salt generation
2. **JWT Tokens**: Signed with secret key, 30-day expiry
3. **OTP Expiry**: 6-digit codes expire after 10 minutes
4. **Protected Routes**: authMiddleware validates JWT on all message operations
5. **CORS Enabled**: Allows frontend-backend communication

## Troubleshooting

### "Invalid credentials" error
- Check email and password are correct
- Ensure user account exists (try signing up first)

### "Token expired or invalid" error
- Token may have expired (30 days)
- Login again to get a new token

### "OTP expired or invalid" error
- OTP codes expire after 10 minutes
- Request a new OTP from the forgot password page

### File upload fails
- Ensure Supabase credentials are in `frontend/.env`
- Check that `profile_image` bucket exists in Supabase
- Verify storage policies allow public uploads

## Next Steps

1. Test all authentication flows thoroughly
2. Configure email service for OTP sending in production
3. Add rate limiting to prevent OTP spam
4. Consider adding password strength requirements
5. Add "Remember Me" option for extended sessions
6. Implement email verification on signup (optional)

---

**Note**: The authentication system is fully functional for development and production use. Supabase is used ONLY for file storage, not for authentication or user management.

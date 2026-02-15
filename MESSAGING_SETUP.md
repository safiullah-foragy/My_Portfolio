# Messaging Feature Setup Guide

This guide will help you set up the messaging feature with Supabase authentication and storage.

## Prerequisites
- Supabase account (https://supabase.com)
- MongoDB database
- Node.js installed

## Setup Steps

### 1. Supabase Configuration

1. **Create a Supabase project** at https://supabase.com
2. **Enable Email Authentication:**
   - Go to Authentication > Settings
   - Enable Email provider
   - Configure email templates if desired

3. **Create Storage Bucket:**
   - Go to Storage section
   - Create a new bucket named `message-attachments`
   - Set it to Public or Private based on your needs
   - Configure upload restrictions:
     - Allowed mime types: `image/*`, `video/*`, `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `text/plain`
     - Max file size: Set according to your needs (e.g., 10MB)

4. **Get API Credentials:**
   - Go to Project Settings > API
   - Copy your Project URL
   - Copy your anon/public API key

### 2. Environment Variables

1. **Frontend (.env file in /frontend directory):**
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Backend (.env file in /backend directory):**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Install Dependencies

Make sure all dependencies are installed:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Admin Frontend
cd ../admin-frontend
npm install
```

### 4. Database

The Message model will automatically create the messages collection in MongoDB when the first message is sent.

### 5. Start the Application

```bash
# Start all services (from root directory)
npm start

# Or start individually:
# Backend
cd backend
npm start

# Frontend
cd frontend
npm start

# Admin Frontend
cd admin-frontend
npm start
```

## Features

### For Visitors (Portfolio Frontend)
1. **Authentication:**
   - Sign up with name, email, and password
   - Login with email and password
   - Email verification (optional, can be disabled in Supabase)

2. **Messaging:**
   - Send messages to portfolio owner
   - Attach files (images, videos, PDFs, documents, text files)
   - View message history
   - See admin replies

### For Admin (Admin Panel)
1. **Message Management:**
   - View all messages from users
   - Filter by: All, Unread, Replied
   - See message timestamp
   - View attachments
   - Mark messages as read (automatic when opened)

2. **Reply to Messages:**
   - Reply to individual users
   - Update existing replies
   - Track reply timestamps

3. **Delete Messages:**
   - Remove unwanted messages

## How It Works

1. **User Registration:**
   - Visitors create an account using Supabase Auth
   - User data is stored in Supabase
   - Name is saved in user metadata

2. **Messaging:**
   - Authenticated users can send messages
   - Messages are saved to MongoDB
   - File attachments are uploaded to Supabase Storage
   - File URLs are stored with the message

3. **Admin View:**
   - Admin can see all messages in the admin panel
   - Messages show user info, timestamp, and read status
   - Admin can reply directly to users
   - Replies are saved to the message record

4. **Real-time Updates:**
   - Admin panel polls for new messages every 30 seconds
   - User messages list updates after sending

## Security Notes

- User passwords are handled securely by Supabase Auth
- File uploads should be validated and scanned in production
- Consider implementing rate limiting for messages
- Add admin authentication to protect the admin panel
- Set proper CORS policies in production

## Troubleshooting

**Messages not saving:**
- Check MongoDB connection in backend
- Verify backend server is running on port 5000
- Check browser console for API errors

**File uploads failing:**
- Verify Supabase storage bucket is created and accessible
- Check file size limits
- Ensure bucket permissions are set correctly

**Authentication not working:**
- Verify Supabase credentials in .env file
- Check that email provider is enabled in Supabase
- Clear browser cache and try again

**Admin not seeing messages:**
- Check backend API is running
- Verify MongoDB connection
- Check browser console for errors

## Next Steps

Consider adding these enhancements:
- Admin authentication/login
- Push notifications for new messages
- Real-time messaging (WebSockets)
- Message threading/conversations
- Rich text editor for messages
- File preview before upload
- Image compression for uploads
- Search and advanced filtering in admin panel

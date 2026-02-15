# Portfolio Admin Panel - MERN Stack

A comprehensive admin panel for managing portfolio information with image upload to Supabase.

## Features

- ✅ Profile image upload (Supabase storage)
- ✅ Personal information management
- ✅ Education details (School, College, University)
- ✅ Multiple country selection
- ✅ SSC, HSC, and University results
- ✅ 20 social media platform links
- ✅ Contact information
- ✅ Edit and Delete functionality
- ✅ Auto-populate existing data

## Tech Stack

**Frontend:**
- React 18
- Axios
- React-Select

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- Multer (file upload)

**Storage:**
- Supabase (profile images)

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB installed and running
- Supabase account and project

## Setup Instructions

### 1. Supabase Setup

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Go to **Storage** in the left sidebar
4. Create a new bucket called `profile-images`
5. Make the bucket **public** (Settings → Public bucket: ON)
6. Copy your project URL and anon key from **Settings → API**

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Update .env file with your credentials
# Edit backend/.env and add:
# - Your MongoDB URI
# - Your Supabase URL
# - Your Supabase anon key

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_BUCKET=profile-images
```

## Project Structure

```
My_poirtfolio/
├── backend/
│   ├── config/
│   │   └── supabase.js          # Supabase configuration
│   ├── controllers/
│   │   └── profileController.js # Business logic
│   ├── models/
│   │   └── Profile.js           # MongoDB schema
│   ├── routes/
│   │   └── profileRoutes.js     # API routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AdminPanel.js    # Main admin component
    │   │   └── AdminPanel.css   # Styles
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile data |
| POST | `/api/profile` | Create/Update profile |
| POST | `/api/profile/upload` | Upload image to Supabase |
| DELETE | `/api/profile` | Delete profile |

## Features Details

### Personal Information
- Name
- Date of Birth
- Father's Name
- Mother's Name

### Contact Information
- Contact Number
- Email
- Home Address

### Location
- Multiple Country Selection
- Region

### Education
- **School**: Name, Study Period, SSC Result
- **College**: Name, Study Period, HSC Result
- **University**: Name, Degree, Study Period, Result

### Social Media
- 20 platform slots with name and link fields
- Serial numbered for easy organization

### Actions
- **Save**: Creates or updates profile
- **Delete**: Removes entire profile with confirmation
- **Edit**: All fields are editable with existing data pre-populated

## Usage

1. Open `http://localhost:3000` in your browser
2. Fill in your profile information
3. Upload a profile image (stored in Supabase)
4. Click "Save Profile" to store data
5. Data will automatically populate on page reload
6. Edit any field and save again to update
7. Use "Delete Profile" to remove all data

## Notes

- The system maintains a single profile (suitable for personal portfolio)
- All fields are optional except Name
- Images are stored in Supabase for better performance
- MongoDB stores all other data
- The form auto-populates with existing data on load

## Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running: `mongod`
- Check your MongoDB URI in `.env`

**Supabase Upload Error:**
- Verify your Supabase credentials are correct
- Ensure the bucket is public
- Check bucket name matches `.env` configuration

**CORS Error:**
- Backend must be running on port 5000
- Frontend proxy is configured in `frontend/package.json`

## Future Enhancements

- Authentication/Authorization
- Multiple user profiles
- Profile preview page
- Image crop/resize before upload
- Form validation improvements
- Export profile as PDF

## License

MIT

---

**Developed with MERN Stack + Supabase**

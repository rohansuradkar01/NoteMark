# 📚 NoteMark - Personal Notes & Bookmark Manager

A full-stack web application for managing personal notes and bookmarks with tagging, search, favorites, and JWT authentication.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tech Stack](https://img.shields.io/badge/Express-4.x-green?style=flat-square&logo=express)
![Tech Stack](https://img.shields.io/badge/MongoDB-Local-brightgreen?style=flat-square&logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)

## ✨ Features

- **🔐 User Authentication** - Secure JWT-based login and registration
- **📝 Rich Notes** - Create, edit, delete notes with tags
- **🔖 Smart Bookmarks** - Save URLs with auto-fetched titles
- **🔍 Instant Search** - Search across all your content
- **🏷️ Tag Filtering** - Organize and filter by tags
- **⭐ Favorites** - Mark important items for quick access
- **📱 Responsive Design** - Works on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally on port 27017)

### 1. Clone the Repository

```bash
cd notes-bookmark-manager
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server (development mode)
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

---

## 📁 Project Structure

```
notes-bookmark-manager/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & error handling
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── server.js       # Entry point
│   └── .env            # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── app/        # Next.js pages
│   │   ├── components/ # React components
│   │   ├── context/    # Auth context
│   │   ├── lib/        # API client
│   │   └── types/      # TypeScript types
│   └── .env.local      # Frontend environment
│
└── README.md
```

---

## 🔌 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Notes (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| PUT | `/api/notes/:id/favorite` | Toggle favorite |

**Query Parameters:**
- `?q=searchTerm` - Search in title/content
- `?tags=tag1,tag2` - Filter by tags
- `?favorites=true` - Show only favorites

### Bookmarks (Protected Routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Get all bookmarks |
| GET | `/api/bookmarks/:id` | Get single bookmark |
| POST | `/api/bookmarks` | Create bookmark |
| PUT | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |
| PUT | `/api/bookmarks/:id/favorite` | Toggle favorite |

---

## 🧪 Sample API Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Note (use token from login)

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "My First Note",
    "content": "This is my note content",
    "tags": ["work", "important"]
  }'
```

### Create Bookmark (auto-fetches title)

```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "url": "https://github.com",
    "tags": ["dev", "tools"]
  }'
```

---

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

## 📝 License

MIT License - Feel free to use this project for learning or your own applications!

---

Built with ❤️ using Next.js, Express, and MongoDB

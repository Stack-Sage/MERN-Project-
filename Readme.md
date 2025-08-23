# StreamVerse Backend

A full-featured backend for a YouTube-like MERN application, built with Node.js, Express, MongoDB, JWT authentication, Multer, and Cloudinary.

## Table of Contents

- Features
- Tech Stack
- Getting Started
- Project Structure
- API Overview
- Contributing
- License

## Features

- User registration, login, logout, profile management
- JWT-based authentication with access and refresh tokens
- Video upload, update, delete, and search (title/description)
- Comments, likes, playlists, subscriptions
- Hot Takes: share and rate opinions
- Dashboard analytics: views, likes, growth rate, most viewed/liked videos
- File uploads via Multer and Cloudinary
- Robust error handling and custom API responses

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT, bcrypt
- Multer, Cloudinary
- CORS, cookie-parser

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
git clone https://github.com/Stack-Sage/MERN-Project-.git
cd MERN-Project-
npm install
```

### Environment Setup

Create a `.env` file in the root with:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CORS_ORIGIN=*
```

### Running the Server

```bash
npm run dev
```

## Project Structure

```
src/
	app.js
	index.js
	controllers/
	models/
	routes/
	middlewares/
	utils/
	db/
public/
.env
```

## API Overview

Main endpoints (prefix: `/api/v1/`):

- `users/` - User registration, login, profile, avatar, cover image, password
- `videos/` - Upload, update, delete, search, view count
- `comments/` - Add, update, delete, list
- `likes/` - Like/unlike videos
- `playlist/` - Create, update, delete playlists
- `subscriptions/` - Subscribe/unsubscribe channels
- `takes/` - Hot Takes CRUD and rating
- `dashboard/` - Channel analytics

## Contributing

Pull requests and issues are welcome! Please follow standard Node.js/Express best practices.

## License

MIT

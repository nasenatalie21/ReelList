# ReelList
A movie discovery and watchlist app. Search and browse movies from the [TMDB API](https://developer.themoviedb.org), then save them to your own personal watchlist with watched status, star ratings, and notes.

## Features

- Search movies by title
- Browse trending, popular, and top-rated movies
- Movie detail pages (poster, overview, cast, trailer)
- User accounts (register / login with JWT)
- Personal watchlist: add, remove, mark as watched, rate 1-5 stars, add notes
- TMDB responses cached on the server to reduce API calls

## Tech stack
1. Frontend -> React + TypeScript
2. Backend	-> Node.js, Express
3. Database -> MongoDB
4. Auth -> JWT, bcrypt
5. External API	-> [TMDB API](https://developer.themoviedb.org)

### AI Tools:
- Claude

## Prerequisites

- Node.js 18 or newer
- A MongoDB database: local install,

## How to run locally
### 1. Clone the repository

```bash
git clone https://github.com/nasenatalie21/ReelList
```

### 2. Backend

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/
JWT_SECRET=a820ec71441ab6d21e06c0282093e004a83bb3d386e8269abbc345b565fbded2d78d8906769d1fa572be5b3b7c818a80
JWT_EXPIRES_IN=7d
TMDB_API_KEY=4bc34e8e1301f672f607aed6bf33036b
TMDB_BASE_URL=https://api.themoviedb.org/3
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev
```

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

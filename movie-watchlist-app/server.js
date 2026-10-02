const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Mock Data หนังจำลอง
let movies = [
  { id: 1, title: 'Inception', director: 'Christopher Nolan', genre: 'Sci-Fi', watched: true },
  { id: 2, title: 'Interstellar', director: 'Christopher Nolan', genre: 'Sci-Fi', watched: false },
  { id: 3, title: 'Parasite', director: 'Bong Joon-ho', genre: 'Drama', watched: true }
];
let nextId = 4;

// 1. GET /api/movies - ดึงทั้งหมด (รองรับ Query String: ?genre=... หรือ ?watched=true/false)
app.get('/api/movies', (req, res) => {
  const { genre, watched } = req.query;
  let filtered = [...movies];

  if (genre) {
    filtered = filtered.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
  }
  if (watched !== undefined) {
    const isWatched = watched === 'true';
    filtered = filtered.filter(m => m.watched === isWatched);
  }

  res.json(filtered);
});

// 2. GET /api/movies/:id - ดึงรายเรื่อง
app.get('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  res.json(movie);
});

// 3. POST /api/movies - เพิ่มหนังใหม่
app.post('/api/movies', (req, res) => {
  const { title, director, genre } = req.body;

  if (!title || !director || !genre) {
    return res.status(400).json({ message: 'Validation Error: title, director, and genre are required' });
  }

  const newMovie = {
    id: nextId++,
    title,
    director,
    genre,
    watched: false
  };

  movies.push(newMovie);
  res.status(201).json(newMovie);
});

// 4. PATCH /api/movies/:id - แก้ไข/สลับสถานะ
app.patch('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);

  if (!movie) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const { title, director, genre, watched } = req.body;

  if (title !== undefined) movie.title = title;
  if (director !== undefined) movie.director = director;
  if (genre !== undefined) movie.genre = genre;
  if (watched !== undefined) movie.watched = watched;

  res.json(movie);
});

// 5. DELETE /api/movies/:id - ลบรายการ
app.delete('/api/movies/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = movies.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  movies.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
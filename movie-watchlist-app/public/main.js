const API_URL = '/api/movies';

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();

  document.getElementById('add-movie-form').addEventListener('submit', addMovie);
  document.getElementById('filter-watched').addEventListener('change', fetchMovies);
});

async function fetchMovies() {
  const watchedFilter = document.getElementById('filter-watched').value;
  let url = API_URL;
  if (watchedFilter !== '') {
    url += `?watched=${watchedFilter}`;
  }

  const res = await fetch(url);
  const movies = await res.json();
  renderMovies(movies);
}

function renderMovies(movies) {
  const list = document.getElementById('movie-list');
  list.innerHTML = '';

  if (movies.length === 0) {
    list.innerHTML = '<p style="color: #888;">ไม่มีรายการภาพยนตร์</p>';
    return;
  }

  movies.forEach(movie => {
    const li = document.createElement('li');
    li.className = `movie-item ${movie.watched ? 'watched' : ''}`;
    li.innerHTML = `
      <div class="movie-info">
        <strong>${movie.title}</strong> กำกับโดย ${movie.director} 
        <small>(${movie.genre})</small>
      </div>
      <div class="actions">
        <button class="btn-toggle" onclick="toggleWatched(${movie.id}, ${movie.watched})">
          ${movie.watched ? 'ทำเป็นยังไม่ได้ดู' : 'ดูแล้ว'}
        </button>
        <button class="btn-delete" onclick="deleteMovie(${movie.id})">ลบ</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function addMovie(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const director = document.getElementById('director').value;
  const genre = document.getElementById('genre').value;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, director, genre })
  });

  if (res.status === 201) {
    document.getElementById('add-movie-form').reset();
    fetchMovies();
  } else {
    alert('เกิดข้อผิดพลาดในการเพิ่มภาพยนตร์');
  }
}

async function toggleWatched(id, currentWatched) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ watched: !currentWatched })
  });
  fetchMovies();
}

async function deleteMovie(id) {
  if (confirm('คุณต้องการลบภาพยนตร์เรื่องนี้ใช่หรือไม่?')) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (res.status === 204) {
      fetchMovies();
    }
  }
}
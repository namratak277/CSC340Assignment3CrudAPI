document.addEventListener('DOMContentLoaded', async () => {
  const catsTableBody = document.querySelector('#catsTable tbody');
  const gallery = document.querySelector('.cat.gallery');
  const catForm = document.getElementById('catForm');
  const btnRefresh = document.getElementById('btnRefresh');
  const btnSearch = document.getElementById('btnSearch');
  const btnFilterBreed = document.getElementById('btnFilterBreed');
  const btnFilterColor = document.getElementById('btnFilterColor');
  const btnCancel = document.getElementById('btnCancel');

  async function fetchCats() {
    const res = await fetch('/cats');
    const data = await res.json();
    renderCats(data);
  }

  function getQueryParam(name) {
    const params = new URLSearchParams(location.search);
    return params.get(name);
  }

  function renderCats(cats) {
    // Card/Grid view (use catGrid if present)
    const catGrid = document.getElementById('catGrid');
    if (catGrid) {
      catGrid.innerHTML = '';
      const images = ['cat1.webp', 'cat2.webp', 'cat3.webp', 'cat4.jpg', 'cat5.jpg', 'cat6.jpg'];
      cats.forEach((c, index) => {
        const imageName = images[index % images.length];
        const card = document.createElement('div');
        card.className = 'cat-card';
        card.innerHTML = `
          <img src="Images/${imageName}" alt="${escapeHtml(c.name ?? 'Cat')}">
          <div class="cat-card-content">
            <h3>${escapeHtml(c.name ?? '')}</h3>
            <p class="cat-breed">${escapeHtml(c.breed ?? 'Unknown breed')}</p>
            <p class="cat-age">Age: ${c.age ?? 'N/A'} years</p>
            <p class="cat-color">Color: ${escapeHtml(c.color ?? 'N/A')}</p>
            <p class="cat-description">${escapeHtml(c.description ?? '')}</p>
            <div class="cat-actions">
              <a class="btn-view" href="/details.html?id=${c.animalId}">View</a>
              <a class="btn-edit" href="/new-animal-form.html?id=${c.animalId}">Edit</a>
              <button class="btn-delete" data-id="${c.animalId}">Delete</button>
            </div>
          </div>
        `;
        catGrid.appendChild(card);
      });
      
      // Add delete listeners to new cards
      catGrid.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async (ev) => {
          const id = ev.target.dataset.id;
          if (!confirm('Delete cat ' + id + '?')) return;
          const res = await fetch(`/cats/${id}`, { method: 'DELETE' });
          if (res.ok) {
            fetchCats();
          } else {
            alert('Delete failed');
          }
        });
      });
      return;
    }

    // Table mode (if table exists)
    if (catsTableBody) {
      catsTableBody.innerHTML = '';
      cats.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.animalId ?? ''}</td>
          <td>${escapeHtml(c.name ?? '')}</td>
          <td>${escapeHtml(c.description ?? '')}</td>
          <td>${escapeHtml(c.breed ?? '')}</td>
          <td>${c.age ?? ''}</td>
          <td>${escapeHtml(c.color ?? '')}</td>
          <td>
            <a class="view" href="/details.html?id=${c.animalId}">View</a>
            <a class="edit-link" href="/new-animal-form.html?id=${c.animalId}">Edit</a>
            <button class="delete" data-id="${c.animalId}">Delete</button>
          </td>
        `;
        catsTableBody.appendChild(tr);
      });
      return;
    }

    // Gallery mode (fallback to your existing card layout)
    if (gallery) {
      gallery.innerHTML = '';
      const row = document.createElement('div');
      row.className = 'row';
      cats.forEach(c => {
        const card = document.createElement('div');
        card.className = 'cat info';
        card.innerHTML = `
          <img src="Images/cat1.webp" alt="Cat ${c.animalId}">
          <h2>${escapeHtml(c.name ?? '')}</h2>
          <p>Age: ${c.age ?? ''}</p>
          <p>Breed: ${escapeHtml(c.breed ?? '')}</p>
          <a href="details.html?id=${c.animalId}">View Details</a>
        `;
        row.appendChild(card);
      });
      gallery.appendChild(row);
      return;
    }

    console.warn('No table or gallery container found to render cats.');
  }

  function escapeHtml(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // Create or update
  if (catForm) catForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const id = document.getElementById('catId').value;
    const payload = {
      name: document.getElementById('name').value,
      description: document.getElementById('description').value,
      breed: document.getElementById('breed').value,
      age: parseFloat(document.getElementById('age').value) || 0,
      color: document.getElementById('color').value
    };

    try {
      if (id) {
        // update
        const res = await fetch(`/cats/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        // create
        const res = await fetch('/cats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
      }
      // If we're on the standalone form page, redirect back to index.
      if (location.pathname.endsWith('/new-animal-form.html') || location.pathname.endsWith('new-animal-form.html')) {
        location.href = '/index.html';
        return;
      }
      clearForm();
      fetchCats();
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    }
  });

  // Edit / Delete buttons
  if (catsTableBody) catsTableBody.addEventListener('click', async (ev) => {
    const btn = ev.target;
    if (btn.classList.contains('delete')) {
      const id = btn.dataset.id;
      if (!confirm('Delete cat ' + id + '?')) return;
      const res = await fetch(`/cats/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCats();
      } else {
        alert('Delete failed');
      }
    }
  });

  function fillForm(cat) {
    document.getElementById('catId').value = cat.animalId || '';
    document.getElementById('name').value = cat.name || '';
    document.getElementById('description').value = cat.description || '';
    document.getElementById('breed').value = cat.breed || '';
    document.getElementById('age').value = cat.age || '';
    document.getElementById('color').value = cat.color || '';
  }

  function clearForm() {
    document.getElementById('catId').value = '';
    catForm.reset();
  }

  if (btnRefresh) btnRefresh.addEventListener('click', fetchCats);
  if (btnCancel) btnCancel.addEventListener('click', (e) => { e.preventDefault(); clearForm(); });

  if (btnSearch) btnSearch.addEventListener('click', async () => {
    const name = document.getElementById('searchName').value;
    const url = '/cats/search' + (name ? `?name=${encodeURIComponent(name)}` : '');
    const res = await fetch(url);
    const data = await res.json();
    renderCats(data);
  });

  if (btnFilterBreed) btnFilterBreed.addEventListener('click', async () => {
    const breed = document.getElementById('filterBreed').value;
    if (!breed) return fetchCats();
    const res = await fetch(`/cats/breed/${encodeURIComponent(breed)}`);
    const data = await res.json();
    renderCats(data);
  });

  if (btnFilterColor) btnFilterColor.addEventListener('click', async () => {
    const color = document.getElementById('filterColor').value;
    if (!color) return fetchCats();
    const res = await fetch(`/cats/color/${encodeURIComponent(color)}`);
    const data = await res.json();
    renderCats(data);
  });

  // If we're on the add/edit page and there is an id param, prefill form by fetching that cat
  if (catForm) {
    const editId = getQueryParam('id');
    if (editId) {
      fetch(`/cats/${encodeURIComponent(editId)}`)
        .then(r => r.ok ? r.json() : Promise.reject('Not found'))
        .then(data => fillForm(data))
        .catch(() => {/* ignore */});
    }
  }

  // initial list load only if there is a table, gallery, or grid on the page
  const catGrid = document.getElementById('catGrid');
  if (catsTableBody || gallery || catGrid) {
    fetchCats();
  }

  // ===== DETAILS PAGE FUNCTIONALITY =====
  // If we're on details.html, load and display single cat details
  const nameEl = document.getElementById('detailName');
  const ageEl = document.getElementById('detailAge');
  const breedEl = document.getElementById('detailBreed');
  const descEl = document.getElementById('detailDescription');
  const imgEl = document.getElementById('detailImage');

  if (nameEl || descEl) {
    const id = getQueryParam('id');
    if (!id) {
      if (descEl) descEl.textContent = 'Missing cat id in URL.';
    } else {
      try {
        const res = await fetch(`/cats/${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (descEl) descEl.textContent = 'Cat not found.';
        } else {
          const c = await res.json();
          if (nameEl) nameEl.textContent = c.name || '';
          if (ageEl) ageEl.textContent = (c.age ?? '') + '';
          if (breedEl) breedEl.textContent = c.breed || '';
          if (descEl) descEl.textContent = c.description || '';
          if (imgEl) {
            imgEl.alt = `Cat ${c.animalId}`;
            // If you later add image URLs in the API, set imgEl.src here
          }
        }
      } catch (e) {
        if (descEl) descEl.textContent = 'Failed to load cat details.';
        console.error(e);
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const catsTableBody = document.querySelector('#catsTable tbody');
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

  function renderCats(cats) {
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
          <button class="edit" data-id="${c.animalId}">Edit</button>
          <button class="delete" data-id="${c.animalId}">Delete</button>
        </td>
      `;
      catsTableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // Create or update
  catForm.addEventListener('submit', async (ev) => {
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
      clearForm();
      fetchCats();
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    }
  });

  // Edit / Delete buttons
  catsTableBody.addEventListener('click', async (ev) => {
    const btn = ev.target;
    if (btn.classList.contains('edit')) {
      const id = btn.dataset.id;
      const res = await fetch(`/cats/${id}`);
      if (res.ok) {
        const data = await res.json();
        fillForm(data);
      } else {
        alert('Cat not found');
      }
    } else if (btn.classList.contains('delete')) {
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

  btnRefresh.addEventListener('click', fetchCats);
  btnCancel.addEventListener('click', (e) => { e.preventDefault(); clearForm(); });

  btnSearch.addEventListener('click', async () => {
    const name = document.getElementById('searchName').value;
    const url = '/cats/search' + (name ? `?name=${encodeURIComponent(name)}` : '');
    const res = await fetch(url);
    const data = await res.json();
    renderCats(data);
  });

  btnFilterBreed.addEventListener('click', async () => {
    const breed = document.getElementById('filterBreed').value;
    if (!breed) return fetchCats();
    const res = await fetch(`/cats/breed/${encodeURIComponent(breed)}`);
    const data = await res.json();
    renderCats(data);
  });

  btnFilterColor.addEventListener('click', async () => {
    const color = document.getElementById('filterColor').value;
    if (!color) return fetchCats();
    const res = await fetch(`/cats/color/${encodeURIComponent(color)}`);
    const data = await res.json();
    renderCats(data);
  });

  // initial load
  fetchCats();
});

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const nameEl = document.getElementById('detailName');
  const ageEl = document.getElementById('detailAge');
  const breedEl = document.getElementById('detailBreed');
  const descEl = document.getElementById('detailDescription');
  const imgEl = document.getElementById('detailImage');

  if (!id) {
    if (descEl) descEl.textContent = 'Missing cat id in URL.';
    return;
  }

  try {
    const res = await fetch(`/cats/${encodeURIComponent(id)}`);
    if (!res.ok) {
      if (descEl) descEl.textContent = 'Cat not found.';
      return;
    }
    const c = await res.json();
    if (nameEl) nameEl.textContent = c.name || '';
    if (ageEl) ageEl.textContent = (c.age ?? '') + '';
    if (breedEl) breedEl.textContent = c.breed || '';
    if (descEl) descEl.textContent = c.description || '';
    if (imgEl) {
      imgEl.alt = `Cat ${c.animalId}`;
      // If you later add image URLs in the API, set imgEl.src here
    }
  } catch (e) {
    if (descEl) descEl.textContent = 'Failed to load cat details.';
    console.error(e);
  }
});

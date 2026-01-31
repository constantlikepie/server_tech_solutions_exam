const rowsEl = document.getElementById('rows');
const form = document.getElementById('productForm');
const msg = document.getElementById('msg');
const summaryEl = document.getElementById('summary');

async function loadProducts() {
  const res = await fetch('api/products.php');
  const data = await res.json();

  rowsEl.innerHTML = (data.products || []).map(p => `
    <tr>
      <td>${escapeHtml(p.name)}</td>
      <td>${Number(p.unit_price).toFixed(2)}</td>
      <td>${p.qty}</td>
      <td>${escapeHtml(p.pricing_mode)}</td>
      <td>${Number(p.discount_percent).toFixed(2)}</td>
      <td>${formatPrice(Number(p.total_price).toFixed(2))}</td>
      <td>${formatDateTime(p.created_at)}</td>
    </tr>
  `).join('');

  // INTENTIONAL: summary not implemented
  summaryEl.innerHTML = '';
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';

  const payload = {
    name: document.getElementById('name').value,
    unit_price: document.getElementById('unit_price').value,
    qty: document.getElementById('qty').value,
    pricing_mode: document.getElementById('pricing_mode').value
  };

  const res = await fetch('api/products.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  });

  const out = await res.json();

  if (!out.success) {
    msg.textContent = out.error || 'Save failed.';
    msg.classList.add('msg-danger');
    return;
  }
  
  loadProducts();
  msg.textContent = 'Saved.';
  msg.classList.add('msg-success');
});

loadProducts();

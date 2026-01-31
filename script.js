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

  const summary = data.products.reduce(
    (acc, p) => {
      acc.totalItems += Number(p.qty) || 0;
      acc.totalRevenue += Number(p.total_price) || 0;
      return acc;
    },
    { totalItems: 0, totalRevenue: 0 }
  );

  summaryEl.innerHTML = `
    <div class="summary-row">
      <strong>Total Items:</strong> ${summary.totalItems}
    </div>
    <div class="summary-row">
      <strong>Total Revenue:</strong> ${formatPrice(summary.totalRevenue.toFixed(2))}
    </div>
  `;
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
  
  msg.classList.remove('msg-danger');
  msg.classList.remove('msg-success');

  const validationErrors = validateFormData(); // to test back-end validation, must set the value to empty array
  console.log(validationErrors);

  if (validationErrors.length > 0) {
    displayAlertMessage(validationErrors);
    return;
  }

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
    displayAlertMessage(out.errors);
    msg.classList.add('msg-danger');
    return;
  }
  
  loadProducts();
  resetForm();
  msg.textContent = 'Product saved successfully.';
  msg.classList.add('msg-success');
});

loadProducts();
const adminPanel = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BrainMint Product Admin</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, Segoe UI, Arial, sans-serif;
      --ink: #172033;
      --muted: #667085;
      --line: #d9e2ec;
      --panel: #ffffff;
      --bg: #f5f7fb;
      --accent: #0f766e;
      --danger: #b42318;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); }
    header { padding: 22px 28px; background: var(--panel); border-bottom: 1px solid var(--line); }
    main { padding: 24px 28px 36px; display: grid; gap: 18px; }
    h1, h2 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 24px; }
    h2 { font-size: 17px; }
    label { display: grid; gap: 6px; font-size: 13px; font-weight: 650; color: #344054; }
    input, select, textarea, button {
      min-height: 38px;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 8px 10px;
      font: inherit;
      background: #fff;
    }
    button { cursor: pointer; background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 700; }
    button.secondary { background: #fff; color: var(--ink); }
    button.danger { background: var(--danger); border-color: var(--danger); }
    .toolbar, .grid, .stats { display: grid; gap: 12px; }
    .toolbar { grid-template-columns: repeat(5, minmax(140px, 1fr)); align-items: end; }
    .stats { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .stat, section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
    .stat { padding: 14px; }
    .stat span { display: block; color: var(--muted); font-size: 12px; }
    .stat strong { display: block; font-size: 24px; margin-top: 4px; }
    section { padding: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 10px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: middle; }
    th { font-size: 12px; color: var(--muted); text-transform: uppercase; }
    .status { border-radius: 999px; padding: 4px 8px; font-size: 12px; font-weight: 700; display: inline-block; }
    .active { background: #dcfce7; color: #166534; }
    .inactive { background: #fee2e2; color: #991b1b; }
    .low { color: var(--danger); font-weight: 700; }
    .form-grid { display: grid; grid-template-columns: repeat(4, minmax(150px, 1fr)); gap: 12px; }
    .form-grid .wide { grid-column: span 2; }
    .form-grid .full { grid-column: 1 / -1; }
    .message { min-height: 20px; color: var(--muted); }
    @media (max-width: 900px) {
      .toolbar, .form-grid { grid-template-columns: 1fr; }
      .form-grid .wide, .form-grid .full { grid-column: auto; }
      main, header { padding-left: 16px; padding-right: 16px; }
      table { display: block; overflow-x: auto; white-space: nowrap; }
    }
  </style>
</head>
<body>
  <header>
    <h1>BrainMint Product Admin</h1>
  </header>
  <main>
    <section>
      <div class="toolbar">
        <label>API base
          <input id="apiBase" value="/api/admin/products" />
        </label>
        <label>Bearer token
          <input id="token" value="test-token" />
        </label>
        <label>Admin role
          <select id="role">
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </label>
        <label>Search
          <input id="search" placeholder="shirt, denim, brand..." />
        </label>
        <button id="refresh" type="button">Refresh</button>
      </div>
      <p id="message" class="message"></p>
    </section>

    <div id="stats" class="stats"></div>

    <section>
      <h2 id="formTitle">Create product</h2>
      <form id="productForm" class="form-grid">
        <input type="hidden" id="productId" />
        <label class="wide">Name <input id="name" required /></label>
        <label>Slug <input id="slug" required /></label>
        <label>Brand <input id="brand" /></label>
        <label>Category <select id="category" required></select></label>
        <label>Price <input id="price" type="number" min="0" required /></label>
        <label>Discount price <input id="discountPrice" type="number" min="0" /></label>
        <label>SKU <input id="sku" required /></label>
        <label>Stock <input id="stock" type="number" min="0" value="0" required /></label>
        <label>Low stock threshold <input id="lowStockThreshold" type="number" min="0" value="5" /></label>
        <label>Sold <input id="sold" type="number" min="0" value="0" /></label>
        <label>Sizes <input id="sizes" placeholder="S,M,L,XL" /></label>
        <label>Colors <input id="colors" placeholder="#000000,#ffffff" /></label>
        <label>Image URL <input id="imageUrl" /></label>
        <label>Image alt <input id="imageAlt" /></label>
        <label>Featured <select id="isFeatured"><option value="false">No</option><option value="true">Yes</option></select></label>
        <label>Bestseller <select id="isBestseller"><option value="false">No</option><option value="true">Yes</option></select></label>
        <label>Active <select id="isActive"><option value="true">Yes</option><option value="false">No</option></select></label>
        <label class="full">Description <textarea id="description" rows="3" required></textarea></label>
        <button type="submit">Save product</button>
        <button id="resetForm" class="secondary" type="button">Clear</button>
      </form>
    </section>

    <section>
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="products"></tbody>
      </table>
    </section>
  </main>
  <script>
    const fields = ['name', 'slug', 'brand', 'category', 'price', 'discountPrice', 'sku', 'stock', 'lowStockThreshold', 'sold', 'sizes', 'colors', 'imageUrl', 'imageAlt', 'isFeatured', 'isBestseller', 'isActive', 'description'];
    let products = [];
    let categories = [];

    const el = (id) => document.getElementById(id);
    const headers = () => ({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + el('token').value,
      'x-user-role': el('role').value,
      'x-user-id': 'admin-panel'
    });
    const setMessage = (text) => { el('message').textContent = text; };
    const apiBase = () => el('apiBase').value.replace(/\\/$/, '');

    const request = async (path, options = {}) => {
      const response = await fetch(apiBase() + path, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
      const body = await response.json();
      if (!response.ok || body.success === false) throw new Error(body.message || 'Request failed');
      return body.data;
    };

    const splitList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);
    const payloadFromForm = () => ({
      name: el('name').value,
      slug: el('slug').value,
      brand: el('brand').value,
      category: el('category').value,
      price: Number(el('price').value),
      discountPrice: el('discountPrice').value ? Number(el('discountPrice').value) : undefined,
      description: el('description').value,
      sizes: splitList(el('sizes').value),
      colors: splitList(el('colors').value),
      images: el('imageUrl').value ? [{ url: el('imageUrl').value, alt: el('imageAlt').value }] : [],
      inventory: {
        sku: el('sku').value,
        stock: Number(el('stock').value),
        lowStockThreshold: Number(el('lowStockThreshold').value),
        sold: Number(el('sold').value)
      },
      isFeatured: el('isFeatured').value === 'true',
      isBestseller: el('isBestseller').value === 'true',
      isActive: el('isActive').value === 'true'
    });

    const renderStats = (stats) => {
      el('stats').innerHTML = Object.entries(stats).map(([key, value]) => (
        '<div class="stat"><span>' + key.replace(/[A-Z]/g, ' $&') + '</span><strong>' + value + '</strong></div>'
      )).join('');
    };

    const renderCategories = () => {
      el('category').innerHTML = categories.map((category) => (
        '<option value="' + category._id + '">' + category.name + '</option>'
      )).join('');
    };

    const renderProducts = () => {
      el('products').innerHTML = products.map((product) => {
        const categoryName = product.category && product.category.name ? product.category.name : 'Unassigned';
        const lowStock = product.inventory.stock <= product.inventory.lowStockThreshold;
        return '<tr>' +
          '<td>' + product.name + '<br><small>' + product.inventory.sku + '</small></td>' +
          '<td>' + categoryName + '</td>' +
          '<td>₹' + product.price + (product.discountPrice ? ' / ₹' + product.discountPrice : '') + '</td>' +
          '<td class="' + (lowStock ? 'low' : '') + '">' + product.inventory.stock + ' stock / ' + (product.inventory.sold || 0) + ' sold</td>' +
          '<td><span class="status ' + (product.isActive ? 'active' : 'inactive') + '">' + (product.isActive ? 'Active' : 'Inactive') + '</span></td>' +
          '<td><button class="secondary" type="button" onclick="editProduct(\\'' + product._id + '\\')">Edit</button> ' +
          '<button class="danger" type="button" onclick="deleteProduct(\\'' + product._id + '\\')">Delete</button></td>' +
          '</tr>';
      }).join('');
    };

    const load = async () => {
      try {
        setMessage('Loading admin data...');
        const query = el('search').value ? '?search=' + encodeURIComponent(el('search').value) : '';
        const [dashboard, list] = await Promise.all([request('/dashboard'), request(query)]);
        products = list.products;
        categories = list.categories;
        renderStats(dashboard.stats);
        renderCategories();
        renderProducts();
        setMessage('Loaded ' + products.length + ' products.');
      } catch (error) {
        setMessage(error.message);
      }
    };

    window.editProduct = (id) => {
      const product = products.find((item) => item._id === id);
      if (!product) return;
      el('formTitle').textContent = 'Edit product';
      el('productId').value = product._id;
      el('name').value = product.name || '';
      el('slug').value = product.slug || '';
      el('brand').value = product.brand || '';
      el('category').value = product.category && product.category._id ? product.category._id : product.category;
      el('price').value = product.price || 0;
      el('discountPrice').value = product.discountPrice || '';
      el('sku').value = product.inventory.sku || '';
      el('stock').value = product.inventory.stock || 0;
      el('lowStockThreshold').value = product.inventory.lowStockThreshold || 0;
      el('sold').value = product.inventory.sold || 0;
      el('sizes').value = (product.sizes || []).join(',');
      el('colors').value = (product.colors || []).join(',');
      el('imageUrl').value = product.images && product.images[0] ? product.images[0].url : '';
      el('imageAlt').value = product.images && product.images[0] ? product.images[0].alt || '' : '';
      el('isFeatured').value = String(Boolean(product.isFeatured));
      el('isBestseller').value = String(Boolean(product.isBestseller));
      el('isActive').value = String(Boolean(product.isActive));
      el('description').value = product.description || '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteProduct = async (id) => {
      if (!confirm('Delete this product?')) return;
      try {
        await request('/' + id, { method: 'DELETE' });
        setMessage('Product deleted.');
        await load();
      } catch (error) {
        setMessage(error.message);
      }
    };

    el('productForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = el('productId').value;
      try {
        await request(id ? '/' + id : '', {
          method: id ? 'PUT' : 'POST',
          body: JSON.stringify(payloadFromForm())
        });
        el('productForm').reset();
        el('productId').value = '';
        el('formTitle').textContent = 'Create product';
        setMessage('Product saved.');
        await load();
      } catch (error) {
        setMessage(error.message);
      }
    });

    el('resetForm').addEventListener('click', () => {
      el('productForm').reset();
      el('productId').value = '';
      el('formTitle').textContent = 'Create product';
    });
    el('refresh').addEventListener('click', load);
    load();
  </script>
</body>
</html>`;

module.exports = adminPanel;

const API_BASE = "api/";

async function loadProducts() {

  const query        = document.getElementById('search')?.value || '';
  const min          = document.getElementById('minPrecio')?.value || '';
  const max          = document.getElementById('maxPrecio')?.value || '';
  const categoria_id = document.getElementById('categoriaFiltro')?.value || '';
  const envio        = document.getElementById('envioGratis')?.checked ? '1' : '';
  const available    = document.getElementById('stockDisponible')?.checked ? '1' : '';
  const sort         = document.getElementById('sort')?.value || 'default';

  const params = new URLSearchParams({
    query,
    min,
    max,
    categoria_id,
    envio,
    available,
    sort
  });

  const res = await fetch(API_BASE + "getProducts.php?" + params.toString());
  const data = await res.json();

  if (data.success) {
    renderProducts(data.products);
  }
}

  const params = new URLSearchParams();

  if (query) params.append('query', query);
  if (available) params.append('available', 1);
  if (min !== '') params.append('min', min);
  if (max !== '') params.append('max', max);
  if (categoria_id) params.append('categoria_id', categoria_id);
  if (sort) params.append('sort', sort);

  const res = await fetch(API_BASE + "getProducts.php?" + params.toString());
  const data = await res.json();

  if (data.success) {
    renderProducts(data.products);
  } else {
    console.error(data.message);
  }
  
function renderProducts(productos) {
  const cont = document.getElementById("productGrid");
  if (!cont) return;

  cont.innerHTML = productos.map(p => `
    <div class="col-md-3">
      <div class="card shadow-sm h-100">
        
        <img src="${p.imagen ?? 'img/noimage.png'}" class="card-img-top" style="height:180px; object-fit:cover;">
        
        <div class="card-body">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text">${p.descripcion ?? ''}</p>
          <p class="fw-bold">$${p.precio}</p>
          <p class="text-muted">Stock: ${p.stock}</p>

          <button class="btn btn-primary btn-sm" onclick="addToCart(${p.id})">Agregar al carrito</button>
          <button class="btn btn-outline-secondary btn-sm" onclick="verProducto(${p.id})">Ver</button>

          <button class="btn btn-outline-danger btn-sm mt-2" onclick="addFavorite(${p.id})">❤ Favorito</button>
        </div>

      </div>
    </div>
  `).join('');
}

async function addFavorite(productId) {
  const res = await fetch(API_BASE + "addFavorite.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({product_id: productId})
  });

  const data = await res.json();

  if (data.success) {
    alert("Agregado a favoritos");
  } else {
    alert(data.message);
  }
}

async function removeFavorite(productId) {
  const res = await fetch(API_BASE + "removeFavorite.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({product_id: productId})
  });

  const data = await res.json();

  if (data.success) {
    alert("Eliminado de favoritos");
  } else {
    alert(data.message);
  }
}

async function verProducto(id) {
  const res = await fetch(API_BASE + "getProduct.php?id=" + id);
  const data = await res.json();

  if (!data.success) {
    alert("Producto no encontrado");
    return;
  }

  const p = data.product;

  const titulo = document.getElementById("modal-title");
  const cuerpo = document.getElementById("modal-body");

  if (!titulo || !cuerpo) {
    alert("No existe el modal, pero la función funciona!");
    return;
  }

  titulo.innerText = p.nombre;
  cuerpo.innerHTML = `
    <img src="${p.imagen ?? 'img/noimage.png'}" class="img-fluid mb-2">
    <p>${p.descripcion}</p>
    <p class="fw-bold">$${p.precio}</p>
    <p>Stock: ${p.stock}</p>

    <button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
  `;

  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  modal.show();
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const item = cart.find(i => i.id === productId);
  if (item) item.cantidad++;
  else cart.push({id: productId, cantidad: 1});

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Producto agregado al carrito");
}

document.addEventListener("DOMContentLoaded", () => {

  // Buscar
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", () => {
      loadProducts({query: search.value});
    });
  }

  // Ordenar
  const sort = document.getElementById("sort");
  if (sort) {
    sort.addEventListener("change", () => {
      loadProducts({sort: sort.value});
    });
  }

  // Cargar productos al inicio
  loadProducts();
});

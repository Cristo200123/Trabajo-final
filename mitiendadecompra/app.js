// ====================================================================
// 1) PRODUCTOS GLOBAL
// ====================================================================
window.productos = [];


// ====================================================================
// 2) CARGAR PRODUCTOS DESDE MYSQL
// ====================================================================
async function cargarProductosDesdeServidor() {
  try {
    const respuesta = await fetch("api/getProducts.php");
    const data = await respuesta.json();

    window.productos = data.products || [];

    if (document.getElementById("productGrid")) {
      renderProductos(window.productos);
      aplicarFiltros();
    }

  } catch (error) {
    console.error("Error cargando productos desde servidor:", error);
  }
}



// ====================================================================
// 3) MOSTRAR PRODUCTOS EN INDEX.HTML
// ====================================================================
function renderProductos(lista) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "";

  lista.forEach(prod => {
    const imagen = prod.imagen || "/mitiendadecompra/img/default.jpg";

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imagen}" class="card-img-top" style="height:200px; object-fit:cover;">
        
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.nombre}</h5>
          <p class="card-text text-muted">${prod.descripcion}</p>

          <div class="mt-auto">
            <h4 class="text-primary">$${prod.precio}</h4>

            <button class="btn btn-success w-100 mt-2"
              onclick="agregarAlCarrito(${prod.id})">
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(col);
  });
}



// ====================================================================
// 4) FILTROS (solo en index.html)
// ====================================================================
function aplicarFiltros() {

  if (!document.getElementById("productGrid")) return;

  let lista = [...window.productos];

  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const categorySelect = document.getElementById("category");
  const minPrice = document.getElementById("minPrice");
  const maxPrice = document.getElementById("maxPrice");
  const stockFilter = document.getElementById("stockFilter");
  const envioSelect = document.getElementById("envio");
  const condicionSelect = document.getElementById("condicion");

  if (searchInput?.value) {
    const texto = searchInput.value.toLowerCase();
    lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
  }

  if (minPrice?.value) lista = lista.filter(p => p.precio >= Number(minPrice.value));
  if (maxPrice?.value) lista = lista.filter(p => p.precio <= Number(maxPrice.value));

  if (categorySelect && categorySelect.value !== "all") {
    lista = lista.filter(p => p.categoria === categorySelect.value);
  }

  if (stockFilter?.checked) {
    lista = lista.filter(p => Number(p.stock) > 0);
  }

  if (envioSelect?.value) {
    lista = lista.filter(p => String(p.envio) === envioSelect.value);
  }

  if (condicionSelect?.value) {
    lista = lista.filter(p => p.condicion === condicionSelect.value);
  }

  if (sortSelect?.value === "price_asc") lista.sort((a, b) => a.precio - b.precio);
  if (sortSelect?.value === "price_desc") lista.sort((a, b) => b.precio - a.precio);
  if (sortSelect?.value === "name") lista.sort((a, b) => a.nombre.localeCompare(b.nombre));

  renderProductos(lista);
}



// ====================================================================
// 5) CARRITO
// ====================================================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ✔ ACTUALIZA CONTADOR DEL CARRITO EN HEADER
function actualizarContadorCarrito() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;

  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  if (total > 0) {
    badge.classList.remove("d-none");
    badge.textContent = total;
  } else {
    badge.classList.add("d-none");
  }
}

// ✔ CARRITO CORREGIDO
function agregarAlCarrito(id) {
  id = Number(id);

  const item = carrito.find(p => p.id === id);

  if (item) {
    item.cantidad++;
  } else {
    const producto = window.productos.find(p => Number(p.id) === id);

    carrito.push({
      id: id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      imagen: producto.imagen,
      cantidad: 1
    });
  }

  guardarCarrito();
  actualizarContadorCarrito();
}

// Cambios de cantidad
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  renderCarrito();
  actualizarContadorCarrito();
}

function aumentarCantidad(id) {
  const item = carrito.find(p => p.id === id);
  item.cantidad++;
  guardarCarrito();
  renderCarrito();
  actualizarContadorCarrito();
}

function disminuirCantidad(id) {
  const item = carrito.find(p => p.id === id);

  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    eliminarDelCarrito(id);
    return;
  }

  guardarCarrito();
  renderCarrito();
  actualizarContadorCarrito();
}



// ====================================================================
// 6) MOSTRAR CARRITO EN carrito.html
// ====================================================================
function renderCarrito() {
  const cont = document.getElementById("cartList");
  const totalTexto = document.getElementById("cartTotal");

  if (!cont) return;

  cont.innerHTML = "";
  let total = 0;

  carrito.forEach(producto => {

    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    const div = document.createElement("div");
    div.className = "list-group-item d-flex justify-content-between align-items-center";

    div.innerHTML = `
      <div>
        <strong>${producto.nombre}</strong><br>
        $${producto.precio} c/u
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="disminuirCantidad(${producto.id})">−</button>
        <span class="fw-bold">${producto.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="aumentarCantidad(${producto.id})">+</button>
        <span class="ms-3 fw-bold">$${subtotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-danger ms-3" onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
      </div>
    `;

    cont.appendChild(div);
  });

  totalTexto.textContent = "$" + total.toFixed(2);
}



// ====================================================================
// 7) INICIO GLOBAL
// ====================================================================
document.addEventListener("DOMContentLoaded", async () => {

  await cargarProductosDesdeServidor();

  if (document.getElementById("cartList")) {
    renderCarrito();
  }

  actualizarContadorCarrito();

  if (document.getElementById("productGrid")) {
    aplicarFiltros();
  }
});




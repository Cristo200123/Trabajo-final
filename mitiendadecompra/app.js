const API = "api";
const LS_CART = "tienda_cart_v1";
let cart = JSON.parse(localStorage.getItem(LS_CART) || "{}");

function formatPrice(n){ return "$" + Number(n).toFixed(2); }
function showToast(msg, cls="success"){
  const t = document.createElement("div");
  t.className = `toast align-items-center text-white bg-${cls} border-0 show position-fixed bottom-0 end-0 m-3`;
  t.role = "alert";
  t.style.zIndex = 1100;
  t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2500);
}

async function fetchProducts(){
  const q = document.getElementById("search").value || "";
  const sort = document.getElementById("sort").value || "default";
  const res = await fetch(`${API}/getProducts.php?query=${encodeURIComponent(q)}&sort=${encodeURIComponent(sort)}`);
  const data = await res.json();
  if(!data.success) return showToast("Error cargando productos", "danger");
  renderProducts(data.products);
}

function renderProducts(products){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  for(const p of products){
    const col = document.createElement("div");
    col.className = "col-sm-6 col-md-4 col-lg-3";
    col.innerHTML = `
      <div class="card card-product h-100">
        <img src="${p.imagen || 'https://placehold.co/600x400?text=' + encodeURIComponent(p.nombre)}" class="card-img-top" alt="${p.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text product-desc text-muted">${p.descripcion || ""}</p>
          <div class="mt-auto d-flex align-items-center justify-content-between gap-2">
            <div>
              <div class="fw-bold">${formatPrice(p.precio)}</div>
              <div class="text-muted small"><span class="badge bg-${p.stock>0?'success':'secondary'}">${p.stock} stock</span></div>
            </div>
            <div style="min-width:110px">
              <div class="input-group mb-2">
                <button class="btn btn-outline-secondary btn-qty" data-action="dec" data-id="${p.id}"></button>
                <input class="form-control form-control-sm text-center qty-input" type="number" min="1" value="1" data-id="${p.id}">
                <button class="btn btn-outline-secondary btn-qty" data-action="inc" data-id="${p.id}">+</button>
              </div>
              <button class="btn btn-primary btn-add w-100" data-id="${p.id}" ${p.stock===0?'disabled':''}><i class="bi bi-cart-plus"></i> Agregar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  }
  document.querySelectorAll(".btn-add").forEach(b=>{
    b.addEventListener("click", async ()=>{
      const id = b.dataset.id;
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      const qty = Math.max(1, Number(input.value) || 1);
      await addToCart(Number(id), qty);
    });
  });
  document.querySelectorAll(".btn-qty").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      let val = Number(input.value) || 1;
      if(action==="inc") val++; else val = Math.max(1, val-1);
      input.value = val;
    });
  });
}

async function addToCart(productId, qty=1){
  const resp = await fetch(`${API}/getProduct.php?id=${productId}`);
  const json = await resp.json();
  if(!json.success) return showToast("Producto no encontrado", "danger");
  if(json.product.stock < ( (cart[productId] || 0) + qty)) return showToast("Stock insuficiente", "warning");
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart();
  showToast("Producto añadido");
}

const cartCountEl = document.getElementById("cartCount");
function saveCart(){ localStorage.setItem(LS_CART, JSON.stringify(cart)); renderCartCount(); }
function renderCartCount(){
  const qty = Object.values(cart).reduce((a,b)=>a+b,0);
  cartCountEl.textContent = qty;
  if(qty === 0) cartCountEl.classList.add("d-none"); else cartCountEl.classList.remove("d-none");
}

async function renderCartModal(){
  const res = await fetch(`${API}/getProducts.php`);
  const data = await res.json();
  const map = {};
  data.products.forEach(p=>map[p.id]=p);
  const modal = new bootstrap.Modal(document.getElementById("cartModal"));
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  itemsEl.innerHTML = "";
  const ids = Object.keys(cart).map(Number);
  if(ids.length===0){ emptyEl.classList.remove("d-none"); itemsEl.classList.add("d-none"); document.getElementById("cartTotal").textContent = "$0.00"; modal.show(); return; }
  emptyEl.classList.add("d-none"); itemsEl.classList.remove("d-none");
  let total = 0;
  for(const id of ids){
    const p = map[id];
    if(!p) continue;
    const qty = cart[id];
    const subtotal = qty * p.precio;
    total += subtotal;
    const li = document.createElement("div");
    li.className = "list-group-item d-flex align-items-center justify-content-between";
    li.innerHTML = `
      <div>
        <div class="fw-semibold">${p.nombre}</div>
        <div class="small text-muted">${formatPrice(p.precio)} x ${qty} = <strong>${formatPrice(subtotal)}</strong></div>
      </div>
      <div class="d-flex gap-2 align-items-center">
        <input type="number" class="form-control form-control-sm cart-qty-input" style="width:80px" min="1" value="${qty}" data-id="${id}">
        <button class="btn btn-sm btn-outline-danger cart-remove" data-id="${id}"><i class="bi bi-trash"></i></button>
      </div>
    `;
    itemsEl.appendChild(li);
  }
  document.getElementById("cartTotal").textContent = formatPrice(total);
  itemsEl.querySelectorAll(".cart-qty-input").forEach(inp=>{
    inp.addEventListener("change", ()=> {
      const id = Number(inp.dataset.id); const val = Number(inp.value) || 1;
      cart[id]=val; saveCart(); renderCartModal();
    });
  });
  itemsEl.querySelectorAll(".cart-remove").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = Number(btn.dataset.id);
      delete cart[id]; saveCart(); renderCartModal();
    });
  });
  modal.show();
}

async function checkout(){
  if(confirm("Confirmar compra (simulada)?")){
    const resp = await fetch(`${API}/createOrder.php`, {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ cart })
    });
    const json = await resp.json();
    if(json.success){
      cart = {}; saveCart(); renderCartModal(); showToast("Compra realizada (ID: "+json.orderId+")","success");
      fetchProducts();
    } else showToast("Error al procesar compra","danger");
  }
}

async function openAdmin(){
  const adminModal = new bootstrap.Modal(document.getElementById("adminModal"));
  await renderAdmin();
  adminModal.show();
}

async function renderAdmin(){
  const res = await fetch(`${API}/getProducts.php`);
  const data = await res.json();
  const list = document.getElementById("adminList");
  const preview = document.getElementById("adminPreview");
  list.innerHTML = ""; preview.innerHTML = "";
  data.products.forEach(p=>{
    const row = document.createElement("div");
    row.className = "list-group-item d-flex justify-content-between align-items-center";
    row.innerHTML = `<div><div class="fw-semibold">${p.nombre}</div><div class="small text-muted">${formatPrice(p.precio)} — stock: ${p.stock}</div></div>
      <div class="btn-group">
        <button class="btn btn-sm btn-outline-primary admin-edit" data-id="${p.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger admin-delete" data-id="${p.id}"><i class="bi bi-trash"></i></button>
      </div>`;
    list.appendChild(row);
    const col = document.createElement("div"); col.className = "col-sm-6 col-md-4 col-lg-3";
    col.innerHTML = `<div class="card"><img src="${p.imagen||'https://placehold.co/400x250?text=' + encodeURIComponent(p.nombre)}" class="card-img-top"><div class="card-body"><h6>${p.nombre}</h6><p class="small text-muted">${p.descripcion||''}</p><div class="d-flex justify-content-between align-items-center"><span class="fw-bold">${formatPrice(p.precio)}</span><span class="badge bg-${p.stock>0?'success':'secondary'}">${p.stock}</span></div></div></div>`;
    preview.appendChild(col);
  });
  document.querySelectorAll(".admin-edit").forEach(b => b.addEventListener("click", ()=> {
    const id = Number(b.dataset.id); openProductEditor(id);
  }));
  document.querySelectorAll(".admin-delete").forEach(b => b.addEventListener("click", async ()=> {
    const id = Number(b.dataset.id);
    if(!confirm("Eliminar producto?")) return;
    const resp = await fetch(`${API}/deleteProduct.php`, { method: "POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
    const json = await resp.json();
    if(json.success){ showToast("Producto eliminado"); renderAdmin(); fetchProducts(); } else showToast("Error al eliminar","danger");
  }));
}

function openProductEditor(id=null){
  if(id){
    fetch(`${API}/getProduct.php?id=${id}`).then(r=>r.json()).then(j=>{
      if(!j.success) return showToast("Producto no encontrado","danger");
      const p = j.product;
      document.getElementById("productId").value = p.id;
      document.getElementById("productName").value = p.nombre;
      document.getElementById("productPrice").value = p.precio;
      document.getElementById("productStock").value = p.stock;
      document.getElementById("productDesc").value = p.descripcion || "";
      new bootstrap.Modal(document.getElementById("productModal")).show();
    });
  } else {
    document.getElementById("productId").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productStock").value = 1;
    document.getElementById("productDesc").value = "";
    new bootstrap.Modal(document.getElementById("productModal")).show();
  }
}

document.getElementById("productForm")?.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const id = document.getElementById("productId").value || null;
  const payload = {
    nombre: document.getElementById("productName").value.trim(),
    precio: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value),
    descripcion: document.getElementById("productDesc").value.trim()
  };
  const url = id ? `${API}/updateProduct.php` : `${API}/addProduct.php`;
  if(id) payload.id = Number(id);
  const resp = await fetch(url, { method:"POST", headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  const json = await resp.json();
  if(json.success){ showToast(json.message || 'OK'); fetchProducts(); renderAdmin(); new bootstrap.Modal(document.getElementById("productModal")).hide(); }
  else showToast(json.message || 'Error','danger');
});

document.getElementById("checkoutBtn")?.addEventListener("click", async ()=>{
  if(!confirm("Confirmar compra?")) return;
  const resp = await fetch(`${API}/createOrder.php`, {
    method: "POST",
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ cart })
  });
  const j = await resp.json();
  if(j.success){ cart = {}; saveCart(); showToast("Pedido creado ID: "+j.orderId); fetchProducts(); renderCartModal(); } else showToast(j.message||'Error','danger');
});






document.addEventListener("DOMContentLoaded", () => {
  const btnAdmin = document.getElementById("btnAdmin");
  const openAdmin = document.getElementById("openAdmin");

  const goAdmin = () => {
    window.location.href = "admin.html";
  };

  btnAdmin.addEventListener("click", goAdmin);
  openAdmin.addEventListener("click", goAdmin);

});


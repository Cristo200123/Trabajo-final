document.addEventListener("DOMContentLoaded", () => {

  const btnAdd = document.getElementById("btnAddProduct");
  const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  const productForm = document.getElementById("productForm");

  const imgInput = document.getElementById("productImage");
  const preview = document.getElementById("previewImage");

  // Abrir modal
  btnAdd.addEventListener("click", () => {
    productForm.reset();
    preview.classList.add("d-none");
    productModal.show();
  });

  // Previsualizar imagen
  imgInput.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.remove("d-none");
    };
    reader.readAsDataURL(file);
  });

  // Guardar producto 
  productForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Producto guardado (demostración).");
    productModal.hide();
  });

});

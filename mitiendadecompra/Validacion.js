document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita enviar mientras validamos

  let valido = true;

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value.trim();

  // Acceso a los mensajes
  const msgNombre = document.getElementById("error-nombre");
  const msgEmail = document.getElementById("error-email");
  const msgPass = document.getElementById("error-pass");
  const msgExito = document.getElementById("mensaje-exito");

  // Limpiar mensajes anteriores
  msgNombre.textContent = "";
  msgEmail.textContent = "";
  msgPass.textContent = "";
  msgExito.textContent = "";

  // Validación del nombre
  if (nombre.length < 3) {
    msgNombre.textContent = "El nombre debe tener mínimo 3 caracteres.";
    valido = false;
  }

  // Validación del email
  const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!regexEmail.test(email)) {
    msgEmail.textContent = "El correo electrónico no es válido.";
    valido = false;
  }

  // Validación de contraseña
  if (pass.length < 6) {
    msgPass.textContent = "La contraseña debe tener mínimo 6 caracteres.";
    valido = false;
  }

  if (valido) {
    msgExito.textContent = "Formulario enviado correctamente ✔️";


  }
});

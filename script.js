/* ===========================================================
   Camila Nutrición Animal — lógica de agendamiento
   =========================================================== */

/* CONFIGURACIÓN --------------------------------------------------------
   Número de WhatsApp que recibe las solicitudes de cita.
   Formato: código de país + número, sin +, espacios ni guiones.
--------------------------------------------------------------------- */
const WHATSAPP = "573006159887";

document.getElementById("year").textContent = new Date().getFullYear();

/* La fecha mínima seleccionable es hoy */
const fecha = document.getElementById("fecha");
fecha.min = new Date().toISOString().split("T")[0];

const form = document.getElementById("form-cita");
const success = document.getElementById("form-success");

const REGLAS = {
  nombre:   v => v.trim().length >= 3          || "Escribe tu nombre completo.",
  telefono: v => v.replace(/\D/g, "").length >= 7 || "Ingresa un número de contacto válido.",
  email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Ingresa un correo válido.",
  mascota:  v => v.trim().length >= 2          || "Escribe el nombre de tu mascota.",
  especie:  v => v !== ""                      || "Selecciona una especie.",
  servicio: v => v !== ""                      || "Selecciona un servicio.",
  fecha:    v => v !== ""                      || "Elige una fecha.",
  hora:     v => v !== ""                      || "Elige una hora."
};

function validarCampo(id) {
  const input = document.getElementById(id);
  const wrap = input.closest(".field");
  const msg = REGLAS[id](input.value);

  if (msg === true) {
    wrap.classList.remove("is-invalid");
    return true;
  }
  wrap.classList.add("is-invalid");
  wrap.querySelector(".error").textContent = msg;
  return false;
}

/* Limpia el error apenas el usuario corrige */
Object.keys(REGLAS).forEach(id => {
  const input = document.getElementById(id);
  const evento = input.tagName === "SELECT" || input.type === "date" ? "change" : "input";
  input.addEventListener(evento, () => {
    if (input.closest(".field").classList.contains("is-invalid")) validarCampo(id);
  });
});

function fechaLegible(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const campos = Object.keys(REGLAS);
  const primerError = campos.find(id => !validarCampo(id));

  if (primerError) {
    document.getElementById(primerError).focus();
    return;
  }

  const d = Object.fromEntries(new FormData(form).entries());

  const mensaje =
    "Hola, quiero agendar una consulta con Camila Nutrición Animal.\n\n" +
    "• Nombre: " + d.nombre + "\n" +
    "• Teléfono: " + d.telefono + "\n" +
    "• Correo: " + d.email + "\n" +
    "• Mascota: " + d.mascota + " (" + d.especie + ")\n" +
    "• Servicio: " + d.servicio + "\n" +
    "• Modalidad: " + d.modalidad + "\n" +
    "• Fecha preferida: " + fechaLegible(d.fecha) + " a las " + d.hora + "\n" +
    (d.notas.trim() ? "• Motivo: " + d.notas.trim() + "\n" : "") +
    "\nQuedo atento(a) a la confirmación.";

  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensaje), "_blank");

  success.hidden = false;
  success.scrollIntoView({ behavior: "smooth", block: "center" });
  form.reset();
});

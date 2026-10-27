import { Toast } from "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js";

// Lista de datos para relacionar con los botones data-id del HTML
const productos = [
  { id: 1, nombre: "Torta de Chocolate", precio: 45.00 },
  { id: 2, nombre: "Pan de Yema (6 un)", precio: 8.50 },
  { id: 3, nombre: "Caja de Alfajores", precio: 15.00 },
  { id: 4, nombre: "Empanada de Carne", precio: 6.00 },
  { id: 5, nombre: "Pan con Chicharrón", precio: 18.00 },
  { id: 6, nombre: "Ensalada César con Pollo", precio: 22.00 },
  { id: 7, nombre: "Pastel de Acelga", precio: 12.00 },
  { id: 8, nombre: "Sandwich Triple", precio: 9.50 }
];

// Funciones Auxiliares (Semana 10)
const soles = (monto) => `S/ ${monto.toFixed(2)}`;
const sumar = (...numeros) => numeros.reduce((a, n) => a + n, 0);

// REQUERIMIENTO 2: Función flecha para aplicar descuento
const aplicarDescuento = (total, porcentaje = 10) => total * (porcentaje / 100);

// Función recursiva
function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

// Closure del Carrito
function crearCarrito() {
  let items = [];

  return {
    agregar(producto, cantidad = 1) {
      const existe = items.find(it => it.id === producto.id);
      if (existe) {
        existe.cantidad += cantidad;
      } else {
        items.push({ ...producto, cantidad });
      }
      actualizarInterfaz();
      mostrarToast(`¡Agregado!: ${producto.nombre}`);
    },
    obtenerItems: () => items,
    subtotal: () => sumar(...items.map(it => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items)
  };
}

const miCarrito = crearCarrito();

// REQUERIMIENTO 4: Disparar el Toast
function mostrarToast(mensaje) {
  const toastElement = document.getElementById("toastAviso");
  document.getElementById("toastMensaje").textContent = mensaje;
  const toast = Toast.getOrCreateInstance(toastElement);
  toast.show();
}

// Asignar los eventos de clic a cada botón del HTML
function inicializarBotones() {
  document.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.dataset.id);
      const prod = productos.find(p => p.id === id);
      if (prod) {
        miCarrito.agregar(prod);
      }
    });
  });
}

// Actualizar la interfaz del carrito y calcular el descuento si subtotal > 100
function actualizarInterfaz() {
  const listaUI = document.getElementById("listaCarrito");
  const contadorUI = document.getElementById("badgeContador");
  const subtotalUI = document.getElementById("subtotalCarrito");
  const descuentoUI = document.getElementById("montoDescuento");
  const totalUI = document.getElementById("totalCarrito");
  const boxDescuento = document.getElementById("boxDescuento");

  const items = miCarrito.obtenerItems();
  const subtotal = miCarrito.subtotal();
  
  let descuento = 0;
  if (subtotal > 100) {
    descuento = aplicarDescuento(subtotal, 10);
    boxDescuento.style.display = "flex";
    descuentoUI.textContent = `- ${soles(descuento)}`;
  } else {
    boxDescuento.style.display = "none";
  }

  const totalFinal = subtotal - descuento;

  contadorUI.textContent = miCarrito.unidades();
  subtotalUI.textContent = soles(subtotal);
  totalUI.textContent = soles(totalFinal);

  listaUI.innerHTML = items.map(item => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <h6 class="mb-0">${item.nombre}</h6>
        <small class="fg-secondary">${soles(item.precio)} x ${item.cantidad}</small>
      </div>
      <span class="fw-bold">${soles(item.precio * item.cantidad)}</span>
    </li>
  `).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarBotones();
});
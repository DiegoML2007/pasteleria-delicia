import { Drawer } from "https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js";

// Datos de catálogo
const productos = [
  { id: 1, nombre: "Torta de Chocolate", precio: 45.00, categoria: "Tortas" },
  { id: 2, nombre: "Pan de Yema (6 un)", precio: 8.50, categoria: "Panes" },
  { id: 3, nombre: "Caja de Alfajores", precio: 15.00, categoria: "Dulces" },
  { id: 4, nombre: "Empanada de Carne", precio: 6.00, categoria: "Salados" },
];

// Funciones Flecha
const soles = (monto) => `S/ ${monto.toFixed(2)}`;
const sumar = (...numeros) => numeros.reduce((a, n) => a + n, 0);

// Función recursiva para contar ítems
function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

// Closure para el estado privado del carrito
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
    },
    obtenerItems: () => items,
    subtotal: () => sumar(...items.map(it => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items)
  };
}

const miCarrito = crearCarrito();

// Renderizado del catálogo
function renderizarProductos() {
  const contenedor = document.getElementById("contenedorProductos");
  contenedor.innerHTML = productos.map(prod => `
    <div class="col">
      <article class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <span class="badge theme-primary mb-2">${prod.categoria}</span>
            <h5 class="card-title fw-bold">${prod.nombre}</h5>
            <p class="fg-secondary fs-lg font-monospace">${soles(prod.precio)}</p>
          </div>
          <button class="btn btn-solid theme-primary w-100 btn-agregar" data-id="${prod.id}">
            Agregar al Carrito
          </button>
        </div>
      </article>
    </div>
  `).join('');

  // Eventos de botones
  contenedor.querySelectorAll(".btn-agregar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.dataset.id);
      const prod = productos.find(p => p.id === id);
      miCarrito.agregar(prod);
    });
  });
}

// Actualizar DOM del Carrito
function actualizarInterfaz() {
  const listaUI = document.getElementById("listaCarrito");
  const contadorUI = document.getElementById("badgeContador");
  const totalUI = document.getElementById("totalCarrito");

  const items = miCarrito.obtenerItems();
  
  contadorUI.textContent = miCarrito.unidades();
  totalUI.textContent = soles(miCarrito.subtotal());

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

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos();
});
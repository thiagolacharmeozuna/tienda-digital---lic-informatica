<script setup>
import { ref, computed, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ListaProductos from './components/ListaProductos.vue'
import CarritoCompra from './components/CarritoCompra.vue'
import FacturaCompra from './components/FacturaCompra.vue'
import AppFooter from './components/AppFooter.vue'

const nombreTienda = 'Ámbar & Oud'
const contacto = 'ventas@ambaroud.co · WhatsApp +57 300 000 0000'
const anio = new Date().getFullYear()

const img = (nombre) => `${import.meta.env.BASE_URL}img/${nombre}.svg`

// ---------- Estado compartido (solo vive aquí) ----------
const productos = ref([
  { id: 1, marca: 'Dior', descripcion: 'Sauvage Eau de Parfum 100 ml', categoria: 'Diseñador',
    notas: 'Bergamota · Lavanda · Vainilla', imagen: img('sauvage'), valor: 520000, descuento: 10 },
  { id: 2, marca: 'Chanel', descripcion: 'Bleu de Chanel Eau de Parfum 100 ml', categoria: 'Diseñador',
    notas: 'Cítricos · Incienso · Cedro', imagen: img('bleu-chanel'), valor: 590000, descuento: 0 },
  { id: 3, marca: 'Paco Rabanne', descripcion: '1 Million Eau de Toilette 100 ml', categoria: 'Diseñador',
    notas: 'Mandarina · Canela · Cuero', imagen: img('one-million'), valor: 390000, descuento: 15 },
  { id: 4, marca: 'Carolina Herrera', descripcion: 'Good Girl Eau de Parfum 80 ml', categoria: 'Diseñador',
    notas: 'Almendra · Café · Tuberosa', imagen: img('good-girl'), valor: 480000, descuento: 0 },
  { id: 5, marca: 'Yves Saint Laurent', descripcion: 'Libre Eau de Parfum 90 ml', categoria: 'Diseñador',
    notas: 'Lavanda · Azahar · Vainilla', imagen: img('libre'), valor: 530000, descuento: 12 },
  { id: 6, marca: 'Versace', descripcion: 'Eros Eau de Toilette 100 ml', categoria: 'Diseñador',
    notas: 'Menta · Manzana verde · Vainilla', imagen: img('eros'), valor: 340000, descuento: 20 },
  { id: 7, marca: 'Lattafa', descripcion: 'Khamrah Eau de Parfum 100 ml', categoria: 'Árabe',
    notas: 'Canela · Dátil · Praliné', imagen: img('khamrah'), valor: 185000, descuento: 15 },
  { id: 8, marca: 'Lattafa', descripcion: 'Yara Eau de Parfum 100 ml', categoria: 'Árabe',
    notas: 'Orquídea · Heliotropo · Vainilla', imagen: img('yara'), valor: 135000, descuento: 10 },
  { id: 9, marca: 'Afnan', descripcion: '9PM Eau de Parfum 100 ml', categoria: 'Árabe',
    notas: 'Manzana · Canela · Vainilla', imagen: img('9pm'), valor: 165000, descuento: 0 },
  { id: 10, marca: 'Armaf', descripcion: 'Club de Nuit Intense Man 105 ml', categoria: 'Árabe',
    notas: 'Limón · Piña · Abedul', imagen: img('club-de-nuit'), valor: 175000, descuento: 18 },
  { id: 11, marca: 'Al Haramain', descripcion: 'Amber Oud Gold Edition 120 ml', categoria: 'Árabe',
    notas: 'Melón · Piña · Ámbar', imagen: img('amber-oud'), valor: 240000, descuento: 0 },
  { id: 12, marca: 'Rasasi', descripcion: 'Hawas for Him 100 ml', categoria: 'Árabe',
    notas: 'Manzana · Canela · Ámbar', imagen: img('hawas'), valor: 210000, descuento: 25 }
])

const carrito = ref([]) // [{ producto, cantidad }]
const mostrarFactura = ref(false)
const consecutivo = ref(1)
const fechaFactura = ref('')

const numeroFactura = computed(() => 'FAC-' + String(consecutivo.value).padStart(4, '0'))

const cantidadItems = computed(() => carrito.value.reduce((total, item) => total + item.cantidad, 0))

// ---------- Acciones que piden los hijos ----------
function agregarProducto(producto) {
  const existente = carrito.value.find((item) => item.producto.id === producto.id)

  if (existente) {
    existente.cantidad++
  } else {
    carrito.value.push({ producto, cantidad: 1 })
  }

  avisar(`${producto.marca} ${producto.descripcion} se agregó al carrito`)
}

function incrementar(id) {
  const item = carrito.value.find((i) => i.producto.id === id)
  if (item) item.cantidad++
}

function decrementar(id) {
  const item = carrito.value.find((i) => i.producto.id === id)
  if (item && item.cantidad > 1) item.cantidad--
}

function eliminar(id) {
  carrito.value = carrito.value.filter((i) => i.producto.id !== id)
}

function finalizarCompra() {
  if (carrito.value.length === 0) return

  const texto = new Date().toLocaleString('es-CO', { dateStyle: 'full', timeStyle: 'short' })
  fechaFactura.value = texto.charAt(0).toUpperCase() + texto.slice(1)
  mostrarFactura.value = true
}

function nuevaCompra() {
  carrito.value = []
  mostrarFactura.value = false
  consecutivo.value++
}

function verCarrito() {
  document.getElementById('carrito')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// ---------- Aviso al agregar ----------
const aviso = ref('')
let temporizador = null

function avisar(texto) {
  aviso.value = texto
  clearTimeout(temporizador)
  temporizador = setTimeout(() => (aviso.value = ''), 2200)
}

// Evita que la página de atrás se desplace mientras la factura está abierta
watch(mostrarFactura, (abierta) => {
  document.body.style.overflow = abierta ? 'hidden' : ''
})
</script>

<template>
  <div class="sitio">
    <AppHeader :nombre-tienda="nombreTienda" :cantidad-items="cantidadItems" @ver-carrito="verCarrito" />

    <main class="contenedor principal">
      <ListaProductos :productos="productos" @agregar-producto="agregarProducto" />

      <CarritoCompra
        :items="carrito"
        @incrementar="incrementar"
        @decrementar="decrementar"
        @eliminar="eliminar"
        @finalizar-compra="finalizarCompra"
      />
    </main>

    <AppFooter :nombre-tienda="nombreTienda" :anio="anio" :contacto="contacto" />
  </div>

  <FacturaCompra
    v-if="mostrarFactura"
    :items="carrito"
    :numero-factura="numeroFactura"
    :fecha="fechaFactura"
    @nueva-compra="nuevaCompra"
  />

  <Transition name="aviso">
    <p v-if="aviso" class="aviso" role="status">{{ aviso }}</p>
  </Transition>
</template>

<style scoped>
.principal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: start;
}

.aviso {
  position: fixed;
  left: 50%;
  bottom: 1.5rem;
  transform: translateX(-50%);
  z-index: 40;
  max-width: min(92vw, 460px);
  background: var(--oud);
  color: #f4ead6;
  font-size: 0.88rem;
  padding: 0.8rem 1.2rem;
  border-left: 3px solid var(--laton-claro);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.5);
}

.aviso-enter-active,
.aviso-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.aviso-enter-from,
.aviso-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 1080px) {
  .principal {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

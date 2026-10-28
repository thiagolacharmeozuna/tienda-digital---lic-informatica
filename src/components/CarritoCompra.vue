<script setup>
import { computed } from 'vue'
import { formatearCOP } from '../utils/moneda'
import { valorConDescuento, calcularTotales } from '../utils/calculos'

const props = defineProps({
  items: { type: Array, default: () => [] }
})

const emit = defineEmits(['incrementar', 'decrementar', 'eliminar', 'finalizar-compra'])

const vacio = computed(() => props.items.length === 0)
const totales = computed(() => calcularTotales(props.items))
</script>

<template>
  <aside id="carrito" class="carrito" aria-labelledby="titulo-carrito">
    <div class="cabecera">
      <p class="etiqueta">Tu pedido</p>
      <h2 id="titulo-carrito">Carrito</h2>
    </div>

    <div v-if="vacio" class="mensaje-vacio">
      <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8z" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      </svg>
      <p>Tu carrito está vacío.</p>
      <p class="pista">Elige un perfume del catálogo para empezar.</p>
    </div>

    <ul v-else class="lista">
      <li v-for="item in items" :key="item.producto.id" class="fila">
        <img :src="item.producto.imagen" :alt="item.producto.descripcion" />

        <div class="datos">
          <p class="marca">{{ item.producto.marca }}</p>
          <p class="nombre">{{ item.producto.descripcion }}</p>
          <p class="unitario">
            {{ formatearCOP(valorConDescuento(item.producto)) }}
            <span v-if="item.producto.descuento > 0" class="ahorro">-{{ item.producto.descuento }}%</span>
          </p>

          <div class="control">
            <div class="cantidad">
              <button
                type="button"
                :disabled="item.cantidad <= 1"
                :aria-label="`Disminuir cantidad de ${item.producto.descripcion}`"
                @click="emit('decrementar', item.producto.id)"
              >
                &minus;
              </button>
              <span aria-live="polite">{{ item.cantidad }}</span>
              <button
                type="button"
                :aria-label="`Aumentar cantidad de ${item.producto.descripcion}`"
                @click="emit('incrementar', item.producto.id)"
              >
                +
              </button>
            </div>

            <button type="button" class="quitar" @click="emit('eliminar', item.producto.id)">Quitar</button>
          </div>
        </div>

        <p class="linea">{{ formatearCOP(valorConDescuento(item.producto) * item.cantidad) }}</p>
      </li>
    </ul>

    <dl class="totales">
      <div>
        <dt>Subtotal</dt>
        <dd>{{ formatearCOP(totales.subtotal) }}</dd>
      </div>
      <div class="menos">
        <dt>Descuentos</dt>
        <dd>- {{ formatearCOP(totales.descuentos) }}</dd>
      </div>
      <div class="total">
        <dt>Total</dt>
        <dd>{{ formatearCOP(totales.total) }}</dd>
      </div>
    </dl>
    <p class="nota-iva">El IVA del 19 % se calcula en la factura.</p>

    <button class="btn finalizar" type="button" :disabled="vacio" @click="emit('finalizar-compra')">
      Finalizar compra
    </button>
  </aside>
</template>

<style scoped>
.carrito {
  background: var(--papel);
  border: 1px solid var(--linea);
  padding: 1.6rem;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
}

.cabecera {
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--linea);
}

h2 {
  font-size: 2rem;
  color: var(--oud);
  margin-top: 0.2rem;
}

.mensaje-vacio {
  text-align: center;
  padding: 2.4rem 1rem;
  color: var(--tinta-suave);
}

.mensaje-vacio svg {
  color: var(--laton);
  margin: 0 auto 0.8rem;
}

.pista {
  font-size: 0.88rem;
  margin-top: 0.2rem;
}

.lista {
  list-style: none;
  margin: 0;
  padding: 0;
}

.fila {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.9rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--linea);
}

.fila img {
  width: 64px;
  height: 80px;
  object-fit: cover;
  border: 1px solid var(--linea);
}

.marca {
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--laton-oscuro);
}

.nombre {
  font-family: var(--serif);
  font-size: 1.08rem;
  font-weight: 600;
  line-height: 1.15;
  color: var(--oud);
}

.unitario {
  font-size: 0.82rem;
  color: var(--tinta-suave);
  margin-top: 0.15rem;
}

.ahorro {
  color: var(--terracota);
  font-weight: 600;
  margin-left: 0.3rem;
}

.control {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-top: 0.55rem;
}

.cantidad {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--linea);
}

.cantidad button {
  width: 1.9rem;
  height: 1.9rem;
  background: transparent;
  border: 0;
  font-size: 1.05rem;
  line-height: 1;
}

.cantidad button:hover:not(:disabled) {
  background: var(--oud);
  color: var(--papel);
}

.cantidad button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.cantidad span {
  min-width: 2rem;
  text-align: center;
  font-size: 0.92rem;
  font-weight: 500;
}

.quitar {
  background: none;
  border: 0;
  padding: 0;
  font-size: 0.76rem;
  color: var(--tinta-suave);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.quitar:hover {
  color: var(--terracota);
}

.linea {
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.totales {
  margin: 1.1rem 0 0;
}

.totales div {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.95rem;
}

.totales dt,
.totales dd {
  margin: 0;
}

.menos dd {
  color: var(--terracota);
}

.totales .total {
  margin-top: 0.4rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--oud);
}

.total dt {
  font-family: var(--serif);
  font-size: 1.35rem;
  font-weight: 700;
}

.total dd {
  font-size: 1.3rem;
  font-weight: 600;
}

.nota-iva {
  font-size: 0.78rem;
  color: var(--tinta-suave);
  margin: 0.2rem 0 1.2rem;
}

.finalizar {
  width: 100%;
  padding: 1rem;
}

@media (max-width: 1080px) {
  .carrito {
    position: static;
    max-height: none;
  }
}
</style>

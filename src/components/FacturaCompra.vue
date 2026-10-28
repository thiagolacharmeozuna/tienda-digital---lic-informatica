<script setup>
import { computed, onMounted, ref } from 'vue'
import { formatearCOP } from '../utils/moneda'
import { valorConDescuento, calcularTotales, TASA_IVA } from '../utils/calculos'

const props = defineProps({
  items: { type: Array, required: true },
  numeroFactura: { type: String, required: true },
  fecha: { type: String, required: true }
})

const emit = defineEmits(['nueva-compra'])

const filas = computed(() =>
  props.items.map(({ producto, cantidad }) => {
    const unitarioFinal = valorConDescuento(producto)
    return {
      id: producto.id,
      descripcion: `${producto.marca} · ${producto.descripcion}`,
      cantidad,
      valor: producto.valor,
      descuento: producto.descuento,
      unitarioFinal,
      subtotal: unitarioFinal * cantidad
    }
  })
)

const totales = computed(() => calcularTotales(props.items))
const iva = computed(() => Math.round(totales.value.total * TASA_IVA))
const totalPagar = computed(() => totales.value.total + iva.value)

function imprimir() {
  window.print()
}

const botonNueva = ref(null)
onMounted(() => botonNueva.value?.focus())
</script>

<template>
  <div class="fondo" role="dialog" aria-modal="true" aria-labelledby="titulo-factura">
    <article class="factura">
      <header class="encabezado">
        <div>
          <p class="marca">Ámbar <em>&amp;</em> Oud</p>
          <p class="datos-tienda">Perfumería · Colombia</p>
        </div>
        <div class="identificacion">
          <p class="etiqueta">Factura de venta</p>
          <h2 id="titulo-factura">{{ numeroFactura }}</h2>
          <p class="fecha">{{ fecha }}</p>
        </div>
      </header>

      <dl class="cliente">
        <div>
          <dt>Cliente</dt>
          <dd>Consumidor final</dd>
        </div>
        <div>
          <dt>Moneda</dt>
          <dd>Peso colombiano (COP)</dd>
        </div>
      </dl>

      <div class="contenedor-tabla">
        <table>
          <thead>
            <tr>
              <th class="izq">Descripción</th>
              <th>Cant.</th>
              <th>Valor unitario</th>
              <th>Desc.</th>
              <th>Valor con desc.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in filas" :key="f.id">
              <td class="izq">{{ f.descripcion }}</td>
              <td>{{ f.cantidad }}</td>
              <td>{{ formatearCOP(f.valor) }}</td>
              <td>{{ f.descuento }} %</td>
              <td>{{ formatearCOP(f.unitarioFinal) }}</td>
              <td class="fuerte">{{ formatearCOP(f.subtotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl class="resumen">
        <div>
          <dt>Subtotal sin descuento</dt>
          <dd>{{ formatearCOP(totales.subtotal) }}</dd>
        </div>
        <div class="menos">
          <dt>Total descuentos</dt>
          <dd>- {{ formatearCOP(totales.descuentos) }}</dd>
        </div>
        <div>
          <dt>Base gravable</dt>
          <dd>{{ formatearCOP(totales.total) }}</dd>
        </div>
        <div>
          <dt>IVA (19 %)</dt>
          <dd>{{ formatearCOP(iva) }}</dd>
        </div>
        <div class="pagar">
          <dt>Total a pagar</dt>
          <dd>{{ formatearCOP(totalPagar) }}</dd>
        </div>
      </dl>

      <p class="gracias">Gracias por tu compra. Conserva esta factura como soporte de originalidad.</p>

      <div class="acciones">
        <button class="btn btn-borde" type="button" @click="imprimir">Imprimir</button>
        <button ref="botonNueva" class="btn" type="button" @click="emit('nueva-compra')">Nueva compra</button>
      </div>
    </article>
  </div>
</template>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  z-index: 50;
  overflow-y: auto;
  background: rgba(31, 26, 21, 0.72);
  padding: clamp(0.8rem, 3vw, 2.5rem);
}

.factura {
  max-width: 860px;
  margin: 0 auto;
  background: var(--papel);
  padding: clamp(1.3rem, 4vw, 3rem);
  border-top: 5px solid var(--laton);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.55);
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid var(--linea);
}

.marca {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--oud);
}

.marca em {
  color: var(--laton);
  font-weight: 500;
}

.datos-tienda {
  font-size: 0.85rem;
  color: var(--tinta-suave);
}

.identificacion {
  text-align: right;
}

h2 {
  font-size: 2.1rem;
  color: var(--oud);
  margin: 0.15rem 0;
}

.fecha {
  font-size: 0.88rem;
  color: var(--tinta-suave);
}

.cliente {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  margin: 1.2rem 0 1.5rem;
}

.cliente dt {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--laton-oscuro);
}

.cliente dd {
  margin: 0.1rem 0 0;
}

.contenedor-tabla {
  overflow-x: auto;
}

table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  text-align: right;
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--tinta-suave);
  padding: 0.6rem 0.6rem;
  border-bottom: 1px solid var(--oud);
}

td {
  text-align: right;
  padding: 0.8rem 0.6rem;
  border-bottom: 1px solid var(--linea);
  font-variant-numeric: tabular-nums;
}

.izq {
  text-align: left;
}

th.izq {
  padding-left: 0;
}

td.izq {
  padding-left: 0;
  font-family: var(--serif);
  font-size: 1.05rem;
  font-weight: 600;
}

.fuerte {
  font-weight: 600;
}

.resumen {
  width: min(100%, 340px);
  margin: 1.4rem 0 0 auto;
}

.resumen div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.3rem 0;
  font-size: 0.95rem;
}

.resumen dt,
.resumen dd {
  margin: 0;
}

.menos dd {
  color: var(--terracota);
}

.resumen .pagar {
  margin-top: 0.6rem;
  padding: 0.9rem 0 0;
  border-top: 2px solid var(--oud);
}

.pagar dt {
  font-family: var(--serif);
  font-size: 1.4rem;
  font-weight: 700;
}

.pagar dd {
  font-size: 1.35rem;
  font-weight: 600;
}

.gracias {
  margin-top: 1.8rem;
  font-family: var(--serif);
  font-style: italic;
  font-size: 1.1rem;
  color: var(--tinta-suave);
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-top: 1.6rem;
  padding-top: 1.4rem;
  border-top: 1px solid var(--linea);
}

@media (max-width: 520px) {
  .identificacion {
    text-align: left;
  }

  .acciones .btn {
    flex: 1;
  }
}

@media print {
  .fondo {
    position: static;
    background: none;
    padding: 0;
    overflow: visible;
  }

  .factura {
    box-shadow: none;
    max-width: none;
    padding: 0;
  }

  .acciones {
    display: none;
  }
}
</style>

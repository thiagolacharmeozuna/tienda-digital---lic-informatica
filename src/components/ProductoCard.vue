<script setup>
import { computed } from 'vue'
import { formatearCOP } from '../utils/moneda'

const props = defineProps({
  producto: {
    type: Object,
    required: true,
    validator: (p) => ['id', 'imagen', 'descripcion', 'valor', 'descuento'].every((k) => k in p)
  }
})

const emit = defineEmits(['agregar-al-carrito'])

const tieneDescuento = computed(() => props.producto.descuento > 0)

const valorConDescuento = computed(() =>
  Math.round(props.producto.valor * (1 - props.producto.descuento / 100))
)
</script>

<template>
  <article class="tarjeta">
    <div class="foto">
      <img :src="producto.imagen" :alt="`${producto.marca} ${producto.descripcion}`" loading="lazy" />
      <span v-if="tieneDescuento" class="descuento">-{{ producto.descuento }}%</span>
      <span class="categoria">{{ producto.categoria }}</span>
    </div>

    <div class="cuerpo">
      <p class="marca">{{ producto.marca }}</p>
      <h3>{{ producto.descripcion }}</h3>
      <p class="notas">{{ producto.notas }}</p>

      <div class="precios">
        <span v-if="tieneDescuento" class="tachado">{{ formatearCOP(producto.valor) }}</span>
        <span class="final">{{ formatearCOP(valorConDescuento) }}</span>
      </div>

      <button class="btn comprar" type="button" @click="emit('agregar-al-carrito', producto)">
        Comprar
      </button>
    </div>
  </article>
</template>

<style scoped>
.tarjeta {
  display: flex;
  flex-direction: column;
  background: var(--papel);
  border: 1px solid var(--linea);
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}

.tarjeta:hover {
  border-color: var(--laton);
  transform: translateY(-3px);
  box-shadow: 0 18px 30px -22px rgba(35, 26, 19, 0.6);
}

.foto {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-bottom: 1px solid var(--linea);
}

.foto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.tarjeta:hover .foto img {
  transform: scale(1.04);
}

.descuento {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--terracota);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding: 0.35rem 0.7rem;
}

.categoria {
  position: absolute;
  right: 0.6rem;
  bottom: 0.6rem;
  background: rgba(251, 248, 242, 0.92);
  color: var(--oud);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
}

.cuerpo {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem 1.1rem 1.2rem;
}

.marca {
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--laton-oscuro);
}

h3 {
  font-size: 1.32rem;
  margin: 0.3rem 0 0.4rem;
  color: var(--oud);
}

.notas {
  font-family: var(--serif);
  font-style: italic;
  font-size: 1rem;
  color: var(--tinta-suave);
  margin-bottom: 1rem;
}

.precios {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.2rem 0.7rem;
  margin-top: auto;
  margin-bottom: 0.9rem;
}

.tachado {
  color: #8d8174;
  text-decoration: line-through;
  font-size: 0.88rem;
}

.final {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--oud);
}

.comprar {
  width: 100%;
}

@media (max-width: 560px) {
  .cuerpo {
    padding: 0.8rem 0.8rem 1rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  .notas {
    font-size: 0.9rem;
  }

  .final {
    font-size: 1.05rem;
  }

  .comprar {
    padding: 0.75rem 0.4rem;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
  }
}
</style>

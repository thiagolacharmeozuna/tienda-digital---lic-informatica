<script setup>
import { ref, computed } from 'vue'
import ProductoCard from './ProductoCard.vue'

const props = defineProps({
  productos: { type: Array, required: true }
})

const emit = defineEmits(['agregar-producto'])

// El filtro solo afecta lo que se ve en esta lista, por eso vive aquí y no en App.vue
const filtroActivo = ref('Todos')
const filtros = ['Todos', 'Diseñador', 'Árabe']

const visibles = computed(() =>
  filtroActivo.value === 'Todos'
    ? props.productos
    : props.productos.filter((p) => p.categoria === filtroActivo.value)
)
</script>

<template>
  <section id="catalogo" class="catalogo" aria-labelledby="titulo-catalogo">
    <div class="cabecera">
      <div>
        <p class="etiqueta">Colección</p>
        <h2 id="titulo-catalogo">Catálogo</h2>
      </div>

      <div class="filtros" role="group" aria-label="Filtrar por tipo de perfume">
        <button
          v-for="f in filtros"
          :key="f"
          type="button"
          class="filtro"
          :class="{ activo: filtroActivo === f }"
          :aria-pressed="filtroActivo === f"
          @click="filtroActivo = f"
        >
          {{ f }}
        </button>
      </div>
    </div>

    <div class="rejilla">
      <ProductoCard
        v-for="p in visibles"
        :key="p.id"
        :producto="p"
        @agregar-al-carrito="emit('agregar-producto', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.cabecera {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1.2rem;
  margin-bottom: 1.8rem;
  border-bottom: 1px solid var(--linea);
}

h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  color: var(--oud);
  margin-top: 0.3rem;
}

.filtros {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filtro {
  background: transparent;
  border: 1px solid var(--linea);
  padding: 0.5rem 1rem;
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: all 0.2s;
}

.filtro:hover {
  border-color: var(--oud);
}

.filtro.activo {
  background: var(--oud);
  border-color: var(--oud);
  color: var(--papel);
}

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.4rem;
}

@media (max-width: 560px) {
  .rejilla {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
  }
}
</style>

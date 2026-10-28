<script setup>
defineProps({
  nombreTienda: { type: String, required: true },
  anio: { type: Number, required: true },
  contacto: { type: String, required: true }
})
</script>

<template>
  <footer class="pie">
    <div class="contenedor columnas">
      <div>
        <p class="nombre">{{ nombreTienda }}</p>
        <p class="texto">
          Perfumería de nicho y diseñador. Cada frasco llega sellado, con su empaque original y
          factura de compra.
        </p>
      </div>

      <div>
        <p class="titulo">Contacto</p>
        <p class="texto">{{ contacto }}</p>
        <p class="texto">Lunes a sábado · 9:00 a. m. a 6:00 p. m.</p>
      </div>

      <div>
        <p class="titulo">Compra</p>
        <p class="texto">Precios en pesos colombianos (COP).</p>
        <p class="texto">El IVA del 19 % se discrimina en la factura.</p>
      </div>
    </div>

    <div class="contenedor legal">
      <span>&copy; {{ anio }} {{ nombreTienda }}. Proyecto académico.</span>
      <span>Hecho con Vue 3</span>
    </div>
  </footer>
</template>

<style scoped>
.pie {
  background: var(--oud);
  color: #d9ccb4;
  margin-top: clamp(3rem, 7vw, 6rem);
  padding-top: 3.5rem;
}

.columnas {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
}

.nombre {
  font-family: var(--serif);
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4ead6;
  margin-bottom: 0.6rem;
}

.titulo {
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--laton-claro);
  margin-bottom: 0.8rem;
}

.texto {
  font-size: 0.92rem;
  max-width: 28rem;
  margin-bottom: 0.3rem;
}

.legal {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.2rem;
  padding-bottom: 1.6rem;
  border-top: 1px solid rgba(217, 204, 180, 0.2);
  font-size: 0.8rem;
  color: #a99c85;
}

@media (max-width: 760px) {
  .columnas {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
}
</style>

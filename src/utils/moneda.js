// Formato de moneda en pesos colombianos (sin decimales)
const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

export function formatearCOP(valor) {
  return formatoCOP.format(valor)
}

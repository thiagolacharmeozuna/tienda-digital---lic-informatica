// Funciones puras para los cálculos del carrito y la factura.
// No guardan estado: reciben datos y devuelven resultados.

export const TASA_IVA = 0.19

export function valorConDescuento(producto) {
  return Math.round(producto.valor * (1 - producto.descuento / 100))
}

// items: [{ producto, cantidad }]
export function calcularTotales(items) {
  let bruto = 0
  let conDescuento = 0

  for (const { producto, cantidad } of items) {
    bruto += producto.valor * cantidad
    conDescuento += valorConDescuento(producto) * cantidad
  }

  return {
    subtotal: bruto,
    descuentos: bruto - conDescuento,
    total: conDescuento
  }
}

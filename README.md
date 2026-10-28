# Ámbar & Oud · Tienda virtual por componentes

#Integrantes
thiago lacharme ozuna
isaac miranda castillo
alejandro kelsey galvan

Actividad práctica de **Fundamentos de programación · Vue 3**: comunicación entre componentes con
`props` y `emits`. Tienda de perfumes originales (árabes y de diseñador) con catálogo, carrito de
compras y factura en pesos colombianos.

## Cómo ejecutarlo

Requiere Node.js LTS.

```bash
npm install
npm run dev       # servidor de desarrollo
npm run build     # versión de producción en /dist
npm run preview   # probar la versión de producción
```

## Estructura

```
src/
├── App.vue                      ← único dueño del estado compartido
├── main.js
├── style.css                    ← variables y estilos globales
├── components/
│   ├── AppHeader.vue
│   ├── ListaProductos.vue
│   ├── ProductoCard.vue         (se repite con v-for)
│   ├── CarritoCompra.vue
│   ├── FacturaCompra.vue        (se muestra con v-if)
│   └── AppFooter.vue
└── utils/
    ├── moneda.js                ← Intl.NumberFormat("es-CO", COP)
    └── calculos.js              ← funciones puras (descuento y totales)
public/img/                      ← 12 ilustraciones de frascos (SVG)
```

## Contrato de comunicación

| Componente | Props | Emits |
| --- | --- | --- |
| AppHeader | `nombreTienda` (String), `cantidadItems` (Number) | `ver-carrito` |
| ListaProductos | `productos` (Array) | `agregar-producto` (producto) |
| ProductoCard | `producto` (Object) | `agregar-al-carrito` (producto) |
| CarritoCompra | `items` (Array) | `incrementar` (id), `decrementar` (id), `eliminar` (id), `finalizar-compra` |
| FacturaCompra | `items` (Array), `numeroFactura` (String), `fecha` (String) | `nueva-compra` |
| AppFooter | `nombreTienda` (String), `anio` (Number), `contacto` (String) | — |

El evento del botón de compra sube así: `ProductoCard` → `ListaProductos` (lo reenvía) → `App.vue`.

## Reglas de negocio

- **Valor con descuento** = `valor × (1 − descuento / 100)`, redondeado al peso. En `ProductoCard`
  se calcula con `computed`.
- Si el producto ya está en el carrito, se incrementa la cantidad (no se duplica).
- El botón de disminuir se deshabilita en 1; para sacar el producto se usa "Quitar".
- Carrito vacío: mensaje informativo y botón "Finalizar compra" deshabilitado.
- **IVA del 19 %**: se calcula sobre el valor ya descontado (base gravable) y se suma al final.
  `Total a pagar = base gravable + IVA`.
- Número de factura consecutivo (`FAC-0001`, `FAC-0002`…). "Nueva compra" vacía el carrito, oculta
  la factura y avanza el consecutivo.
- Catálogo: 12 productos, 8 con descuento.

## Restricciones cumplidas

- `<script setup>` con `defineProps` y `defineEmits` declarados en cada componente.
- Ninguna prop se modifica dentro de un hijo; todo cambio se pide al padre con un evento.
- Sin Pinia, Vuex, `provide/inject`, event bus ni variables globales.
- Eventos en kebab-case, componentes en PascalCase, `:key` único en cada `v-for`.
- Diseño adaptable a celular, tableta y computador.

## Cambiar productos o imágenes

Los productos están en el arreglo `productos` de `src/App.vue`. Para usar fotos reales, guarda los
archivos en `public/img/` y cambia el campo `imagen` de cada producto (por ejemplo
`img('mi-foto')` si el archivo es `public/img/mi-foto.svg`; si es `.jpg` o `.png`, escribe la ruta
completa con `import.meta.env.BASE_URL`).

Los precios son de referencia para la actividad.

## Subir a GitHub

```bash
git init
git add .
git commit -m "Fase 1: proyecto con Vite y arreglo de productos"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ambar-oud-tienda.git
git push -u origin main
```

Se recomienda hacer un commit por fase (Preparación, Presentación, Interacción, Carrito, Factura,
Cierre) para evidenciar el avance.

## Despliegue opcional

- **Netlify / Vercel**: importar el repositorio. Comando `npm run build`, carpeta `dist`.
- **GitHub Pages**: subir el contenido de `dist` a la rama `gh-pages` (el proyecto ya usa
  `base: './'`, así que las rutas funcionan en subcarpetas).

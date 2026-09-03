# TechStore — Lo Ùltimo en Tecnologìa *

Landing page de e-commerce para una tienda de accesorios tecnológicos. Proyecto web estático construido con **HTML semántico**, **CSS moderno** y **JavaScript vanilla**.

---

## Descripción *

TechStore es una página de presentación tipo tienda online que incluye catálogo de productos, ofertas flash, blog, testimonios, FAQ, formulario de contacto y newsletter. Está pensada como frontend estático, sin backend ni base de datos.

---

## Tecnologías *

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica y accesibilidad (ARIA, roles) |
| CSS3 | Variables CSS, Grid, Flexbox, animaciones, responsive |
| JavaScript (ES6+) | Interactividad del cliente |
| Google Fonts | Tipografía [Inter](https://fonts.google.com/specimen/Inter) |
| Font Awesome 6 | Iconos (CDN) |

---

## Estructura del proyecto *

```
miweb/
├── assets/                  # Imágenes locales (15 archivos)
│   ├── hero-gadgets.jpg
│   ├── product-smartwatch.webp
│   ├── product-headphones.jpg
│   ├── product-camera.jpg
│   ├── product-shoes.jpg
│   ├── product-speaker.jpg
│   ├── product-watch.jpg
│   ├── flash-sale.jpg
│   ├── testimonial-maria.jpg
│   ├── testimonial-carlos.jpg
│   ├── testimonial-laura.jpg
│   ├── blog-gadgets.jpg
│   ├── blog-headphones.jpg
│   ├── blog-smartwatch.jpg
│   └── newsletter.jpg
├── index.html               # Página principal
├── style.css                # Estilos globales y componentes
├── main.js                  # Lógica e interactividad
├── .gitignore
└── README.md
```

---

## Secciones de la página *

| Sección | ID | Descripción |
|---------|-----|-------------|
| Header | — | Navegación sticky con glassmorphism, búsqueda, carrito y menú móvil |
| Hero | `#inicio` | Banner principal con CTA, estadísticas y tarjetas flotantes |
| Beneficios | — | Envío, devoluciones, pago seguro y soporte 24/7 |
| Marcas | — | Carrusel infinito de marcas asociadas |
| Productos | `#productos` | Catálogo con filtros por categoría (Gadgets, Audio, Accesorios) |
| Ofertas Flash | `#ofertas` | Banner promocional con cuenta regresiva hasta medianoche |
| Testimonios | — | Reseñas de clientes verificados |
| Blog | `#blog` | Artículos recientes con categorías |
| FAQ | — | Preguntas frecuentes en acordeón |
| Contacto | `#contacto` | Información de contacto y formulario |
| Newsletter | — | Suscripción con descuento del 10% |
| Footer | — | Enlaces, redes sociales y métodos de pago |

---

## Funcionalidades JavaScript (`main.js`)

- **Menú móvil** — Hamburguesa con toggle y `aria-expanded`
- **Header al scroll** — Sombra y fondo al bajar la página
- **Botón volver arriba** — Aparece tras 400px de scroll
- **Modal de búsqueda** — `<dialog>` nativo al pulsar la lupa
- **Filtros de productos** — Filtrado por categoría con animación fade-in
- **Carrito** — Contador dinámico + toast de confirmación
- **FAQ acordeón** — Una pregunta abierta a la vez
- **Countdown** — Temporizador de oferta flash hasta medianoche
- **Scroll reveal** — Animaciones al entrar elementos en viewport (`IntersectionObserver`)
- **Nav activo** — Resalta el enlace de la sección visible

---

## Cómo ejecutar el proyecto

No requiere instalación de dependencias. Opciones:

### Opción 1 — Abrir directamente

Abre `index.html` en tu navegador (doble clic o arrastrar al navegador).

### Opción 2 — Servidor local (recomendado)

Con Python:

```bash
python -m http.server 8000
```

Con Node.js (npx):

```bash
npx serve .
```

Luego visita `http://localhost:8000`.

---

## Diseño y CSS

- **Variables CSS** para colores, espaciado, sombras y transiciones
- **Paleta**: índigo (`#6366f1`) como primario, ámbar (`#f59e0b`) como secundario
- **Responsive**: breakpoints en 1024px, 768px y 480px
- **Accesibilidad**: clase `.sr-only`, `prefers-reduced-motion`, etiquetas ARIA
- **Efectos**: glassmorphism, gradientes, hover en tarjetas, marquee de marcas

---

## Historial de cambios

### Mejoras iniciales
- Secciones nuevas: Ofertas Flash, Blog, FAQ y Contacto
- Carrusel de marcas y filtros de productos por categoría
- Modal de búsqueda, toast de carrito y botón volver arriba
- Animaciones al scroll y navegación activa por sección
- Corrección de typo en testimonios ("Comprador verificado")

### Refactor JavaScript
- Todo el JavaScript inline se movió de `index.html` a `main.js`
- El HTML referencia el script con `<script src="main.js" defer></script>`

### Assets locales
- Las 15 imágenes externas (Unsplash, randomuser.me, MercadoLibre) se descargaron a `assets/`
- Todas las rutas en `index.html` apuntan ahora a `assets/` en lugar de URLs externas

---

## Próximos pasos posibles

- [ ] Organizar CSS/JS en subcarpetas (`css/`, `js/`) **Listo**
- [ ] Localizar Font Awesome y Google Fonts **Listo**
- [ ] Modo oscuro
- [ ] Carrito lateral desplegable
- [ ] Backend para formularios y pagos reales
- [ ] Despliegue en GitHub Pages, Netlify o Vercel

---

## Licencia

Proyecto educativo. Las imágenes en `assets/` provienen de fuentes externas (Unsplash, randomuser.me) y se usan con fines de demostración.

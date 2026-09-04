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

## Estructura del proyecto 

```
```filetree
miweb/
├── assets/                  # Assets gráficos del proyecto (imágenes de catálogo, testimonios, blog)
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
├── index.html               # Documento principal HTML5
├── style.css                # Hoja de estilos globales y diseño responsive
├── main.js                  # Lógica del cliente e interactividad DOM
├── .gitignore
└── README.md                # Documentación del proyecto
```

---

## Secciones de la página 

Header  —  Navegación fija (sticky) con efecto glassmorphism, acceso a modal de búsqueda, carrito dinámico y menú desplegable en móviles.
Hero  #inicio  _  Banner principal de impacto con llamadas a la acción (CTA), estadísticas clave y tarjetas flotantes animadas.
Beneficios  —  Tarjetas informativas de servicios: Envíos rápidos, devoluciones, compras seguras y soporte.
Marcas  —  Carrusel continuo (marquee) con firmas y marcas aliadas.
Productos  #productos  _  Catálogo interactivo con filtrado por categorías (Gadgets, Audio, Accesorios).
Ofertas Flash  #ofertas  _  Promoción relámpago con temporizador (countdown) dinámico hasta medianoche.
Testimonios  —  Módulo de prueba social con reseñas y puntuaciones de compradores verificados.
Blog  #blog  _  Artículos de interés técnico, reviews de productos y tendencias tecnológicas.
FAQ  —  Acordeón interactivo para la resolución de preguntas frecuentes.
Contacto  #contacto  _  Datos de la tienda y formulario directo para el cliente.
Newsletter  —  Captura de suscriptores para ofertas especiales.
Footer  —  Mapa del sitio, canales sociales, avisos legales y pasarelas de pago aceptadas.

---

## Funcionalidades JavaScript (`main.js`)

*Navegación Móvil: Menú tipo hamburguesa con alternancia de estado y actualización del atributo aria-expanded.*

Efectos de Scroll:

Detección de desplazamiento en la cabecera (.main-header.scrolled).

Botón flotante "Volver arriba" (.back-to-top) visible automáticamente tras 400px de scroll.

Indicador de sección activa en la barra de navegación (Scrollspy).

*Animaciones al Vista (Scroll Reveal): Carga progresiva de componentes mediante IntersectionObserver.*

Modal de Búsqueda: Manejo de diálogos nativos HTML5 con showModal() y close().

Filtro de Catálogo: Filtrado interactivo de productos según categorías con animaciones fade-in.

Simulación de Carrito: Contador global dinámico e integración de notificaciones Toast con confirmación al usuario.

Acordeón FAQ: Colapso dinámico asegurando la apertura de una única respuesta en simultáneo.

Reloj de Cuenta Regresiva: Cálculo exacto del tiempo restante hasta el final del día en tiempo real.
---

## Cómo ejecutar el proyecto *

*1. Clonar el repositorio*

git clone [https://github.com/tu-usuario/techstore.git](https://github.com/tu-usuario/techstore.git)
cd techstore

*2. Abrir en el navegador*

Opción A (Rápida): Haz doble clic en el archivo index.html o arrástralo a tu navegador de preferencia.

Opción B (Servidor Local Recomendado):

Con VS Code: Utiliza la extensión Live Server.

Con Python:

Bash
python -m http.server 8000
Con Node.js:

Bash
npx serve .
Visita http://localhost:8000 en tu navegador.

---

## Diseño y CSS

Variables CSS (:root): Control unificado de la paleta de colores, tipografías, espaciados y sombras del proyecto.

*Paleta de Colores:*

Primario: Índigo (#6366f1) y variantes para estados hover.

Secundario / Acento: Ámbar (#f59e0b) y Rosa Acento (#ec4899).

Fondos / Oscuros: Azul Noche (#0f172a / #1e293b).

*Breakpoints Responsivos:*

1024px: Dispositivos medianos y laptops.

768px: Tablets y teléfonos en orientación horizontal (activación de menú hamburguesa).

480px: Teléfonos inteligentes pequeños.

---

## Historial de cambios 

### Mejoras iniciales
- Creaciòn de la estructura de la pàgina web.
- Estilos.
- Refactorización de Código: Separación de scripts inline hacia un archivo independiente main.js importado con carga diferida (defer).
- Componentes UI: Incorporación de modal de búsqueda nativo (<dialog>), alertas flotantes (Toasts) y temporizador de ofertas.
- Animaciones al scroll y navegación activa por sección.
- Corrección de tipo en testimonios ("Comprador verificado").

### Assets locales
- Las 15 imágenes externas (Unsplash, randomuser.me, MercadoLibre) se descargaron a `assets/`.
- Todas las rutas en `index.html` apuntan ahora a `assets/` en lugar de URLs externas.

---

## Próximos pasos posibles

[ ] Implementación de panel lateral interactivo para el carrito de compras (Slide-over Cart Drawer).

[ ] Incorporación de un botón toggle para Modo Oscuro / Modo Claro guardado en localStorage.

[ ] Filtrado de productos por rango de precio y barra de búsqueda en tiempo real.

[ ] Persistencia del carrito de compras usando la API localStorage.

[ ] Integración directa para pedidos vía WhatsApp.

[ ] Despliegue en plataforma de hosting estático (Vercel / Netlify / GitHub Pages).
---

## Licencia

Este es un proyecto con fines educativos e ilustrativos. Las imágenes utilizadas pertenecen a sus respectivos autores en Unsplash y RandomUser, empleadas bajo sus licencias públicas de uso libre.

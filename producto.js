// Datos de productos (mismos que en el catálogo)
const productsData = {
    1: {
        name: 'Smartwatch Pro X1 con Monitor Cardiaco',
        description: 'Controla ritmo cardíaco, GPS y notificaciones durante todo el día con hasta 10 días de batería.',
        category: 'gadgets',
        categoryLabel: 'Dispositivos',
        oldPrice: '$129.99',
        price: '$89.99',
        image: 'assets/product-smartwatch.webp',
        stars: '★★★★★',
        starsLabel: '5 estrellas',
        reviews: '(124 reseñas)',
        badge: '-30%'
    },
    2: {
        name: 'Auriculares Bluetooth 5.3 Noise Cancelling',
        description: 'Sonido nítido con cancelación activa de ruido, ajuste cómodo y hasta 30 horas de reproducción continua.',
        category: 'audio',
        categoryLabel: 'Audio',
        oldPrice: null,
        price: '$59.99',
        image: 'assets/product-headphones.jpg',
        stars: '★★★★☆',
        starsLabel: '4 estrellas',
        reviews: '(89 reseñas)',
        badge: 'Nuevo'
    },
    3: {
        name: 'Cámara Instantánea con Impresión Incluida',
        description: 'Captura y imprime fotos al instante con diseño compacto, flash integrado y filtros creativos.',
        category: 'accesorios',
        categoryLabel: 'Accesorios',
        oldPrice: '$79.99',
        price: '$63.99',
        image: 'assets/product-camera.jpg',
        stars: '★★★★★',
        starsLabel: '5 estrellas',
        reviews: '(67 reseñas)',
        badge: '-20%'
    },
    4: {
        name: 'Zapatillas Inteligentes con GPS Integrado',
        description: 'Entrena con seguimiento de ruta, cálculo de calorías y alertas en tiempo real para mayor comodidad deportiva.',
        category: 'gadgets',
        categoryLabel: 'Dispositivos',
        oldPrice: '$149.99',
        price: '$119.99',
        image: 'assets/product-shoes.jpg',
        stars: '★★★★☆',
        starsLabel: '4 estrellas',
        reviews: '(43 reseñas)',
        badge: 'Oferta'
    },
    5: {
        name: 'Altavoz Portátil con Luces LED',
        description: 'Lleva tu música a cualquier lugar con un diseño resistente, luces RGB y conexión Bluetooth de largo alcance.',
        category: 'audio',
        categoryLabel: 'Audio',
        oldPrice: '$45.99',
        price: '$38.99',
        image: 'assets/product-speaker.jpg',
        stars: '★★★★★',
        starsLabel: '5 estrellas',
        reviews: '(205 reseñas)',
        badge: '-15%'
    },
    6: {
        name: 'Reloj Inteligente Serie 8 con Esfera OLED',
        description: 'Sigue tu actividad diaria, sueño y rendimiento con pantalla OLED y alertas inteligentes para llamadas y apps.',
        category: 'accesorios',
        categoryLabel: 'Accesorios',
        oldPrice: '$199.99',
        price: '$159.99',
        image: 'assets/product-watch.jpg',
        stars: '★★★★★',
        starsLabel: '5 estrellas',
        reviews: '(312 reseñas)',
        badge: 'Top'
    }
};

// Obtener ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id') || '1';
const product = productsData[productId];

if (product) {
    // Actualizar título de la página
    document.title = `${product.name} - TechStore`;

    // Actualizar breadcrumb
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) breadcrumbProduct.textContent = product.name;

    // Renderizar detalle del producto
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <article class="product-detail-card">
            <figure class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="product-badge">${product.badge}</span>
            </figure>
            <article class="product-detail-info">
                <p class="product-detail-category">${product.categoryLabel}</p>
                <h1 id="product-detail-title">${product.name}</h1>
                <p class="product-detail-rating">
                    <span class="stars" aria-label="${product.starsLabel}">${product.stars}</span>
                    <span>${product.reviews}</span>
                </p>
                <p class="product-detail-description">${product.description}</p>
                <p class="product-detail-features">
                    <strong>Características:</strong>
                </p>
                <ul class="product-detail-features-list">
                    <li><i class="fas fa-check" aria-hidden="true"></i> Garantía de 1 año incluida</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i> Envío gratuito a todo Ecuador</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i> Devolución gratuita en 30 días</li>
                    <li><i class="fas fa-check" aria-hidden="true"></i> Soporte técnico 24/7</li>
                </ul>
                <p class="product-detail-price">
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice}</span>` : ''}
                    <span class="new-price">${product.price}</span>
                </p>
                <div class="product-detail-actions">
                    <label for="quantity" class="sr-only">Cantidad</label>
                    <input type="number" id="quantity" value="1" min="1" max="10" class="quantity-input">
                    <button class="btn-add-cart" id="detail-add-cart" data-product-id="${productId}">
                        <i class="fas fa-cart-plus" aria-hidden="true"></i> Añadir al carrito
                    </button>
                </div>
                <a href="productos.html" class="back-link">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i> Volver al catálogo
                </a>
            </article>
        </article>
    `;

    // Agregar funcionalidad al botón de carrito
    const addCartBtn = document.getElementById('detail-add-cart');
    const quantityInput = document.getElementById('quantity');

    addCartBtn.addEventListener('click', () => {
        const qty = parseInt(quantityInput.value) || 1;
        if (typeof addToCart === 'function') {
            addToCart(productId, qty);
        }
    });
} else {
    // Producto no encontrado
    document.title = 'Producto no encontrado - TechStore';
    const container = document.getElementById('product-detail-container');
    container.innerHTML = `
        <article class="product-not-found">
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <h1>Producto no encontrado</h1>
            <p>El producto que buscas no existe o ha sido removido.</p>
            <a href="productos.html" class="btn btn-primary">
                <i class="fas fa-store" aria-hidden="true"></i> Ver catálogo
            </a>
        </article>
    `;
}

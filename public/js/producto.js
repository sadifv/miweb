// Cargar producto desde la API
async function loadProducto() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1';

    try {
        const respuesta = await fetch(`/api/productos/${productId}`);
        if (!respuesta.ok) throw new Error('Producto no encontrado');
        const product = await respuesta.json();

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
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                        <span class="new-price">$${product.price}</span>
                    </p>
                    <div class="product-detail-actions">
                        <label for="quantity" class="sr-only">Cantidad</label>
                        <input type="number" id="quantity" value="1" min="1" max="10" class="quantity-input">
                        <button class="btn-add-cart" id="detail-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus" aria-hidden="true"></i> Añadir al carrito
                        </button>
                    </div>
                    <a href="/productos.html" class="back-link">
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
                addToCart(product.id, qty);
            }
        });
    } catch (error) {
        // Producto no encontrado
        document.title = 'Producto no encontrado - TechStore';
        const container = document.getElementById('product-detail-container');
        container.innerHTML = `
            <article class="product-not-found">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <h1>Producto no encontrado</h1>
                <p>El producto que buscas no existe o ha sido removido.</p>
                <a href="/productos.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i> Ver catálogo
                </a>
            </article>
        `;
    }
}

// Cargar producto al iniciar
loadProducto();

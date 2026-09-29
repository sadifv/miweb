const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.main-header');
const backToTop = document.querySelector('.back-to-top');
const cartBadge = document.querySelector('.cart-badge');
const cartToast = document.querySelector('.cart-toast');

// Menú móvil

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
});

// Modo oscuro
const THEME_KEY = 'techstore_theme';
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle?.querySelector('i');

function setTheme(dark) {
    document.documentElement.classList.toggle('dark-mode', dark);
    if (themeIcon) {
        themeIcon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    }
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
}

// Cargar tema guardado
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === 'dark') {
    setTheme(true);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark-mode');
        setTheme(!isDark);
    });
}

// Modal de cuenta
const userBtn = document.querySelector('.user-btn');

if (userBtn) {
    userBtn.addEventListener('click', () => {
        if (typeof showAuthModal === 'function') {
            const currentPage = window.location.pathname;
            showAuthModal(currentPage === '/checkout.html' ? '/checkout.html' : null);
        }
    });
}

// Detectar sesión activa al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
});

// Enlaces "Próximamente"
document.querySelectorAll('[data-soon]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof showToast === 'function') {
            showToast('Próximamente');
        }
    });
});

// Cerrar menú móvil al hacer clic en un enlace
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Header al hacer scroll

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.hidden = window.scrollY < 400;
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Búsqueda

let products = [];
let searchInput, searchResults, searchBtn, searchClose, searchModal;

function initSearch() {
    searchInput = document.getElementById('search-input');
    searchResults = document.querySelector('.search-results');
    searchBtn = document.querySelector('.search-btn');
    searchClose = document.querySelector('.search-close');
    searchModal = document.querySelector('.search-modal');

    if (!searchInput || !searchResults || !searchBtn || !searchClose || !searchModal) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }

    // Cargar productos desde la API
    loadProducts();

    function renderSearchResults(query) {
        const q = query.toLowerCase().trim();
        if (!q) {
            searchResults.innerHTML = '';
            return;
        }
        const matches = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        if (matches.length === 0) {
            searchResults.innerHTML = '<p class="search-no-results">No se encontraron productos</p>';
            return;
        }
        searchResults.innerHTML = matches.map(p => `
            <a href="/producto.html?id=${p.id}" class="search-result-item">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="search-result-info">
                    <strong>${p.name}</strong>
                    <span>$${p.price.toFixed(2)}</span>
                </div>
            </a>
        `).join('');
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                searchModal.close();
                searchInput.value = '';
                searchResults.innerHTML = '';
            });
        });
    }

    searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));

    searchBtn.addEventListener('click', () => {
        searchModal.showModal();
        setTimeout(() => searchInput.focus(), 50);
    });

    searchClose.addEventListener('click', () => {
        searchModal.close();
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    searchModal.addEventListener('close', () => {
        searchInput.value = '';
        searchResults.innerHTML = '';
    });
}

async function loadProducts() {
    try {
        const respuesta = await fetch('/api/productos');
        products = await respuesta.json();
    } catch (error) {
        console.error('Error cargando productos:', error);
        products = [];
    }
}

// Inicializar búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSearch);

// Filtros de productos

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-card').forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            card.style.display = show ? '' : 'none';
            card.classList.remove('fade-in');
        });
        // Forzar reflow para reiniciar la animación
        void document.querySelector('.products-grid').offsetWidth;
        document.querySelectorAll('.product-card').forEach(card => {
            const show = filter === 'all' || card.dataset.category === filter;
            if (show) card.classList.add('fade-in');
        });
    });
});

// Carrito de compras con API (MongoDB)

const CART_SESSION_KEY = 'techstore_session_id';

function getSessionId() {
    let sessionId = localStorage.getItem(CART_SESSION_KEY);
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(CART_SESSION_KEY, sessionId);
    }
    return sessionId;
}

async function fetchCart() {
    try {
        const res = await fetch(`/api/carrito?sessionId=${getSessionId()}`);
        return await res.json();
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        return { items: [], subtotal: 0, descuento: 0, total: 0 };
    }
}

async function addToCart(productId, quantity = 1) {
    try {
        await fetch('/api/carrito/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: getSessionId(), productoId: parseInt(productId), quantity })
        });
        showToast('Producto añadido al carrito');
        updateCartUI(await fetchCart());
    } catch (error) {
        showToast('Error al agregar al carrito');
    }
}

async function removeFromCart(productId) {
    try {
        await fetch(`/api/carrito/eliminar/${productId}?sessionId=${getSessionId()}`, { method: 'DELETE' });
        updateCartUI(await fetchCart());
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateQuantity(productId, quantity) {
    try {
        await fetch('/api/carrito/actualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: getSessionId(), productoId: parseInt(productId), quantity })
        });
        updateCartUI(await fetchCart());
    } catch (error) {
        console.error('Error:', error);
    }
}

async function clearCart() {
    try {
        await fetch('/api/carrito/vaciar', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: getSessionId() })
        });
        updateCartUI(await fetchCart());
    } catch (error) {
        console.error('Error:', error);
    }
}

async function applyCupon(cupon) {
    try {
        const res = await fetch('/api/carrito/cupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: getSessionId(), cupon })
        });
        const data = await res.json();
        if (data.error) {
            showToast(data.error, 'error');
        } else {
            showToast(data.mensaje);
            updateCartUI(await fetchCart());
        }
    } catch (error) {
        showToast('Error al aplicar cupón', 'error');
    }
}

async function updateCartUI(cartData) {
    const itemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const badge = document.querySelector('.cart-badge');
    const subtotalElement = document.getElementById('cart-subtotal');
    const descuentoElement = document.getElementById('cart-descuento');

    if (!itemsContainer) return;

    const items = cartData.items || [];
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

    if (badge) badge.textContent = totalItems;
    if (totalElement) totalElement.textContent = `$${(cartData.total || 0).toFixed(2)}`;
    if (subtotalElement) subtotalElement.textContent = `$${(cartData.subtotal || 0).toFixed(2)}`;
    if (descuentoElement) {
        if (cartData.descuento > 0) {
            descuentoElement.textContent = `-$${cartData.descuento.toFixed(2)}`;
            descuentoElement.style.display = '';
        } else {
            descuentoElement.style.display = 'none';
        }
    }

    if (items.length === 0) {
        itemsContainer.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        return;
    }

    itemsContainer.innerHTML = items.map(item => `
        <article class="cart-item" data-id="${item.productoId}">
            <img src="${item.producto?.image || ''}" alt="${item.producto?.name || ''}" loading="lazy">
            <div class="cart-item-info">
                <h4>${item.producto?.name || 'Producto'}</h4>
                <p class="cart-item-price">$${(item.producto?.price || 0).toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn" data-action="decrease" aria-label="Disminuir cantidad">−</button>
                    <span class="cart-qty">${item.cantidad}</span>
                    <button class="cart-qty-btn" data-action="increase" aria-label="Aumentar cantidad">+</button>
                    <button class="cart-remove" aria-label="Eliminar producto">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

function showToast(message) {
    const toast = document.querySelector('.cart-toast');
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.hidden = true; }, 300);
    }, 2500);
}

// Drawer del carrito
const cartBtn = document.querySelector('.cart-btn');
const cartDrawer = document.querySelector('.cart-drawer');
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.cart-close');

// Asegurar que el drawer esté oculto al cargar
if (cartDrawer) cartDrawer.hidden = true;
if (cartOverlay) cartOverlay.hidden = true;

function openCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.hidden = false;
        cartOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
        fetchCart().then(updateCartUI);
    }
}

function closeCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.hidden = true;
        cartOverlay.hidden = true;
        document.body.style.overflow = '';
    }
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Eventos del carrito (delegación)
document.addEventListener('click', async (e) => {
    // Agregar al carrito (tarjetas de producto)
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
        const id = addBtn.dataset.productId;
        if (id) await addToCart(id);
        return;
    }

    // Botón de checkout
    if (e.target.closest('#cart-checkout')) {
        const cart = await fetchCart();
        const itemCount = cart.items ? cart.items.length : 0;
        if (itemCount === 0) {
            showToast('Tu carrito está vacío');
        } else if (!isLoggedIn()) {
            showToast('Debes iniciar sesión para continuar', 'error');
            showAuthModal();
        } else {
            window.location.href = '/checkout.html';
        }
        return;
    }

    // Cantidad del carrito
    const qtyBtn = e.target.closest('.cart-qty-btn');
    if (qtyBtn) {
        const item = qtyBtn.closest('.cart-item');
        const id = item?.dataset.id;
        const currentQty = parseInt(item?.querySelector('.cart-qty')?.textContent) || 1;
        if (qtyBtn.dataset.action === 'increase') {
            await updateQuantity(id, currentQty + 1);
        } else {
            await updateQuantity(id, currentQty - 1);
        }
        return;
    }

    // Eliminar del carrito
    const removeBtn = e.target.closest('.cart-remove');
    if (removeBtn) {
        const item = removeBtn.closest('.cart-item');
        const id = item?.dataset.id;
        if (id) await removeFromCart(id);
        return;
    }

    // Aplicar cupón
    const cuponBtn = e.target.closest('#btn-cupon');
    if (cuponBtn) {
        const cuponInput = document.getElementById('cupon-input');
        if (cuponInput && cuponInput.value.trim()) {
            await applyCupon(cuponInput.value.trim());
            cuponInput.value = '';
        }
        return;
    }
});

// Cerrar carrito con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && !cartDrawer.hidden) {
        closeCart();
    }
});

// Formularios con validación personalizada
function showFieldError(input, message) {
    const formRow = input.closest('.form-row') || input.closest('.form-group');
    if (!formRow) return;
    let error = formRow.querySelector('.form-error');
    if (!error) {
        error = document.createElement('small');
        error.className = 'form-error';
        formRow.appendChild(error);
    }
    error.textContent = message;
    input.classList.add('input-error');
}

function clearFieldError(input) {
    const formRow = input.closest('.form-row') || input.closest('.form-group');
    if (!formRow) return;
    const error = formRow.querySelector('.form-error');
    if (error) error.remove();
    input.classList.remove('input-error');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const nameInput = contactForm.querySelector('#contact-name');
    const emailInput = contactForm.querySelector('#contact-email');
    const messageInput = contactForm.querySelector('#contact-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        if (nameInput.value.trim().length < 3) {
            showFieldError(nameInput, 'El nombre debe tener al menos 3 caracteres');
            isValid = false;
        } else {
            clearFieldError(nameInput);
        }

        if (!validateEmail(emailInput.value.trim())) {
            showFieldError(emailInput, 'Ingresa un email válido');
            isValid = false;
        } else {
            clearFieldError(emailInput);
        }

        if (messageInput.value.trim().length < 10) {
            showFieldError(messageInput, 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        } else {
            clearFieldError(messageInput);
        }

        if (isValid) {
            // Enviar a la API
            fetch('/api/formularios/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    mensaje: messageInput.value.trim()
                })
            })
            .then(res => res.json())
            .then(data => {
                showToast(data.mensaje || '¡Mensaje enviado!');
                contactForm.reset();
            })
            .catch(() => showToast('Error al enviar el mensaje'));
        }
    });

    // Limpiar errores al escribir
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => clearFieldError(input));
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('#email-input');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateEmail(emailInput.value.trim())) {
            showFieldError(emailInput, 'Ingresa un email válido');
            return;
        }

        clearFieldError(emailInput);
        // Enviar a la API
        fetch('/api/formularios/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput.value.trim() })
        })
        .then(res => res.json())
        .then(data => {
            showToast(data.mensaje || '¡Suscripción exitosa!');
            newsletterForm.reset();
        })
        .catch(() => showToast('Error al suscribirse'));
    });

    emailInput.addEventListener('input', () => clearFieldError(emailInput));
}

// Inicializar carrito al cargar
document.addEventListener('DOMContentLoaded', () => {
    fetchCart().then(updateCartUI);
});

// Vista rápida de producto

const quickviewModal = document.querySelector('.quickview-modal');
const quickviewImg = document.getElementById('quickview-img');
const quickviewCategory = document.getElementById('quickview-category');
const quickviewTitle = document.getElementById('quickview-title');
const quickviewStars = document.getElementById('quickview-stars');
const quickviewReviews = document.getElementById('quickview-reviews');
const quickviewDescription = document.getElementById('quickview-description');
const quickviewOldPrice = document.getElementById('quickview-old-price');
const quickviewNewPrice = document.getElementById('quickview-new-price');
const quickviewAddCart = document.getElementById('quickview-add-cart');
const quickviewClose = document.querySelector('.quickview-close');

const categoryLabels = {
    gadgets: 'Dispositivos',
    audio: 'Audio',
    accesorios: 'Accesorios'
};

function openQuickView(card) {
    const name = card.querySelector('h3')?.textContent?.trim() || '';
    const description = card.querySelector('.product-description')?.textContent?.trim() || '';
    const category = card.dataset.category || '';
    const price = card.querySelector('.new-price')?.textContent?.trim() || '';
    const oldPrice = card.querySelector('.old-price')?.textContent?.trim() || '';
    const image = card.querySelector('.product-image img')?.getAttribute('src') || '';
    const stars = card.querySelector('.stars')?.textContent?.trim() || '';
    const reviews = card.querySelector('.reviews')?.textContent?.trim() || '';

    quickviewImg.src = image;
    quickviewImg.alt = name;
    quickviewCategory.textContent = categoryLabels[category] || category;
    quickviewTitle.textContent = name;
    quickviewStars.textContent = stars;
    quickviewStars.setAttribute('aria-label', stars);
    quickviewReviews.textContent = reviews;
    quickviewDescription.textContent = description;
    quickviewOldPrice.textContent = oldPrice;
    quickviewOldPrice.style.display = oldPrice ? '' : 'none';
    quickviewNewPrice.textContent = price;

    quickviewAddCart.onclick = () => {
        const card = document.querySelector(`.product-card .btn-add-cart[data-product-id]`);
        const id = card?.dataset.productId || '1';
        addToCart(id);
        quickviewModal.close();
    };

    quickviewModal.showModal();
}

document.querySelectorAll('.quick-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.product-card');
        if (card) openQuickView(card);
    });
});

quickviewClose.addEventListener('click', () => quickviewModal.close());

// FAQ acordeón

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// Countdown oferta flash (hasta medianoche)

function updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = h;
    document.getElementById('countdown-minutes').textContent = m;
    document.getElementById('countdown-seconds').textContent = s;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Animaciones al scroll

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.benefit-card, .product-card, .testimonial-card, .blog-card, .faq-item').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
});

// Nav activo según sección

const sections = document.querySelectorAll('section[id]');
const headerHeight = header.offsetHeight || 72;

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - headerHeight - 20) current = section.id;
    });
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
});

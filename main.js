const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.main-header');
const backToTop = document.querySelector('.back-to-top');
const searchBtn = document.querySelector('.search-btn');
const searchModal = document.querySelector('.search-modal');
const searchClose = document.querySelector('.search-close');
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
const accountModal = document.querySelector('.account-modal');
const accountClose = document.querySelector('.account-close');
const accountTabs = document.querySelectorAll('.account-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (userBtn && accountModal) {
    userBtn.addEventListener('click', () => {
        accountModal.showModal();
    });
}

if (accountClose && accountModal) {
    accountClose.addEventListener('click', () => {
        accountModal.close();
    });
}

// Pestañas de login/registro
accountTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        accountTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target === 'login') {
            loginForm?.classList.remove('hidden');
            registerForm?.classList.add('hidden');
        } else {
            loginForm?.classList.add('hidden');
            registerForm?.classList.remove('hidden');
        }
    });
});

// Submit de login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (typeof showToast === 'function') {
            showToast('¡Bienvenido de nuevo!');
        }
        accountModal?.close();
        loginForm.reset();
    });
}

// Submit de registro
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (typeof showToast === 'function') {
            showToast('¡Cuenta creada con éxito!');
        }
        accountModal?.close();
        registerForm.reset();
    });
}

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

const searchInput = document.getElementById('search-input');
const searchResults = document.querySelector('.search-results');

const products = Array.from(document.querySelectorAll('.product-card')).map(card => ({
    name: card.querySelector('h3')?.textContent?.trim() || '',
    description: card.querySelector('.product-description')?.textContent?.trim() || '',
    category: card.dataset.category || '',
    price: card.querySelector('.new-price')?.textContent?.trim() || '',
    image: card.querySelector('.product-image img')?.getAttribute('src') || '',
    card: card
}));

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
        <a href="#productos" class="search-result-item" data-target="${p.card.dataset.category}">
            <img src="${p.image}" alt="${p.name}" loading="lazy">
            <div class="search-result-info">
                <strong>${p.name}</strong>
                <span>${p.price}</span>
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

// Carrito de compras con localStorage

const CART_KEY = 'techstore_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI(cart);
}

function getProductData(id) {
    const card = document.querySelector(`.product-card[data-category] .btn-add-cart[data-product-id="${id}"]`)?.closest('.product-card');
    if (card) {
        return {
            id: id,
            name: card.querySelector('h3')?.textContent?.trim() || 'Producto',
            price: parseFloat(card.querySelector('.new-price')?.textContent?.replace(/[^0-9.]/g, '')) || 0,
            image: card.querySelector('.product-image img')?.getAttribute('src') || ''
        };
    }
    // Fallback para producto.html
    const productsData = {
        1: { name: 'Smartwatch Pro X1 con Monitor Cardiaco', price: 89.99, image: 'assets/product-smartwatch.webp' },
        2: { name: 'Auriculares Bluetooth 5.3 Noise Cancelling', price: 59.99, image: 'assets/product-headphones.jpg' },
        3: { name: 'Cámara Instantánea con Impresión Incluida', price: 63.99, image: 'assets/product-camera.jpg' },
        4: { name: 'Zapatillas Inteligentes con GPS Integrado', price: 119.99, image: 'assets/product-shoes.jpg' },
        5: { name: 'Altavoz Portátil con Luces LED', price: 38.99, image: 'assets/product-speaker.jpg' },
        6: { name: 'Reloj Inteligente Serie 8 con Esfera OLED', price: 159.99, image: 'assets/product-watch.jpg' },
        7: { name: 'Tablet Android 12" con 128GB', price: 249.99, image: 'assets/product-tablet.jpg' },
        8: { name: 'Teclado Mecánico RGB TKL', price: 67.99, image: 'assets/product-keyboard.jpg' },
        9: { name: 'Mouse Gamer Pro 16000 DPI', price: 39.99, image: 'assets/product-mouse.jpg' },
        10: { name: 'Webcam Full HD 1080p con Micrófono', price: 53.99, image: 'assets/product-webcam.jpg' },
        11: { name: 'Cargador Inalámbrico 15W', price: 29.99, image: 'assets/product-charger.jpg' },
        12: { name: 'Funda Protectora Universal 11"', price: 24.99, image: 'assets/product-case.jpg' }
    };
    return productsData[id] ? { id, ...productsData[id] } : null;
}

function addToCart(productId, quantity = 1) {
    const product = getProductData(productId);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart(cart);
    showToast('Producto añadido al carrito');
}

function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart(cart);
    }
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartUI([]);
}

function updateCartUI(cart) {
    const itemsContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const badge = document.querySelector('.cart-badge');

    if (!itemsContainer) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (badge) badge.textContent = totalItems;
    if (totalElement) totalElement.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        return;
    }

    itemsContainer.innerHTML = cart.map(item => `
        <article class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn" data-action="decrease" aria-label="Disminuir cantidad">−</button>
                    <span class="cart-qty">${item.quantity}</span>
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

function openCart() {
    if (cartDrawer && cartOverlay) {
        cartDrawer.hidden = false;
        cartOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
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
document.addEventListener('click', (e) => {
    // Agregar al carrito (tarjetas de producto)
    const addBtn = e.target.closest('.btn-add-cart');
    if (addBtn) {
        const id = addBtn.dataset.productId;
        if (id) addToCart(id);
        return;
    }

    // Botón de checkout
    if (e.target.closest('#cart-checkout')) {
        const cart = getCart();
        if (cart.length === 0) {
            showToast('Tu carrito está vacío');
        } else {
            showToast('¡Gracias por tu compra! (simulación)');
            clearCart();
            closeCart();
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
            updateQuantity(id, currentQty + 1);
        } else {
            updateQuantity(id, currentQty - 1);
        }
        return;
    }

    // Eliminar del carrito
    const removeBtn = e.target.closest('.cart-remove');
    if (removeBtn) {
        const item = removeBtn.closest('.cart-item');
        const id = item?.dataset.id;
        if (id) removeFromCart(id);
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
            if (typeof showToast === 'function') {
                showToast('¡Mensaje enviado! Te contactaremos pronto');
            }
            contactForm.reset();
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
        if (typeof showToast === 'function') {
            showToast('¡Suscripción exitosa! Revisa tu email');
        }
        newsletterForm.reset();
    });

    emailInput.addEventListener('input', () => clearFieldError(emailInput));
}

// Inicializar carrito al cargar
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI(getCart());
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

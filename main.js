const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.main-header');
const backToTop = document.querySelector('.back-to-top');
const searchBtn = document.querySelector('.search-btn');
const searchModal = document.querySelector('.search-modal');
const searchClose = document.querySelector('.search-close');
const cartBadge = document.querySelector('.cart-badge');
const cartToast = document.querySelector('.cart-toast');
let cartCount = parseInt(cartBadge.textContent) || 0;

// Menú móvil

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
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

// Añadir al carrito

document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        cartBadge.textContent = cartCount;
        cartToast.hidden = false;
        cartToast.classList.add('show');
        setTimeout(() => {
            cartToast.classList.remove('show');
            setTimeout(() => { cartToast.hidden = true; }, 300);
        }, 2500);
    });
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
        cartCount++;
        cartBadge.textContent = cartCount;
        cartToast.hidden = false;
        cartToast.classList.add('show');
        setTimeout(() => {
            cartToast.classList.remove('show');
            setTimeout(() => { cartToast.hidden = true; }, 300);
        }, 2500);
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

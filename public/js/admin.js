// Panel de Administración

// Verificar autenticación
function checkAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
        showLoginPrompt();
        return false;
    }
    return true;
}

function showLoginPrompt() {
    const container = document.querySelector('.admin-container');
    container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <i class="fas fa-lock" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 1rem;"></i>
            <h2>Acceso restringido</h2>
            <p style="color: var(--color-gray-500); margin-bottom: 1.5rem;">Inicia sesión para acceder al panel de administración</p>
            <button class="btn-add" onclick="loginAdmin()">Iniciar sesión</button>
        </div>
    `;
}

async function loginAdmin() {
    const email = prompt('Email de administrador:');
    const password = prompt('Contraseña:');
    
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_token', data.token);
            location.reload();
        } else {
            alert(data.error || 'Credenciales inválidas');
        }
    } catch (error) {
        alert('Error de conexión');
    }
}

function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
    location.reload();
}

// Tabs
function showTab(tab) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
}

// Event listeners para tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// Event listeners para botones de formulario
document.getElementById('btn-new-product').addEventListener('click', showProductForm);
document.getElementById('btn-cancel-product').addEventListener('click', hideProductForm);
document.getElementById('btn-new-article').addEventListener('click', showArticleForm);
document.getElementById('btn-cancel-article').addEventListener('click', hideArticleForm);

// ============ PRODUCTOS ============

let productsCache = [];

async function loadProducts() {
    try {
        const res = await fetch('/api/productos');
        productsCache = await res.json();
        renderProducts();
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderProducts() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = productsCache.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="${p.name}"></td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>
                <button class="btn-small btn-edit" data-id="${p.id}">Editar</button>
                <button class="btn-small btn-delete" data-id="${p.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    // Agregar event listeners a los botones
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = productsCache.find(p => p.id === parseInt(btn.dataset.id));
            if (product) editProduct(product);
        });
    });
    
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
    });
}

function showProductForm() {
    document.getElementById('product-form-container').classList.remove('hidden');
    document.getElementById('product-form-title').textContent = 'Crear Producto';
    document.getElementById('form-producto').reset();
    document.getElementById('product-id').value = '';
}

function hideProductForm() {
    document.getElementById('product-form-container').classList.add('hidden');
}

function editProduct(product) {
    document.getElementById('product-form-container').classList.remove('hidden');
    document.getElementById('product-form-title').textContent = 'Editar Producto';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-old-price').value = product.oldPrice || '';
    document.getElementById('product-image').value = product.image;
}

async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' });
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('form-producto').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('product-id').value;
    const data = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        categoryLabel: document.getElementById('product-category').selectedOptions[0].text,
        price: parseFloat(document.getElementById('product-price').value),
        oldPrice: parseFloat(document.getElementById('product-old-price').value) || null,
        image: document.getElementById('product-image').value
    };

    try {
        if (id) {
            data.id = parseInt(id);
            await fetch(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            const maxId = productsCache.reduce((max, p) => Math.max(max, p.id), 0);
            data.id = maxId + 1;
            await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        hideProductForm();
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
    }
});

// ============ ARTÍCULOS ============

let articlesCache = [];

async function loadArticles() {
    try {
        const res = await fetch('/api/articulos');
        articlesCache = await res.json();
        renderArticles();
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderArticles() {
    const tbody = document.getElementById('articles-table-body');
    tbody.innerHTML = articlesCache.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.title}</td>
            <td>${a.category}</td>
            <td>
                <button class="btn-small btn-edit" data-id="${a.id}">Editar</button>
                <button class="btn-small btn-delete" data-id="${a.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
    
    tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const article = articlesCache.find(a => a.id === parseInt(btn.dataset.id));
            if (article) editArticle(article);
        });
    });
    
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deleteArticle(parseInt(btn.dataset.id)));
    });
}

function showArticleForm() {
    document.getElementById('article-form-container').classList.remove('hidden');
    document.getElementById('article-form-title').textContent = 'Crear Artículo';
    document.getElementById('form-articulo').reset();
    document.getElementById('article-id').value = '';
}

function hideArticleForm() {
    document.getElementById('article-form-container').classList.add('hidden');
}

function editArticle(article) {
    document.getElementById('article-form-container').classList.remove('hidden');
    document.getElementById('article-form-title').textContent = 'Editar Artículo';
    document.getElementById('article-id').value = article.id;
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-category').value = article.category;
    document.getElementById('article-image').value = article.image;
    document.getElementById('article-content').value = article.content.replace(/<[^>]*>/g, '');
}

async function deleteArticle(id) {
    if (!confirm('¿Eliminar este artículo?')) return;
    try {
        await fetch(`/api/articulos/${id}`, { method: 'DELETE' });
        loadArticles();
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('form-articulo').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('article-id').value;
    const data = {
        title: document.getElementById('article-title').value,
        category: document.getElementById('article-category').value,
        image: document.getElementById('article-image').value,
        content: document.getElementById('article-content').value
    };

    try {
        if (id) {
            data.id = parseInt(id);
            await fetch(`/api/articulos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            const maxId = articlesCache.reduce((max, a) => Math.max(max, a.id), 0);
            data.id = maxId + 1;
            await fetch('/api/articulos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        hideArticleForm();
        loadArticles();
    } catch (error) {
        console.error('Error:', error);
    }
});

// ============ FORMULARIOS ============

async function loadContacts() {
    try {
        const res = await fetch('/api/formularios/contacto');
        const contacts = await res.json();
        const tbody = document.getElementById('contacts-table-body');
        tbody.innerHTML = contacts.map(c => `
            <tr>
                <td>${new Date(c.fecha).toLocaleDateString()}</td>
                <td>${c.nombre}</td>
                <td>${c.email}</td>
                <td>${c.mensaje}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadNewsletter() {
    try {
        const res = await fetch('/api/formularios/newsletter');
        const subscribers = await res.json();
        const tbody = document.getElementById('newsletter-table-body');
        tbody.innerHTML = subscribers.map(s => `
            <tr>
                <td>${new Date(s.fecha).toLocaleDateString()}</td>
                <td>${s.email}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Inicializar
if (checkAuth()) {
    loadProducts();
    loadArticles();
    loadContacts();
    loadNewsletter();
}

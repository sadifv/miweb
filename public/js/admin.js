// Panel de Administración - TechStore

// ===== Autenticación =====

function checkAuth() {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');

    if (!isLoggedIn) {
        if (loginScreen) loginScreen.classList.remove('hidden');
        if (adminPanel) adminPanel.classList.add('hidden');
        return false;
    }

    if (loginScreen) loginScreen.classList.add('hidden');
    if (adminPanel) adminPanel.classList.remove('hidden');
    return true;
}

async function loginAdmin(email, password) {
    try {
        const res = await fetch('/api/auth/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('admin_logged_in', 'true');
            localStorage.setItem('admin_token', data.token);
            showToast('¡Bienvenido!', 'success');
            checkAuth();
            loadAll();
        } else {
            showToast(data.error || 'Credenciales inválidas', 'error');
        }
    } catch (error) {
        showToast('Error de conexión', 'error');
    }
}

function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_token');
    showToast('Sesión cerrada', 'success');
    checkAuth();
}

// Login form
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    loginAdmin(email, password);
});

// Logout button
document.getElementById('btn-logout').addEventListener('click', logoutAdmin);

// ===== Tabs =====

function showTab(tab) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
});

// ===== API Calls =====

function getAuthHeaders() {
    const token = localStorage.getItem('admin_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}

// ===== Métricas =====

async function loadMetrics() {
    try {
        const res = await fetch('/api/admin/metricas', {
            headers: getAuthHeaders()
        });
        const data = await res.json();

        document.getElementById('stat-ventas').textContent = '$' + data.totalVentas.toFixed(2);
        document.getElementById('stat-pedidos').textContent = data.totalPedidos;
        document.getElementById('stat-clientes').textContent = data.totalClientes;
        document.getElementById('stat-stock').textContent = data.productosBajoStock;
    } catch (error) {
        console.error('Error cargando métricas:', error);
    }
}

// ===== Usuarios =====

async function loadUsuarios() {
    try {
        const res = await fetch('/api/admin/usuarios', {
            headers: getAuthHeaders()
        });
        const usuarios = await res.json();

        const tbody = document.getElementById('usuarios-table-body');
        tbody.innerHTML = usuarios.map(u => `
            <tr>
                <td>${u.nombre} ${u.apellido || ''}</td>
                <td>${u.email}</td>
                <td>${u.telefono || '-'}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                <td>${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Nunca'}</td>
                <td>${u.rol}</td>
                <td>
                    <span class="badge ${u.activo ? 'badge-success' : 'badge-danger'}">
                        ${u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

// ===== Productos =====

async function loadProductos() {
    try {
        const res = await fetch('/api/admin/productos', {
            headers: getAuthHeaders()
        });
        const productos = await res.json();

        const tbody = document.getElementById('productos-table-body');
        tbody.innerHTML = productos.map(p => `
            <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" alt="${p.name}"></td>
                <td>${p.name}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td>${p.stock || 0}</td>
                <td>${p.categoryLabel}</td>
                <td>
                    <button class="btn-small btn-edit" data-id="${p.id}">Editar</button>
                    <button class="btn-small btn-delete" data-id="${p.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');

        // Event listeners para botones de productos
        tbody.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const producto = productos.find(p => p.id === parseInt(btn.dataset.id));
                if (producto) editProducto(producto);
            });
        });

        tbody.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteProducto(parseInt(btn.dataset.id)));
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function editProducto(producto) {
    const nuevoNombre = prompt('Nombre del producto:', producto.name);
    if (!nuevoNombre) return;

    const nuevoPrecio = prompt('Precio:', producto.price);
    if (!nuevoPrecio) return;

    const nuevoStock = prompt('Stock:', producto.stock || 0);
    if (!nuevoStock) return;

    fetch('/api/admin/productos/' + producto.id, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            name: nuevoNombre,
            price: parseFloat(nuevoPrecio),
            stock: parseInt(nuevoStock)
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showToast('Producto actualizado');
            loadProductos();
        } else {
            showToast(data.error, 'error');
        }
    })
    .catch(() => showToast('Error al actualizar', 'error'));
}

async function deleteProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
        const res = await fetch('/api/admin/productos/' + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();

        if (data.success) {
            showToast('Producto eliminado');
            loadProductos();
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error al eliminar', 'error');
    }
}

// ===== Pedidos =====

async function loadPedidos() {
    try {
        const res = await fetch('/api/admin/pedidos', {
            headers: getAuthHeaders()
        });
        const pedidos = await res.json();

        const tbody = document.getElementById('pedidos-table-body');
        tbody.innerHTML = pedidos.map(p => `
            <tr>
                <td>${p._id.substring(0, 8)}...</td>
                <td>${p.usuarioNombre}</td>
                <td>${new Date(p.fechaPedido).toLocaleDateString()}</td>
                <td>${p.items.length}</td>
                <td>$${p.total.toFixed(2)}</td>
                <td>
                    <select class="estado-select" data-id="${p._id}">
                        <option value="pendiente" ${p.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="pagado" ${p.estado === 'pagado' ? 'selected' : ''}>Pagado</option>
                        <option value="enviado" ${p.estado === 'enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="entregado" ${p.estado === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelado" ${p.estado === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td>
                    <button class="btn-small btn-view" data-id="${p._id}">Ver</button>
                </td>
            </tr>
        `).join('');

        // Event listeners para cambiar estado
        tbody.querySelectorAll('.estado-select').forEach(select => {
            select.addEventListener('change', () => {
                updatePedidoEstado(select.dataset.id, select.value);
            });
        });
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

async function updatePedidoEstado(id, estado) {
    try {
        const res = await fetch('/api/admin/pedidos/' + id + '/estado', {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ estado })
        });
        const data = await res.json();

        if (data.success) {
            showToast('Estado actualizado');
        } else {
            showToast(data.error, 'error');
        }
    } catch (error) {
        showToast('Error al actualizar estado', 'error');
    }
}

// ===== Mensajes =====

async function loadMensajes() {
    try {
        const res = await fetch('/api/admin/contactos', {
            headers: getAuthHeaders()
        });
        const contactos = await res.json();

        const tbody = document.getElementById('mensajes-table-body');
        tbody.innerHTML = contactos.map(c => `
            <tr>
                <td>${new Date(c.fecha).toLocaleDateString()}</td>
                <td>${c.nombre}</td>
                <td>${c.email}</td>
                <td>${c.mensaje}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando mensajes:', error);
    }
}

async function loadNewsletter() {
    try {
        const res = await fetch('/api/admin/newsletter', {
            headers: getAuthHeaders()
        });
        const suscriptores = await res.json();

        const tbody = document.getElementById('newsletter-table-body');
        tbody.innerHTML = suscriptores.map(s => `
            <tr>
                <td>${new Date(s.fecha).toLocaleDateString()}</td>
                <td>${s.email}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error cargando suscriptores:', error);
    }
}

// ===== Toast =====

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ===== Cargar todo =====

function loadAll() {
    loadMetrics();
    loadUsuarios();
    loadProductos();
    loadPedidos();
    loadMensajes();
    loadNewsletter();
}

// Inicializar
if (checkAuth()) {
    loadAll();
}

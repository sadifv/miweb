// ============================================
// Autenticación de Usuarios - TechStore
// Estilo Shopify: Login, Registro, Recuperación
// ============================================

const AUTH_TOKEN_KEY = 'techstore_auth_token';
const AUTH_USER_KEY = 'techstore_auth_user';
const AUTH_REDIRECT_KEY = 'techstore_auth_redirect';

// ============================================
// Funciones de sesión
// ============================================

function isLoggedIn() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

function getCurrentUser() {
    const userData = localStorage.getItem(AUTH_USER_KEY);
    return userData ? JSON.parse(userData) : null;
}

function saveSession(token, usuario) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
}

function clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

function setRedirect(url) {
    localStorage.setItem(AUTH_REDIRECT_KEY, url);
}

function getRedirect() {
    const url = localStorage.getItem(AUTH_REDIRECT_KEY);
    localStorage.removeItem(AUTH_REDIRECT_KEY);
    return url;
}

// ============================================
// API Calls
// ============================================

async function registerUser(nombre, apellido, email, password, telefono) {
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido, email, password, telefono })
        });
        return await res.json();
    } catch (error) {
        console.error('Error en registro:', error);
        return { error: 'Error de conexión. Intenta de nuevo.' };
    }
}

async function loginUser(email, password) {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await res.json();
    } catch (error) {
        console.error('Error en login:', error);
        return { error: 'Error de conexión. Intenta de nuevo.' };
    }
}

async function recoverPassword(email) {
    try {
        const res = await fetch('/api/auth/recuperar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await res.json();
    } catch (error) {
        console.error('Error en recuperación:', error);
        return { error: 'Error de conexión. Intenta de nuevo.' };
    }
}

async function fetchCurrentUser() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    try {
        const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        return data.usuario || null;
    } catch (error) {
        console.error('Error verificando sesión:', error);
        return null;
    }
}

// ============================================
// UI Helpers
// ============================================

function setButtonLoading(button, loading, text = 'Procesando...') {
    if (!button) return;
    if (loading) {
        button.dataset.originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + text;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

function showFormError(form, message) {
    if (!form) return;
    let errorDiv = form.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('p');
        errorDiv.className = 'form-error';
        form.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearFormError(form) {
    if (!form) return;
    const errorDiv = form.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }
}

// ============================================
// Inicializar modal de autenticación
// ============================================

function initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const recoverForm = document.getElementById('recover-form');
    const showRecoverLink = document.getElementById('show-recuperar');
    const backToLoginLink = document.getElementById('back-to-login');

    if (!authModal) return;

    // Cambiar entre pestañas
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.auth-form-container').forEach(f => f.classList.add('hidden'));
            document.getElementById(target + '-container').classList.remove('hidden');
        });
    });

    // Mostrar recuperación de contraseña
    if (showRecoverLink) {
        showRecoverLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.auth-form-container').forEach(f => f.classList.add('hidden'));
            document.getElementById('recover-container').classList.remove('hidden');
        });
    }

    // Volver al login
    if (backToLoginLink) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.auth-form-container').forEach(f => f.classList.add('hidden'));
            document.getElementById('login-container').classList.remove('hidden');
        });
    }

    // Submit de login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormError(loginForm);

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                showFormError(loginForm, 'Por favor, completa todos los campos');
                return;
            }

            const submitBtn = loginForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true, 'Iniciando...');

            const data = await loginUser(email, password);

            setButtonLoading(submitBtn, false);

            if (data.success) {
                saveSession(data.token, data.usuario);
                showToast(data.mensaje);
                authModal.close();
                updateAuthUI();
                handlePostLoginRedirect(data.usuario);
            } else {
                showFormError(loginForm, data.error || 'Error al iniciar sesión');
            }
        });
    }

    // Submit de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormError(registerForm);

            const nombre = document.getElementById('register-name').value.trim();
            const apellido = document.getElementById('register-apellido').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;
            const telefono = document.getElementById('register-telefono')?.value.trim() || '';

            // Validaciones
            if (!nombre || !apellido || !email || !password) {
                showFormError(registerForm, 'Por favor, completa todos los campos obligatorios');
                return;
            }

            if (password !== confirmPassword) {
                showFormError(registerForm, 'Las contraseñas no coinciden');
                return;
            }

            if (password.length < 6) {
                showFormError(registerForm, 'La contraseña debe tener al menos 6 caracteres');
                return;
            }

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true, 'Creando cuenta...');

            const data = await registerUser(nombre, apellido, email, password, telefono);

            setButtonLoading(submitBtn, false);

            if (data.success) {
                saveSession(data.token, data.usuario);
                showToast(data.mensaje);
                authModal.close();
                updateAuthUI();
                handlePostLoginRedirect(data.usuario);
            } else {
                showFormError(registerForm, data.error || 'Error al crear la cuenta');
            }
        });
    }

    // Submit de recuperación
    if (recoverForm) {
        recoverForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearFormError(recoverForm);

            const email = document.getElementById('recover-email').value.trim();

            if (!email) {
                showFormError(recoverForm, 'Por favor, ingresa tu email');
                return;
            }

            const submitBtn = recoverForm.querySelector('button[type="submit"]');
            setButtonLoading(submitBtn, true, 'Enviando...');

            const data = await recoverPassword(email);

            setButtonLoading(submitBtn, false);

            if (data.success) {
                showToast(data.mensaje);
                recoverForm.reset();
                document.querySelectorAll('.auth-form-container').forEach(f => f.classList.add('hidden'));
                document.getElementById('login-container').classList.remove('hidden');
            } else {
                showFormError(recoverForm, data.error || 'Error al procesar la solicitud');
            }
        });
    }
}

// ============================================
// Redirección inteligente post-login
// ============================================

function handlePostLoginRedirect(usuario) {
    const redirectUrl = getRedirect();

    if (redirectUrl) {
        // Si venía de checkout, volver ahí
        window.location.href = redirectUrl;
    } else if (usuario.rol === 'admin') {
        // Si es admin, ir al panel de administración
        window.location.href = '/admin.html';
    } else {
        // Si es cliente, quedarse en la página actual o ir al inicio
        updateAuthUI();
    }
}

// ============================================
// Actualizar UI según estado de autenticación
// ============================================

function updateAuthUI() {
    const user = getCurrentUser();
    const userBtn = document.querySelector('.user-btn');

    if (user && userBtn) {
        // Usuario logueado
        userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        userBtn.title = `${user.nombre} ${user.apellido || ''}`;
        userBtn.classList.add('logged-in');
    } else if (userBtn) {
        // Usuario no logueado
        userBtn.innerHTML = '<i class="fas fa-user"></i>';
        userBtn.title = 'Iniciar sesión';
        userBtn.classList.remove('logged-in');
    }
}

// ============================================
// Mostrar modal de autenticación
// ============================================

function showAuthModal(redirectUrl = null) {
    if (redirectUrl) {
        setRedirect(redirectUrl);
    }

    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.showModal();
    }
}

// ============================================
// Cerrar sesión
// ============================================

function logout() {
    clearSession();
    showToast('Sesión cerrada correctamente');
    updateAuthUI();
    window.location.href = '/';
}

// ============================================
// Sincronizar carrito con cuenta (placeholder)
// ============================================

async function syncCartWithUser() {
    const user = getCurrentUser();
    if (!user) return;

    // Aquí se implementaría la sincronización del carrito con la cuenta
    // Por ahora, el carrito sigue en localStorage
    console.log('Carrito sincronizado con usuario:', user.email);
}

// ============================================
// Inicializar
// ============================================

function initAuth() {
    initAuthModal();
    updateAuthUI();

    // Verificar sesión activa al cargar
    fetchCurrentUser().then(usuario => {
        if (usuario) {
            // Actualizar datos del usuario en localStorage
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
            updateAuthUI();
            syncCartWithUser();
        }
    });
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

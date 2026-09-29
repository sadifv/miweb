// Checkout - TechStore

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
        console.error('Error:', error);
        return { items: [], subtotal: 0, descuento: 0, total: 0 };
    }
}

function showStep(stepNum) {
    // Ocultar todos los pasos
    const allSteps = document.querySelectorAll('.checkout-step');
    allSteps.forEach(s => s.classList.add('hidden'));
    
    // Mostrar solo el paso actual
    const step = document.getElementById('step-' + stepNum);
    if (step) {
        step.classList.remove('hidden');
    }
}

function showSuccess() {
    // Ocultar todos los pasos
    const allSteps = document.querySelectorAll('.checkout-step');
    allSteps.forEach(s => s.classList.add('hidden'));
    
    // Mostrar solo la pantalla de éxito
    const success = document.getElementById('step-success');
    if (success) {
        success.classList.remove('hidden');
    }
}

async function loadCheckoutItems() {
    const cart = await fetchCart();
    const container = document.getElementById('checkout-items');

    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        return;
    }

    container.innerHTML = cart.items.map(item => `
        <article class="checkout-item">
            <img src="${item.producto?.image || ''}" alt="${item.producto?.name || ''}">
            <section class="checkout-item-info">
                <h4>${item.producto?.name || 'Producto'}</h4>
                <p>Cantidad: ${item.cantidad}</p>
                <p class="checkout-item-price">$${(item.producto?.price || 0).toFixed(2)}</p>
            </section>
        </article>
    `).join('');

    // Actualizar resumen
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    
    if (subtotalEl) subtotalEl.textContent = `$${(cart.subtotal || 0).toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${(cart.total || 0).toFixed(2)}`;
    
    if (cart.descuento > 0 && discountRow && discountEl) {
        discountEl.textContent = `-$${cart.descuento.toFixed(2)}`;
        discountRow.style.display = '';
    } else if (discountRow) {
        discountRow.style.display = 'none';
    }
}

function initCheckout() {
    // Verificar que los elementos existan
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const stepSuccess = document.getElementById('step-success');
    
    if (!step1 || !step2 || !step3 || !stepSuccess) {
        console.error('Elementos del checkout no encontrados');
        return;
    }

    // Ocultar todos los pasos
    [step1, step2, step3, stepSuccess].forEach(s => s.classList.add('hidden'));
    
    // Mostrar solo el paso 1
    step1.classList.remove('hidden');

    // Registrar event listeners
    const btnToStep2 = document.getElementById('btn-to-step-2');
    const btnBackStep1 = document.getElementById('btn-back-step-1');
    const btnBackStep2 = document.getElementById('btn-back-step-2');
    const shippingForm = document.getElementById('shipping-form');
    const btnConfirmOrder = document.getElementById('btn-confirm-order');

    if (btnToStep2) {
        btnToStep2.addEventListener('click', async () => {
            const cart = await fetchCart();
            const itemCount = cart.items ? cart.items.length : 0;
            if (itemCount === 0) {
                alert('Tu carrito está vacío. Agrega productos antes de continuar.');
                return;
            }
            showStep(2);
        });
    }
    if (btnBackStep1) btnBackStep1.addEventListener('click', () => showStep(1));
    if (btnBackStep2) btnBackStep2.addEventListener('click', () => showStep(2));
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showStep(3);
        });
    }
    
    if (btnConfirmOrder) {
        btnConfirmOrder.addEventListener('click', async () => {
            try {
                await fetch('/api/carrito/vaciar', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: getSessionId() })
                });
            } catch (error) {
                console.error('Error vaciando carrito:', error);
            }
            showSuccess();
        });
    }

    // Cargar items del carrito
    loadCheckoutItems();
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCheckout);

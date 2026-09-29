// Cargar artículo desde la API
async function loadArticulo() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id') || '1';

    try {
        const respuesta = await fetch(`/api/articulos/${articleId}`);
        if (!respuesta.ok) throw new Error('Artículo no encontrado');
        const article = await respuesta.json();

        // Actualizar título de la página
        document.title = `${article.title} - TechStore`;

        // Actualizar breadcrumb
        const breadcrumbArticle = document.getElementById('breadcrumb-article');
        if (breadcrumbArticle) breadcrumbArticle.textContent = article.title;

        // Renderizar artículo
        const container = document.getElementById('blog-post-container');
        container.innerHTML = `
            <article class="blog-post-card">
                <header class="blog-post-header">
                    <span class="blog-post-category">${article.category}</span>
                    <h1 id="blog-post-title">${article.title}</h1>
                    <time datetime="${article.date}">${article.dateDisplay}</time>
                </header>
                <figure class="blog-post-image">
                    <img src="${article.image}" alt="${article.title}">
                </figure>
                <div class="blog-post-content">
                    ${article.content}
                </div>
                <footer class="blog-post-footer">
                    <a href="/#blog" class="back-link">
                        <i class="fas fa-arrow-left" aria-hidden="true"></i> Volver al blog
                    </a>
                </footer>
            </article>
        `;
    } catch (error) {
        // Artículo no encontrado
        document.title = 'Artículo no encontrado - TechStore';
        const container = document.getElementById('blog-post-container');
        container.innerHTML = `
            <article class="blog-post-not-found">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <h1>Artículo no encontrado</h1>
                <p>El artículo que buscas no existe o ha sido removido.</p>
                <a href="/#blog" class="btn btn-primary">
                    <i class="fas fa-arrow-left" aria-hidden="true"></i> Volver al blog
                </a>
            </article>
        `;
    }
}

// Cargar artículo al iniciar
loadArticulo();

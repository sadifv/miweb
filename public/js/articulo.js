// Datos de artículos del blog
const articlesData = {
    1: {
        title: 'Los 10 dispositivos tecnológicos indispensables del 2026',
        category: 'Guías',
        date: '2026-03-15',
        dateDisplay: '15 Mar 2026',
        image: '/assets/blog-gadgets.jpg',
        excerpt: 'Descubre qué dispositivos están marcando tendencia este año y cuáles valen la pena.',
        content: `
            <p>El 2026 ha sido un año revolucionario para la tecnología de consumo. Desde wearables hasta dispositivos inteligentes para el hogar, la innovación no se detiene. En este artículo, te presentamos los 10 dispositivos que consideramos indispensables para este año.</p>
            <h2>1. Smartwatch con monitor de salud avanzado</h2>
            <p>Los smartwatches han evolucionado más allá de simplemente mostrar notificaciones. Los modelos de 2026 incluyen monitoreo de glucosa no invasivo, detección de arritmias avanzada y seguimiento de estrés con IA.</p>
            <h2>2. Auriculares con cancelación adaptativa</h2>
            <p>La cancelación de ruido ha alcanzado nuevos niveles. Los auriculares de 2026 se adaptan automáticamente a tu entorno, creando una experiencia de audio personalizada en cada situación.</p>
            <h2>3. Tablet con pantalla flexible</h2>
            <p>Las pantallas flexibles por fin son una realidad comercial. Estas tablets se doblan para un transporte fácil y se despliegan para una experiencia de visualización inmersiva.</p>
            <h2>4. Asistente de hogar con IA generativa</h2>
            <p>Los asistentes inteligentes ahora pueden mantener conversaciones naturales, aprender tus hábitos y proactivamente sugerir acciones basadas en tu rutina diaria.</p>
            <h2>5. Cámara de seguridad con visión nocturna a color</h2>
            <p>La tecnología de sensores ha avanzado tanto que las cámaras de seguridad ahora capturan video en color incluso en condiciones de oscuridad total.</p>
            <h2>6. Teclado mecánico con switches magnéticos</h2>
            <p>Los switches magnéticos permiten ajustar la sensibilidad de cada tecla individualmente, creando una experiencia de escritura personalizada sin precedentes.</p>
            <h2>7. Mouse con retroalimentación háptica</h2>
            <p>La retroalimentación háptica en los mice de gaming permite sentir texturas y acciones en los juegos, sumergiéndote completamente en la experiencia.</p>
            <h2>8. Cargador inalámbrico de largo alcance</2>
            <p>Los cargadores inalámbricos de 2026 funcionan a distancias de hasta 30 cm, permitiendo cargar tus dispositivos sin necesidad de colocarlos sobre una base.</p>
            <h2>9. Webcam con seguimiento automático</h2>
            <p>Las webcams con IA te siguen automáticamente durante videollamadas, manteniéndote siempre en el centro de la imagen sin necesidad de ajustes manuales.</p>
            <h2>10. Dispositivo de almacenamiento con cifrado cuántico</h2>
            <p>La seguridad de datos alcanza nuevos niveles con el cifrado cuántico, haciendo que tus archivos sean prácticamente imposibles de hackear.</p>
            <p>Estos dispositivos representan lo mejor de la tecnología en 2026. ¿Cuál de ellos te gustaría tener? Cuéntanos en los comentarios.</p>
        `
    },
    2: {
        title: 'Review: ¿Valen la pena los auriculares ANC?',
        category: 'Reviews',
        date: '2026-03-10',
        dateDisplay: '10 Mar 2026',
        image: '/assets/blog-headphones.jpg',
        excerpt: 'Probamos los mejores modelos del mercado y te contamos cuál elegir según tu presupuesto.',
        content: `
            <p>La cancelación activa de ruido (ANC) se ha convertido en una característica esencial en los auriculares modernos. Pero ¿realmente vale la pena pagar más por esta tecnología? Lo probamos para ti.</p>
            <h2>¿Cómo funciona la cancelación de ruido?</h2>
            <p>La tecnología ANC utiliza micrófonos externos para capturar el ruido ambiental y generar ondas sonoras opuestas que lo cancelan. El resultado es una experiencia de audio inmersiva incluso en entornos ruidosos.</p>
            <h2>Nuestras pruebas</h2>
            <p>Probamos 5 modelos de diferentes rangos de precio durante 2 semanas en diferentes entornos: oficina, transporte público, cafeterías y aviones.</p>
            <h2>Gama alta: Sony WH-1000XM6</h2>
            <p>Los Sony WH-1000XM6 ofrecen la mejor cancelación de ruido del mercado. Su sonido es equilibrado y su batería de 40 horas es imprescindible para viajes largos. Precio: $399.</p>
            <h2>Gama media: Anker Soundcore Space One</h2>
            <p>Una excelente alternativa con el 90% de la calidad de los Sony a la mitad del precio. La cancelación de ruido es muy buena y el sonido es ligeramente más cálido. Precio: $149.</p>
            <h2>Gama económica: EarFun Air Pro 3</h2>
            <p>Sorprendentemente buenos para su precio. La cancelación de ruido es decente y el sonido es más que aceptable para el uso diario. Precio: $79.</p>
            <h2>Veredicto final</h2>
            <p>Si viajas frecuentes o trabajas en entornos ruidosos, la inversión en unos buenos auriculares ANC vale totalmente la pena. Para uso ocasional, las opciones de gama media ofrecen la mejor relación calidad-precio.</p>
        `
    },
    3: {
        title: 'Cómo un smartwatch puede mejorar tu salud',
        category: 'Salud',
        date: '2026-03-05',
        dateDisplay: '5 Mar 2026',
        image: '/assets/blog-smartwatch.jpg',
        excerpt: 'Monitorización cardiaca, sueño y actividad: todo lo que debes saber antes de comprar.',
        content: `
            <p>Los smartwatches han evolucionado de simples notificaciones a verdaderos dispositivos de monitorización de salud. Descubre cómo pueden ayudarte a llevar una vida más saludable.</p>
            <h2>Monitorización cardíaca continua</h2>
            <p>Los sensores ópticos modernos pueden medir tu ritmo cardíaco las 24 horas del día, detectando irregularidades como la fibrilación auricular antes de que se conviertan en un problema serio.</p>
            <h2>Análisis del sueño</h2>
            <p>Los smartwatches actuales pueden detectar las diferentes fases del sueño (ligero, profundo, REM) y darte recomendaciones personalizadas para mejorar tu descanso.</p>
            <h2>Seguimiento de actividad</h2>
            <p>Más allá de contar pasos, los dispositivos modernos pueden detectar automáticamente diferentes tipos de ejercicio y calcular las calorías quemadas con mayor precisión.</p>
            <h2>Oxígeno en sangre (SpO2)</h2>
            <p>La saturación de oxígeno en sangre es un indicador importante de salud respiratoria. Los smartwatches pueden medirla continuamente y alertarte de niveles anormales.</p>
            <h2>Detección de caídas y SOS</h2>
            <p>Los sensores de movimiento avanzados pueden detectar caídas graves y automáticamente contactar servicios de emergencia con tu ubicación.</p>
            <h2>Consejos para aprovechar tu smartwatch</h2>
            <p>Para obtener los mejores resultados, usa tu smartwatch consistentemente, configura alertas de salud personalizadas y revisa los datos semanalmente para identificar patrones.</p>
            <p>Recuerda que los smartwatches son herramientas de bienestar, no dispositivos médicos. Siempre consulta a un profesional de la salud para decisiones médicas importantes.</p>
        `
    }
};

// Obtener ID del artículo desde la URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id') || '1';
const article = articlesData[articleId];

if (article) {
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
} else {
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

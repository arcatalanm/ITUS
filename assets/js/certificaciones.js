/**
 * ITUS - Módulo de Certificaciones, Cursos y Carrito de Compras (E-Commerce Académico)
 * Cumple con especificaciones de la rúbrica DSY1104:
 * - Catálogo con al menos 4 productos claramente diferenciados
 * - Campos requeridos: Código (mín. 3), Nombre (máx. 100), Precio (mín. 0, decimales, 0=FREE), Stock, Stock Crítico
 * - Persistencia del carrito en LocalStorage
 * - Navegación entre catálogo y detalle de producto (detalle.html)
 * - Sincronización de contador en barra de navegación
 */

// ==========================================
// 1. BASE DE DATOS DE CERTIFICACIONES / CURSOS
// ==========================================
const CERTIFICACIONES_INICIALES = [
    {
        id: "AWS-01",
        nombre: "AWS Certified Cloud Practitioner",
        entidad: "AWS",
        categoria: "Cloud Computing",
        horas: 40,
        precio: 0, // FREE (beneficio ITUS)
        gratuito: true,
        stock: 25,
        stockCritico: 5,
        icon: "https://skillicons.dev/icons?i=aws",
        destacado: true,
        descripcionCorta: "Fundamentos de computación en la nube de Amazon Web Services, seguridad, arquitectura y facturación.",
        descripcionLarga: "Este curso oficial capacita a los participantes en los principios esenciales de la nube de Amazon Web Services (AWS). Aborda conceptos clave de infraestructura global, modelos de despliegue, servicios principales (EC2, S3, RDS), esquemas de seguridad compartida y optimización de costos. Incluye simuladores de examen oficial y laboratorios prácticos en entornos sandbox de AWS.",
        temario: [
            "Módulo 1: Introducción a AWS Cloud y propuesta de valor",
            "Módulo 2: Infraestructura global y regiones de alta disponibilidad",
            "Módulo 3: Servicios de Cómputo (EC2, Lambda) y Almacenamiento (S3, EBS)",
            "Módulo 4: Seguridad y modelo de responsabilidad compartida",
            "Módulo 5: Gestión financiera y preparación para examen CLF-C02"
        ]
    },
    {
        id: "CIS-01",
        nombre: "Cisco CCNA 200-301: Network Associate",
        entidad: "Cisco",
        categoria: "Conectividad y Redes",
        horas: 200,
        precio: 75000,
        gratuito: false,
        stock: 14,
        stockCritico: 4,
        icon: "https://cdn.worldvectorlogo.com/logos/cisco-2.svg",
        destacado: true,
        descripcionCorta: "Diseño, configuración, routing, switching y aseguramiento de redes empresariales.",
        descripcionLarga: "El programa oficial Cisco CCNA 200-301 es el estándar global de la industria para profesionales de redes. Los estudiantes aprenderán a instalar, operar y solucionar problemas en redes de tamaño mediano y grande, dominando protocolos IPv4/IPv6, VLANs, STP, OSPF, seguridad en capas de acceso y fundamentos de automatización con Cisco DNA Center y Python.",
        temario: [
            "Módulo 1: Fundamentos de redes y modelos OSI / TCP-IP",
            "Módulo 2: Acceso a la red, VLANs, Trunking y STP",
            "Módulo 3: Conectividad IP y enrutamiento dinámico OSPF",
            "Módulo 4: Servicios IP (DHCP, DNS, NAT, NTP)",
            "Módulo 5: Fundamentos de ciberseguridad en redes y automatización"
        ]
    },
    {
        id: "MS-01",
        nombre: "Microsoft Azure Fundamentals (AZ-900)",
        entidad: "Microsoft",
        categoria: "Cloud Computing",
        horas: 24,
        precio: 0, // FREE
        gratuito: true,
        stock: 30,
        stockCritico: 6,
        icon: "https://skillicons.dev/icons?i=azure",
        destacado: true,
        descripcionCorta: "Conceptos de nube de Microsoft Azure, servicios de identidad, gobierno y privacidad.",
        descripcionLarga: "Certificación orientada a estudiantes que deseen validar un conocimiento fundamental de los servicios en la nube de Microsoft Azure. Cubre conceptos de computación en la nube pública, privada e híbrida, arquitectura de Azure, servicios de bases de datos, herramientas de gobierno corporativo, cumplimiento normativo y herramientas de monitoreo continuo.",
        temario: [
            "Módulo 1: Conceptos y principios de Cloud Computing",
            "Módulo 2: Arquitectura y componentes clave de Microsoft Azure",
            "Módulo 3: Soluciones de almacenamiento, cómputo y redes virtuales",
            "Módulo 4: Seguridad, gobernanza corporativa e identidad (Entra ID)",
            "Módulo 5: Gestión de costos y SLA en Azure"
        ]
    },
    {
        id: "CIS-02",
        nombre: "Cisco CyberOps Associate",
        entidad: "Cisco",
        categoria: "Ciberseguridad",
        horas: 70,
        precio: 49990,
        gratuito: false,
        stock: 3, // Stock crítico intencional para demostrar alerta
        stockCritico: 5,
        icon: "https://cdn.worldvectorlogo.com/logos/cisco-2.svg",
        destacado: true,
        descripcionCorta: "Operaciones de Centros de Operaciones de Seguridad (SOC), monitoreo de amenazas e incidentes.",
        descripcionLarga: "Diseñado para futuros analistas de ciberseguridad en Centros de Operaciones de Seguridad (SOC). Enseña a detectar vulnerabilidades, analizar anomalías de tráfico de red, investigar incidentes informáticos y aplicar metodologías de respuesta rápida frente a ataques avanzados de malware, phishing y denegación de servicio.",
        temario: [
            "Módulo 1: Entorno operativo de un Security Operations Center (SOC)",
            "Módulo 2: Análisis forense en sistemas Windows y Linux",
            "Módulo 3: Protocolos de red y análisis de paquetes con Wireshark",
            "Módulo 4: Detección y mitigación de intrusiones con Snort y Zeek",
            "Módulo 5: Gestión de incidentes y normativas NIST / ISO 27001"
        ]
    },
    {
        id: "GOO-01",
        nombre: "Google Cloud Associate Cloud Engineer",
        entidad: "Google Cloud",
        categoria: "Cloud & Big Data",
        horas: 60,
        precio: 89990,
        gratuito: false,
        stock: 18,
        stockCritico: 4,
        icon: "https://skillicons.dev/icons?i=gcp",
        destacado: false,
        descripcionCorta: "Despliegue y administración de aplicaciones y clusters de Kubernetes en Google Cloud Platform.",
        descripcionLarga: "Capacita en la configuración, supervisión y gestión de soluciones en GCP. Desarrolla destrezas prácticas en Google Kubernetes Engine (GKE), BigQuery, Cloud Storage y Compute Engine utilizando tanto la consola web de Google como la herramienta de línea de comandos gcloud SDK.",
        temario: [
            "Módulo 1: Configuración de proyectos y facturación en Google Cloud",
            "Módulo 2: Planificación y configuración de soluciones de cómputo",
            "Módulo 3: Despliegue de aplicaciones en Google Kubernetes Engine",
            "Módulo 4: Operaciones y almacenamiento de Big Data en BigQuery",
            "Módulo 5: Gestión de accesos y seguridad con IAM"
        ]
    },
    {
        id: "ORA-01",
        nombre: "Oracle Database SQL Certified Associate",
        entidad: "Oracle",
        categoria: "Bases de Datos & Big Data",
        horas: 50,
        precio: 65000,
        gratuito: false,
        stock: 8,
        stockCritico: 3,
        icon: "https://cdn.worldvectorlogo.com/logos/oracle-6.svg",
        destacado: false,
        descripcionCorta: "Modelamiento relacional avanzado, consultas SQL complejas, índices y transacciones ACID.",
        descripcionLarga: "Valida competencias técnicas avanzadas en lenguaje SQL sobre bases de datos Oracle. Permite a los estudiantes dominar sentencias DML, DDL y DCL, diseño relacional óptimo, subconsultas correlacionadas, funciones analíticas y afinamiento de rendimiento.",
        temario: [
            "Módulo 1: Fundamentos de bases de datos relacionales y diseño",
            "Módulo 2: Consultas estructuradas avanzadas y joins múltiples",
            "Módulo 3: Funciones analíticas y agregaciones complejas",
            "Módulo 4: Vistas, secuencias, índices y sinónimos",
            "Módulo 5: Control de transacciones, bloqueos e integridad de datos"
        ]
    }
];

const STORAGE_KEY_CERTIFICACIONES = 'itus_certificaciones';

function inicializarCertificacionesLocalStorage() {
    let certificaciones = [];
    try {
        const data = localStorage.getItem(STORAGE_KEY_CERTIFICACIONES);
        if (data) {
            certificaciones = JSON.parse(data);
        }
    } catch (e) {
        console.error("Error parseando certificaciones desde LocalStorage", e);
    }

    if (certificaciones.length === 0) {
        certificaciones = [...CERTIFICACIONES_INICIALES];
        localStorage.setItem(STORAGE_KEY_CERTIFICACIONES, JSON.stringify(certificaciones));
    }
    return certificaciones;
}

window.obtenerCertificaciones = function() {
    return inicializarCertificacionesLocalStorage();
};

window.guardarCertificaciones = function(certificaciones) {
    localStorage.setItem(STORAGE_KEY_CERTIFICACIONES, JSON.stringify(certificaciones));
};

// Compartir globalmente
window.ITUS_CERTIFICACIONES_DB = inicializarCertificacionesLocalStorage();

// ==========================================
// 2. GESTIÓN DEL CARRITO EN LOCALSTORAGE
// ==========================================
const STORAGE_KEY_CART = 'itus_cart';

function getCarrito() {
    try {
        const data = localStorage.getItem(STORAGE_KEY_CART);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(carrito));
    if (typeof actualizarContadorCarritoNavbar === 'function') {
        actualizarContadorCarritoNavbar();
    }
}

function agregarAlCarrito(id) {
    const carrito = getCarrito();
    if (!carrito.some(item => item.id === id)) {
        const item = obtenerCertificaciones().find(c => c.id === id);
        if (item) {
            carrito.push(item);
            guardarCarrito(carrito);
            return { success: true, item: item };
        }
    }
    return { success: false, message: "El curso ya está en tu carrito o no existe." };
}

function eliminarDelCarrito(id) {
    let carrito = getCarrito();
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito(carrito);
}

function vaciarCarrito() {
    localStorage.removeItem(STORAGE_KEY_CART);
    if (typeof actualizarContadorCarritoNavbar === 'function') {
        actualizarContadorCarritoNavbar();
    }
}

// Formateador de moneda en pesos chilenos
function formatearCLP(valor) {
    if (valor === 0) return 'GRATUITO (FREE)';
    return `$${valor.toLocaleString('es-CL')}`;
}

// ==========================================
// 3. INICIALIZADOR DE PÁGINAS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    const isSubdir = window.location.pathname.includes('/certificaciones/');
    const prefix = isSubdir ? '' : 'certificaciones/';
    const prefixBack = isSubdir ? '../' : '';

    // A. Si estamos en la página de Catálogo (certificaciones.html)
    const catalogoDiv = document.getElementById('catalogo-certificaciones');
    const listaResumen = document.getElementById('lista-resumen');
    const totalHorasSpan = document.getElementById('total-horas');
    const totalMontoSpan = document.getElementById('total-monto');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const inputFiltroEntidad = document.getElementById('filtroEntidad');

    if (catalogoDiv) {

        function renderizarCatalogo(filtro = 'Todas') {
            catalogoDiv.innerHTML = '';
            const carrito = getCarrito();

            const cursosMostrados = filtro === 'Todas'
                ? obtenerCertificaciones()
                : obtenerCertificaciones().filter(c => c.entidad === filtro);

            cursosMostrados.forEach(cert => {
                const yaAgregado = carrito.some(item => item.id === cert.id);
                const btnClass = yaAgregado ? 'btn-secondary disabled' : 'btn-warning text-dark fw-bold';
                const btnText = yaAgregado ? 'En tu Selección' : 'Añadir al Carrito';
                
                // Alerta de stock crítico (Requisito de Pauta)
                const esCritico = cert.stock <= cert.stockCritico;
                const alertaStock = esCritico 
                    ? `<span class="badge bg-danger text-white me-2"><i class="bi bi-fire"></i> ¡Últimos ${cert.stock} cupos!</span>`
                    : `<span class="badge bg-light text-muted border me-2"><i class="bi bi-check2"></i> ${cert.stock} cupos disponibles</span>`;

                const badgePrecio = cert.precio === 0
                    ? `<span class="badge bg-success fs-6">100% BECA ITUS (FREE)</span>`
                    : `<span class="badge bg-primary fs-6">${formatearCLP(cert.precio)}</span>`;

                const card = document.createElement('div');
                card.className = 'card shadow-sm border-0 mb-3 rounded-4 overflow-hidden';
                card.innerHTML = `
                    <div class="card-body p-4">
                        <div class="row align-items-center g-3">
                            <div class="col-12 col-md-2 text-center">
                                <img src="${cert.icon}" alt="${cert.entidad}" class="img-fluid p-2" style="max-height: 70px; object-fit: contain;">
                            </div>
                            <div class="col-12 col-md-7">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                    <span class="badge bg-dark">${cert.entidad}</span>
                                    <span class="badge bg-secondary-subtle text-secondary border font-monospace">${cert.id}</span>
                                    <span class="badge bg-info-subtle text-info-emphasis">${cert.categoria}</span>
                                </div>
                                <h4 class="h5 fw-bold text-itus-title mb-1">
                                    <a href="${prefix}detalle.html?id=${cert.id}" class="text-decoration-none text-itus-title hover-accent">
                                        ${cert.nombre}
                                    </a>
                                </h4>
                                <p class="small text-muted mb-2">${cert.descripcionCorta}</p>
                                <div class="d-flex flex-wrap align-items-center gap-2">
                                    ${alertaStock}
                                    <span class="small text-muted"><i class="bi bi-clock"></i> ${cert.horas} hrs</span>
                                </div>
                            </div>
                            <div class="col-12 col-md-3 text-md-end d-flex flex-column justify-content-center gap-2">
                                <div>${badgePrecio}</div>
                                <div class="d-grid gap-2">
                                    <a href="${prefix}detalle.html?id=${cert.id}" class="btn btn-outline-primary btn-sm rounded-pill">
                                        <i class="bi bi-eye"></i> Ver Detalle
                                    </a>
                                    <button class="btn ${btnClass} btn-sm rounded-pill add-btn shadow-sm" data-id="${cert.id}">
                                        <i class="bi ${yaAgregado ? 'bi-check2' : 'bi-cart-plus'}"></i> ${btnText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                catalogoDiv.appendChild(card);
            });

            // Listeners a los botones de añadir
            document.querySelectorAll('.add-btn').forEach(btn => {
                if (!btn.classList.contains('disabled')) {
                    btn.addEventListener('click', (e) => {
                        const id = e.currentTarget.dataset.id;
                        agregarAlCarrito(id);
                        renderizarCatalogo(inputFiltroEntidad ? inputFiltroEntidad.value : 'Todas');
                        renderizarCarritoResumen();
                    });
                }
            });
        }

        function renderizarCarritoResumen() {
            const carrito = getCarrito();
            listaResumen.innerHTML = '';
            let totalHoras = 0;
            let totalMonto = 0;

            if (carrito.length === 0) {
                listaResumen.innerHTML = `
                    <li class="list-group-item text-muted text-center py-4 small">
                        <i class="bi bi-cart-x fs-2 text-secondary opacity-50 d-block mb-1"></i>
                        Tu postulación académica está vacía.<br>Selecciona un programa para comenzar.
                    </li>
                `;
                if (btnFinalizar) btnFinalizar.disabled = true;
            } else {
                carrito.forEach(item => {
                    totalHoras += item.horas;
                    totalMonto += item.precio;

                    const li = document.createElement('li');
                    li.className = 'list-group-item d-flex justify-content-between align-items-center py-3';
                    li.innerHTML = `
                        <div class="ms-1 me-auto">
                            <div class="fw-bold small text-dark">${item.nombre}</div>
                            <span class="badge bg-secondary-subtle text-secondary font-monospace" style="font-size: 0.7rem;">${item.id}</span>
                            <span class="text-muted small ms-2">${item.horas} hrs | ${formatearCLP(item.precio)}</span>
                        </div>
                        <button class="btn btn-sm text-danger remove-btn p-1 ms-2" data-id="${item.id}" title="Quitar de mi postulación">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    `;
                    listaResumen.appendChild(li);
                });
                if (btnFinalizar) btnFinalizar.disabled = false;
            }

            if (totalHorasSpan) totalHorasSpan.textContent = `${totalHoras} hrs`;
            if (totalMontoSpan) totalMontoSpan.textContent = formatearCLP(totalMonto);

            // Listeners a los botones de quitar
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    eliminarDelCarrito(id);
                    renderizarCatalogo(inputFiltroEntidad ? inputFiltroEntidad.value : 'Todas');
                    renderizarCarritoResumen();
                });
            });
        }

        if (inputFiltroEntidad) {
            inputFiltroEntidad.addEventListener('change', (e) => {
                renderizarCatalogo(e.target.value);
            });
        }

        if (btnFinalizar) {
            btnFinalizar.addEventListener('click', () => {
                const modalExito = document.getElementById('checkoutExitoAlert');
                if (modalExito) {
                    modalExito.classList.remove('d-none');
                } else {
                    alert('¡Inscripción procesada con éxito! Has postulado a tus programas de certificación.');
                }
                vaciarCarrito();
                renderizarCatalogo();
                renderizarCarritoResumen();
            });
        }

        renderizarCatalogo();
        renderizarCarritoResumen();
    }

    // B. Si estamos en la página de Detalle de Producto (detalle.html)
    const detalleContenedor = document.getElementById('detalle-producto-container');
    if (detalleContenedor) {
        const urlParams = new URLSearchParams(window.location.search);
        const productoId = urlParams.get('id') || 'AWS-01'; // Default al primero si no viene
        const db = obtenerCertificaciones();
        const producto = db.find(p => p.id === productoId) || db[0];

        const carrito = getCarrito();
        const yaAgregado = carrito.some(i => i.id === producto.id);
        const esCritico = producto.stock <= producto.stockCritico;

        document.title = `${producto.nombre} | Detalle de Certificación ITUS`;

        detalleContenedor.innerHTML = `
            <div class="row g-4 align-items-start">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <nav aria-label="breadcrumb" class="mb-3">
                            <ol class="breadcrumb small">
                                <li class="breadcrumb-item"><a href="../index.html">Inicio</a></li>
                                <li class="breadcrumb-item"><a href="certificaciones.html">Certificaciones</a></li>
                                <li class="breadcrumb-item active" aria-current="page">${producto.id}</li>
                            </ol>
                        </nav>

                        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                            <span class="badge bg-dark">${producto.entidad}</span>
                            <span class="badge bg-secondary-subtle text-secondary font-monospace">${producto.id}</span>
                            <span class="badge bg-info-subtle text-info-emphasis">${producto.categoria}</span>
                            ${esCritico ? `<span class="badge bg-danger"><i class="bi bi-fire"></i> ¡Últimos ${producto.stock} cupos!</span>` : `<span class="badge bg-light text-muted border">${producto.stock} cupos disponibles</span>`}
                        </div>

                        <h1 class="display-6 fw-bold text-itus-title mb-3">${producto.nombre}</h1>

                        <div class="p-3 bg-light rounded-3 mb-4 d-flex flex-wrap gap-4 align-items-center">
                            <div>
                                <span class="small text-muted d-block">Duración</span>
                                <strong class="fs-5 text-dark"><i class="bi bi-clock me-1"></i>${producto.horas} Horas</strong>
                            </div>
                            <div class="border-start ps-4">
                                <span class="small text-muted d-block">Modalidad</span>
                                <strong class="fs-5 text-dark"><i class="bi bi-laptop me-1"></i>Híbrida / Online</strong>
                            </div>
                            <div class="border-start ps-4">
                                <span class="small text-muted d-block">Inversión / Costo</span>
                                <strong class="fs-5 text-itus-accent">${formatearCLP(producto.precio)}</strong>
                            </div>
                        </div>

                        <h4 class="h5 fw-bold text-itus-title mb-2">Descripción General del Programa</h4>
                        <p class="text-muted fs-6 lh-base mb-4">${producto.descripcionLarga}</p>

                        <h4 class="h5 fw-bold text-itus-title mb-3">Temario y Contenidos Oficiales</h4>
                        <ul class="list-group list-group-flush mb-4 rounded-3 border">
                            ${producto.temario.map(item => `
                                <li class="list-group-item py-3">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i> ${item}
                                </li>
                            `).join('')}
                        </ul>

                        <div class="d-flex gap-3 mt-2">
                            <a href="certificaciones.html" class="btn btn-outline-secondary rounded-pill px-4">
                                <i class="bi bi-arrow-left me-1"></i> Volver al Catálogo
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style="top: 100px;">
                        <div class="text-center mb-4">
                            <img src="${producto.icon}" alt="${producto.entidad}" style="max-height: 90px; object-fit: contain;" class="mb-3">
                            <h4 class="h5 fw-bold text-dark mb-1">Inscripción Oficial</h4>
                            <p class="small text-muted">Asegura tu cupo en esta convocatoria académica</p>
                            <div class="display-6 fw-bold text-itus-accent my-2">${formatearCLP(producto.precio)}</div>
                        </div>

                        <div id="detalleAlert" class="alert alert-success d-none mb-3 small" role="alert"></div>

                        <div class="d-grid gap-2">
                            <button class="btn ${yaAgregado ? 'btn-secondary disabled' : 'btn-itus-accent'} btn-lg rounded-pill fw-bold py-3" id="btnAgregarDetalle">
                                <i class="bi ${yaAgregado ? 'bi-check2' : 'bi-cart-plus-fill'} me-2"></i> ${yaAgregado ? 'Ya en tu Carrito' : 'Añadir al Carrito'}
                            </button>
                            <a href="certificaciones.html" class="btn btn-outline-dark rounded-pill py-2">
                                <i class="bi bi-cart-check me-1"></i> Ver mi Postulación
                            </a>
                        </div>
                        <div class="mt-4 border-top pt-3 text-muted small">
                            <p class="mb-1"><i class="bi bi-shield-check text-success me-2"></i>Certificación oficial con validez internacional.</p>
                            <p class="mb-1"><i class="bi bi-award text-warning me-2"></i>Incluye voucher oficial de examen para alumnos ITUS.</p>
                            <p class="mb-0"><i class="bi bi-person-workspace text-primary me-2"></i>Tutorías con ingenieros certificados.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const btnAgregarDetalle = document.getElementById('btnAgregarDetalle');
        const detalleAlert = document.getElementById('detalleAlert');

        if (btnAgregarDetalle && !yaAgregado) {
            btnAgregarDetalle.addEventListener('click', () => {
                agregarAlCarrito(producto.id);
                btnAgregarDetalle.classList.remove('btn-itus-accent');
                btnAgregarDetalle.classList.add('btn-secondary', 'disabled');
                btnAgregarDetalle.innerHTML = '<i class="bi bi-check2 me-2"></i> Agregado con Éxito';

                detalleAlert.textContent = `¡"${producto.nombre}" ha sido añadido a tu postulación!`;
                detalleAlert.classList.remove('d-none');
            });
        }
    }

    // C. Si estamos en index.html y hay contenedor para Cursos Destacados
    const contenedorDestacados = document.getElementById('contenedor-cursos-destacados');
    if (contenedorDestacados) {
        contenedorDestacados.innerHTML = '';
        const carrito = getCarrito();
        const destacados = obtenerCertificaciones().filter(c => c.destacado).slice(0, 4);

        destacados.forEach(item => {
            const yaAgregado = carrito.some(c => c.id === item.id);
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-3';
            col.innerHTML = `
                <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                    <div class="p-4 text-center bg-light border-bottom">
                        <img src="${item.icon}" alt="${item.entidad}" style="height: 56px; object-fit: contain;">
                    </div>
                    <div class="card-body p-4 d-flex flex-column flex-grow-1">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-dark">${item.entidad}</span>
                            <span class="badge bg-warning text-dark font-monospace">${item.id}</span>
                        </div>
                        <h5 class="card-title fw-bold text-itus-title mb-2">
                            <a href="certificaciones/detalle.html?id=${item.id}" class="text-decoration-none text-itus-title hover-accent">
                                ${item.nombre}
                            </a>
                        </h5>
                        <p class="card-text text-muted small flex-grow-1 mb-3">${item.descripcionCorta}</p>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="small text-muted"><i class="bi bi-clock"></i> ${item.horas} hrs</span>
                            <span class="fw-bold text-itus-title">${formatearCLP(item.precio)}</span>
                        </div>
                        <div class="d-grid gap-2 mt-auto">
                            <a href="certificaciones/detalle.html?id=${item.id}" class="btn btn-outline-primary btn-sm rounded-pill">
                                Ver Detalle
                            </a>
                        </div>
                    </div>
                </div>
            `;
            contenedorDestacados.appendChild(col);
        });
    }

});

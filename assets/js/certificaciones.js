document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Base of Certifications
    const certificacionesDB = [
        { id: "AWS-01", nombre: "AWS Certified Cloud Practitioner", entidad: "AWS", horas: 40, gratuito: true, icon: "https://skillicons.dev/icons?i=aws" },
        { id: "AWS-02", nombre: "AWS Certified Solutions Architect", entidad: "AWS", horas: 120, gratuito: false, icon: "https://skillicons.dev/icons?i=aws" },
        { id: "CIS-01", nombre: "Cisco CCNA 200-301", entidad: "Cisco", horas: 200, gratuito: false, icon: "https://cdn.worldvectorlogo.com/logos/cisco-2.svg" },
        { id: "CIS-02", nombre: "Cisco CyberOps Associate", entidad: "Cisco", horas: 70, gratuito: true, icon: "https://cdn.worldvectorlogo.com/logos/cisco-2.svg" },
        { id: "MS-01", nombre: "Microsoft Azure Fundamentals", entidad: "Microsoft", horas: 24, gratuito: true, icon: "https://skillicons.dev/icons?i=azure" },
        { id: "GOO-01", nombre: "Google Cloud Associate Engineer", entidad: "Google Cloud", horas: 60, gratuito: false, icon: "https://skillicons.dev/icons?i=gcp" }
    ];

    // 2. DOM Elements
    const catalogoDiv = document.getElementById('catalogo-certificaciones');
    const listaResumen = document.getElementById('lista-resumen');
    const totalHorasSpan = document.getElementById('total-horas');
    const btnFinalizar = document.getElementById('btn-finalizar');

    // 3. LocalStorage Logic
    const STORAGE_KEY = 'itus_certificaciones';

    function getCarrito() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function guardarCarrito(carrito) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    }

    // 4. Render Catalog
    function renderCatalogo() {
        catalogoDiv.innerHTML = '';
        const carrito = getCarrito();

        certificacionesDB.forEach(cert => {
            const yaAgregado = carrito.some(item => item.id === cert.id);
            const btnClass = yaAgregado ? 'btn-secondary disabled' : 'btn-warning text-dark fw-bold';
            const btnText = yaAgregado ? 'Agregado' : 'Añadir a mi selección';
            const badgeGratis = cert.gratuito ? `<span class="badge bg-success mb-2">Gratis Alumnos ITUS</span>` : '';

            const card = document.createElement('div');
            card.className = 'card shadow-sm border-0 mb-3';
            card.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${cert.icon}" alt="${cert.entidad}" style="width: 48px; height: 48px; object-fit: contain;">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-1">
                                <span class="badge bg-dark">${cert.entidad}</span>
                                <span class="text-muted small">${cert.id}</span>
                            </div>
                            <h5 class="card-title fw-bold text-itus-title mb-1">${cert.nombre}</h5>
                            <p class="card-text small text-muted mb-0"><i class="bi bi-clock"></i> ${cert.horas} horas cronológicas</p>
                            <div class="mt-2">${badgeGratis}</div>
                        </div>
                    </div>
                    <div>
                        <button class="btn ${btnClass} btn-sm add-btn shadow-sm" data-id="${cert.id}">
                            <i class="bi ${yaAgregado ? 'bi-check2' : 'bi-cart-plus'}"></i> ${btnText}
                        </button>
                    </div>
                </div>
            `;
            catalogoDiv.appendChild(card);
        });

        // Add event listeners to newly rendered buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            if (!btn.classList.contains('disabled')) {
                btn.addEventListener('click', (e) => {
                    agregarAlCarrito(e.target.closest('.add-btn').dataset.id);
                });
            }
        });
    }

    // 5. Render Cart (Resumen)
    function renderResumen() {
        const carrito = getCarrito();
        listaResumen.innerHTML = '';
        let totalHoras = 0;

        if (carrito.length === 0) {
            listaResumen.innerHTML = '<li class="list-group-item text-muted text-center py-4 small">Tu postulación está vacía</li>';
            btnFinalizar.disabled = true;
        } else {
            carrito.forEach(item => {
                totalHoras += item.horas;
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-start py-3';
                li.innerHTML = `
                    <div class="ms-2 me-auto">
                        <div class="fw-bold small">${item.nombre}</div>
                        <span class="text-muted" style="font-size: 0.75rem;">${item.horas} hrs</span>
                    </div>
                    <button class="btn btn-sm text-danger remove-btn p-0 ms-2" data-id="${item.id}" title="Quitar">
                        <i class="bi bi-trash"></i>
                    </button>
                `;
                listaResumen.appendChild(li);
            });
            btnFinalizar.disabled = false;
        }

        totalHorasSpan.textContent = `${totalHoras} hrs`;

        // Event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                eliminarDelCarrito(e.target.closest('.remove-btn').dataset.id);
            });
        });
    }

    // 6. Cart Actions
    function agregarAlCarrito(id) {
        const carrito = getCarrito();
        if (!carrito.some(item => item.id === id)) {
            const cert = certificacionesDB.find(c => c.id === id);
            if (cert) {
                carrito.push(cert);
                guardarCarrito(carrito);
                renderCatalogo();
                renderResumen();
            }
        }
    }

    function eliminarDelCarrito(id) {
        let carrito = getCarrito();
        carrito = carrito.filter(item => item.id !== id);
        guardarCarrito(carrito);
        renderCatalogo();
        renderResumen();
    }

    // 7. Finalize Action
    btnFinalizar.addEventListener('click', () => {
        alert('¡Inscripción procesada con éxito! Has postulado a las certificaciones.');
        localStorage.removeItem(STORAGE_KEY);
        renderCatalogo();
        renderResumen();
    });

    // 8. Initialization
    renderCatalogo();
    renderResumen();
});

/**
 * ITUS - Panel de Administración: Mantenedor de Certificaciones (Productos)
 * Gestión CRUD de Cursos y Certificaciones.
 * Conectado con LocalStorage mediante funciones en certificaciones.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Elementos del DOM
    const tablaProductosBody = document.getElementById('tablaProductosBody');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const contadorTotal = document.getElementById('contadorTotal');
    const contadorDestacados = document.getElementById('contadorDestacados');
    const contadorCritico = document.getElementById('contadorCritico');

    // Modal y Formulario
    const productoModalEl = document.getElementById('productoModal');
    const productoModal = productoModalEl ? new bootstrap.Modal(productoModalEl) : null;
    const productoForm = document.getElementById('productoForm');
    const modalTitulo = document.getElementById('modalProductoTitulo');
    const modalAlert = document.getElementById('modalAlert');

    // Campos del formulario modal
    const inputId = document.getElementById('modalId');
    const inputNombre = document.getElementById('modalNombre');
    const inputEntidad = document.getElementById('modalEntidad');
    const inputCategoria = document.getElementById('modalCategoria');
    const inputHoras = document.getElementById('modalHoras');
    const inputPrecio = document.getElementById('modalPrecio');
    const checkGratuito = document.getElementById('modalGratuito');
    const inputStock = document.getElementById('modalStock');
    const inputStockCritico = document.getElementById('modalStockCritico');
    const checkDestacado = document.getElementById('modalDestacado');
    const inputIcon = document.getElementById('modalIcon');
    const inputDescripcionCorta = document.getElementById('modalDescripcionCorta');
    const inputDescripcionLarga = document.getElementById('modalDescripcionLarga');
    const inputModoEdicion = document.getElementById('modalModoEdicion'); // 'crear' o 'editar'

    // Alternar campo precio según gratuidad
    if (checkGratuito && inputPrecio) {
        checkGratuito.addEventListener('change', () => {
            if (checkGratuito.checked) {
                inputPrecio.value = 0;
                inputPrecio.disabled = true;
            } else {
                inputPrecio.disabled = false;
            }
        });
    }

    // 2. Función de Renderizado de la Tabla
    function renderizarTabla() {
        if (typeof obtenerCertificaciones !== 'function') {
            console.error('Falta incluir certificaciones.js');
            return;
        }

        let productos = obtenerCertificaciones();
        const textoBusqueda = inputBusqueda ? inputBusqueda.value.trim().toLowerCase() : '';

        // Actualizar métricas
        const total = productos.length;
        const destacados = productos.filter(p => p.destacado).length;
        const criticos = productos.filter(p => p.stock <= p.stockCritico).length;

        if (contadorTotal) contadorTotal.textContent = total;
        if (contadorDestacados) contadorDestacados.textContent = destacados;
        if (contadorCritico) contadorCritico.textContent = criticos;

        // Filtrar
        let productosFiltrados = productos.filter(p => {
            const coincideTexto = !textoBusqueda || 
                p.nombre.toLowerCase().includes(textoBusqueda) || 
                p.id.toLowerCase().includes(textoBusqueda) || 
                p.entidad.toLowerCase().includes(textoBusqueda) || 
                p.categoria.toLowerCase().includes(textoBusqueda);
            return coincideTexto;
        });

        if (tablaProductosBody) {
            tablaProductosBody.innerHTML = '';

            if (productosFiltrados.length === 0) {
                tablaProductosBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">
                            <i class="bi bi-box-seam fs-1 d-block mb-2 text-secondary opacity-50"></i>
                            No se encontraron certificaciones que coincidan con la búsqueda.
                        </td>
                    </tr>
                `;
                return;
            }

            productosFiltrados.forEach(p => {
                const tr = document.createElement('tr');
                tr.className = 'align-middle';

                const badgeGratuito = p.gratuito 
                    ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="bi bi-gift-fill me-1"></i> Gratis</span>`
                    : `<span class="fw-bold text-dark">$${p.precio.toLocaleString('es-CL')}</span>`;

                const badgeStock = p.stock <= p.stockCritico
                    ? `<span class="badge bg-danger-subtle text-danger px-2 py-1"><i class="bi bi-exclamation-triangle-fill"></i> ${p.stock}</span>`
                    : `<span class="badge bg-light text-dark border px-2 py-1">${p.stock}</span>`;

                const badgeDestacado = p.destacado ? `<i class="bi bi-star-fill text-warning ms-1" title="Destacado"></i>` : '';

                tr.innerHTML = `
                    <td class="fw-bold font-monospace">${p.id}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <img src="${p.icon || 'https://via.placeholder.com/30'}" alt="${p.entidad}" style="width:24px;height:24px;object-fit:contain;">
                            <div>
                                <div class="fw-bold text-dark">${p.nombre} ${badgeDestacado}</div>
                                <small class="text-muted">${p.entidad}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="small fw-semibold text-secondary">${p.categoria}</span>
                    </td>
                    <td><i class="bi bi-clock me-1 text-muted"></i>${p.horas}h</td>
                    <td>${badgeGratuito}</td>
                    <td>${badgeStock}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary btn-editar me-1" data-id="${p.id}" title="Editar Producto">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${p.id}" title="Eliminar Producto">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                `;
                tablaProductosBody.appendChild(tr);
            });

            // Event Listeners para Editar y Eliminar
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    abrirModalEditar(id);
                });
            });

            document.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    eliminarProductoAccion(id);
                });
            });
        }
    }

    // 3. Abrir Modal para Crear
    const btnNuevoProducto = document.getElementById('btnNuevoProducto');
    if (btnNuevoProducto) {
        btnNuevoProducto.addEventListener('click', () => {
            productoForm.reset();
            inputModoEdicion.value = 'crear';
            inputId.disabled = false;
            inputPrecio.disabled = false;
            modalTitulo.innerHTML = '<i class="bi bi-plus-circle-fill text-primary me-2"></i> Registrar Nueva Certificación';
            modalAlert.classList.add('d-none');
            // Limpiar clases de validación
            productoForm.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
                el.classList.remove('is-invalid', 'is-valid');
            });
            productoModal.show();
        });
    }

    // 4. Abrir Modal para Editar
    function abrirModalEditar(id) {
        const productos = obtenerCertificaciones();
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        productoForm.reset();
        inputModoEdicion.value = 'editar';
        
        inputId.value = producto.id;
        inputId.disabled = true; // El ID es clave no modificable
        
        inputNombre.value = producto.nombre;
        inputEntidad.value = producto.entidad;
        inputCategoria.value = producto.categoria;
        inputHoras.value = producto.horas;
        inputPrecio.value = producto.precio;
        checkGratuito.checked = producto.gratuito;
        inputPrecio.disabled = producto.gratuito;
        inputStock.value = producto.stock;
        inputStockCritico.value = producto.stockCritico;
        checkDestacado.checked = producto.destacado;
        inputIcon.value = producto.icon || '';
        inputDescripcionCorta.value = producto.descripcionCorta || '';
        inputDescripcionLarga.value = producto.descripcionLarga || '';

        modalTitulo.innerHTML = `<i class="bi bi-pencil-square text-primary me-2"></i> Editar Producto: ${producto.id}`;
        modalAlert.classList.add('d-none');

        productoForm.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });

        productoModal.show();
    }

    // 5. Envío del Formulario (Crear o Editar)
    if (productoForm) {
        productoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validaciones básicas
            const idVal = inputId.value.trim().toUpperCase();
            if (idVal.length < 3) {
                mostrarAlerta('El Código debe tener al menos 3 caracteres.', 'danger');
                return;
            }
            if (inputNombre.value.trim().length > 100) {
                mostrarAlerta('El Nombre no puede exceder 100 caracteres.', 'danger');
                return;
            }
            if (parseFloat(inputPrecio.value) < 0) {
                mostrarAlerta('El Precio no puede ser negativo.', 'danger');
                return;
            }
            if (inputDescripcionLarga.value.length > 500) {
                mostrarAlerta('La descripción no puede superar los 500 caracteres.', 'danger');
                return;
            }

            const modo = inputModoEdicion.value;
            let productos = obtenerCertificaciones();

            if (modo === 'crear' && productos.some(p => p.id === idVal)) {
                mostrarAlerta('El Código del producto ya existe.', 'danger');
                return;
            }

            const nuevoProducto = {
                id: idVal,
                nombre: inputNombre.value.trim(),
                entidad: inputEntidad.value.trim(),
                categoria: inputCategoria.value.trim(),
                horas: parseInt(inputHoras.value) || 0,
                precio: parseFloat(inputPrecio.value) || 0,
                gratuito: checkGratuito.checked,
                stock: parseInt(inputStock.value) || 0,
                stockCritico: inputStockCritico.value === '' ? 0 : (parseInt(inputStockCritico.value) || 0),
                destacado: checkDestacado.checked,
                icon: inputIcon.value.trim(),
                descripcionCorta: inputDescripcionCorta.value.trim(),
                descripcionLarga: inputDescripcionLarga.value.trim(),
                temario: []
            };

            if (modo === 'crear') {
                productos.push(nuevoProducto);
            } else {
                const index = productos.findIndex(p => p.id === idVal);
                if (index !== -1) {
                    nuevoProducto.temario = productos[index].temario;
                    productos[index] = nuevoProducto;
                }
            }

            guardarCertificaciones(productos);
            productoModal.hide();
            renderizarTabla();
        });
    }

    // 6. Eliminar Usuario
    function eliminarProductoAccion(id) {
        if (confirm(`¿Estás seguro de que deseas eliminar el producto ${id}? Esta acción no se puede deshacer.`)) {
            let productos = obtenerCertificaciones();
            productos = productos.filter(p => p.id !== id);
            guardarCertificaciones(productos);
            renderizarTabla();
        }
    }

    function mostrarAlerta(mensaje, tipo) {
        if (modalAlert) {
            modalAlert.className = `alert alert-${tipo}`;
            modalAlert.innerHTML = mensaje;
            modalAlert.classList.remove('d-none');
        } else {
            alert(mensaje);
        }
    }

    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', renderizarTabla);
    }

    if (tablaProductosBody) {
        renderizarTabla();
    }
});

/**
 * ITUS - Panel de Administración: Mantenedor de Usuarios (Estudiantes y Profesores)
 * Requisito medular del proyecto para gestión de usuarios esenciales en Login y Register.
 * Conectado en tiempo real con LocalStorage ('itus_usuarios').
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Elementos del DOM
    const tablaUsuariosBody = document.getElementById('tablaUsuariosBody');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const filtroRol = document.getElementById('filtroRol');
    const contadorTotal = document.getElementById('contadorTotal');
    const contadorEstudiantes = document.getElementById('contadorEstudiantes');
    const contadorProfesores = document.getElementById('contadorProfesores');

    // Modal y Formulario
    const usuarioModalEl = document.getElementById('usuarioModal');
    const usuarioModal = usuarioModalEl ? new bootstrap.Modal(usuarioModalEl) : null;
    const usuarioForm = document.getElementById('usuarioForm');
    const modalTitulo = document.getElementById('modalUsuarioTitulo');
    const modalAlert = document.getElementById('modalAlert');

    // Campos del formulario modal
    const inputRun = document.getElementById('modalRun');
    const inputNombre = document.getElementById('modalNombre');
    const inputApellidos = document.getElementById('modalApellidos');
    const inputCorreo = document.getElementById('modalCorreo');
    const selectRol = document.getElementById('modalRol');
    const inputCarrera = document.getElementById('modalCarrera');
    const labelCarreraModal = document.getElementById('labelCarreraModal');
    const selectRegion = document.getElementById('modalRegion');
    const selectComuna = document.getElementById('modalComuna');
    const inputDireccion = document.getElementById('modalDireccion');
    const inputPassword = document.getElementById('modalPassword');
    const inputModoEdicion = document.getElementById('modalModoEdicion'); // 'crear' o 'editar'

    // Configurar selects dependientes de Región y Comuna en el modal
    configurarSelectsRegionComuna('modalRegion', 'modalComuna');

    // Alternar etiqueta según el rol seleccionado
    if (selectRol) {
        selectRol.addEventListener('change', () => {
            if (selectRol.value === 'Profesor') {
                if (labelCarreraModal) labelCarreraModal.textContent = 'Departamento Académico *';
                if (inputCarrera) inputCarrera.placeholder = 'Ej: Departamento de Ciencias e Ingeniería';
            } else {
                if (labelCarreraModal) labelCarreraModal.textContent = 'Carrera Asignada *';
                if (inputCarrera) inputCarrera.placeholder = 'Ej: Ingeniería en Inteligencia Artificial';
            }
        });
    }

    // 2. Función de Renderizado de la Tabla
    function renderizarTabla() {
        let usuarios = obtenerUsuarios();
        const textoBusqueda = inputBusqueda ? inputBusqueda.value.trim().toLowerCase() : '';
        const rolFiltro = filtroRol ? filtroRol.value : 'Todos';

        // Actualizar métricas
        const total = usuarios.length;
        const totalEst = usuarios.filter(u => u.rol === 'Estudiante').length;
        const totalProf = usuarios.filter(u => u.rol === 'Profesor').length;

        if (contadorTotal) contadorTotal.textContent = total;
        if (contadorEstudiantes) contadorEstudiantes.textContent = totalEst;
        if (contadorProfesores) contadorProfesores.textContent = totalProf;

        // Filtrar
        let usuariosFiltrados = usuarios.filter(u => {
            const coincideRol = (rolFiltro === 'Todos') || (u.rol === rolFiltro);
            const coincideTexto = !textoBusqueda || 
                u.nombre.toLowerCase().includes(textoBusqueda) || 
                u.apellidos.toLowerCase().includes(textoBusqueda) || 
                u.run.toLowerCase().includes(textoBusqueda) || 
                u.correo.toLowerCase().includes(textoBusqueda) ||
                (u.carrera && u.carrera.toLowerCase().includes(textoBusqueda));
            return coincideRol && coincideTexto;
        });

        tablaUsuariosBody.innerHTML = '';

        if (usuariosFiltrados.length === 0) {
            tablaUsuariosBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4 text-muted">
                        <i class="bi bi-person-x fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
            return;
        }

        usuariosFiltrados.forEach(u => {
            const tr = document.createElement('tr');
            tr.className = 'align-middle';

            const badgeRol = u.rol === 'Estudiante' 
                ? `<span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"><i class="bi bi-mortarboard-fill me-1"></i> Estudiante</span>`
                : u.rol === 'Profesor'
                ? `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1"><i class="bi bi-person-video3 me-1"></i> Profesor</span>`
                : `<span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1"><i class="bi bi-shield-lock-fill me-1"></i> Admin</span>`;

            tr.innerHTML = `
                <td class="fw-bold font-monospace">${u.run}</td>
                <td>
                    <div class="fw-bold text-dark">${u.nombre} ${u.apellidos}</div>
                    <small class="text-muted">${u.direccion || 'Sin dirección registrada'}</small>
                </td>
                <td>
                    <a href="mailto:${u.correo}" class="text-decoration-none text-primary small">${u.correo}</a>
                </td>
                <td>${badgeRol}</td>
                <td>
                    <span class="small fw-semibold text-secondary">${u.carrera || 'No especificada'}</span>
                </td>
                <td>
                    <span class="small text-muted">${u.comuna || 'N/A'}, ${u.region ? u.region.replace('Región de ', '').replace('Región Metropolitana de ', 'RM - ') : ''}</span>
                </td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary btn-editar me-1" data-run="${u.run}" title="Editar Usuario">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar" data-run="${u.run}" title="Eliminar Usuario">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tablaUsuariosBody.appendChild(tr);
        });

        // Event Listeners para Editar y Eliminar
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const run = e.currentTarget.dataset.run;
                abrirModalEditar(run);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const run = e.currentTarget.dataset.run;
                eliminarUsuarioAccion(run);
            });
        });
    }

    // 3. Abrir Modal para Crear
    const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
    if (btnNuevoUsuario) {
        btnNuevoUsuario.addEventListener('click', () => {
            usuarioForm.reset();
            inputModoEdicion.value = 'crear';
            inputRun.disabled = false;
            modalTitulo.innerHTML = '<i class="bi bi-person-plus-fill text-warning me-2"></i> Registrar Nuevo Usuario';
            modalAlert.classList.add('d-none');
            // Limpiar clases de validación
            usuarioForm.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
                el.classList.remove('is-invalid', 'is-valid');
            });
            configurarSelectsRegionComuna('modalRegion', 'modalComuna');
            usuarioModal.show();
        });
    }

    // 4. Abrir Modal para Editar
    function abrirModalEditar(run) {
        const usuario = buscarUsuarioPorRun(run);
        if (!usuario) return;

        usuarioForm.reset();
        inputModoEdicion.value = 'editar';
        inputRun.value = usuario.run;
        inputRun.disabled = true; // El RUN es clave primaria no modificable
        inputNombre.value = usuario.nombre;
        inputApellidos.value = usuario.apellidos;
        inputCorreo.value = usuario.correo;
        selectRol.value = usuario.rol;
        inputCarrera.value = usuario.carrera || '';
        inputDireccion.value = usuario.direccion || '';
        inputPassword.value = usuario.password || '';

        modalTitulo.innerHTML = `<i class="bi bi-pencil-square text-primary me-2"></i> Editar Usuario: ${usuario.nombre} (${usuario.run})`;
        modalAlert.classList.add('d-none');

        // Configurar selects con los valores existentes
        configurarSelectsRegionComuna('modalRegion', 'modalComuna', usuario.region, usuario.comuna);

        usuarioForm.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });

        usuarioModal.show();
    }

    // 5. Envío del Formulario (Crear o Editar)
    if (usuarioForm) {
        usuarioForm.addEventListener('submit', (e) => {
            e.preventDefault();

            modalAlert.classList.add('d-none');
            modalAlert.classList.remove('alert-danger', 'alert-success');

            const modo = inputModoEdicion.value;
            const runVal = inputRun.value.trim().replace(/[\.\-\s]/g, '').toUpperCase();
            const nombreVal = inputNombre.value.trim();
            const apellidosVal = inputApellidos.value.trim();
            const correoVal = inputCorreo.value.trim().toLowerCase();
            const rolVal = selectRol.value;
            const carreraVal = inputCarrera.value.trim();
            const regionVal = selectRegion.value;
            const comunaVal = selectComuna.value;
            const direccionVal = inputDireccion.value.trim();
            const passwordVal = inputPassword.value;

            let esValido = true;

            // Validar RUN (solo si es crear)
            if (modo === 'crear') {
                if (!validarRutChileno(runVal)) {
                    inputRun.classList.add('is-invalid');
                    esValido = false;
                } else if (buscarUsuarioPorRun(runVal)) {
                    inputRun.classList.add('is-invalid');
                    modalAlert.textContent = 'El RUN ingresado ya existe en la base de datos.';
                    modalAlert.classList.remove('d-none');
                    modalAlert.classList.add('alert-danger');
                    return;
                } else {
                    inputRun.classList.remove('is-invalid');
                }
            }

            // Validar Nombre y Apellidos
            if (!nombreVal || nombreVal.length > 50) {
                inputNombre.classList.add('is-invalid');
                esValido = false;
            } else {
                inputNombre.classList.remove('is-invalid');
            }

            if (!apellidosVal || apellidosVal.length > 100) {
                inputApellidos.classList.add('is-invalid');
                esValido = false;
            } else {
                inputApellidos.classList.remove('is-invalid');
            }

            // Validar Correo RFC2822
            if (!validarEmailRFC2822(correoVal)) {
                inputCorreo.classList.add('is-invalid');
                esValido = false;
            } else {
                // Verificar si ya está ocupado por otro usuario
                const usuarioConCorreo = buscarUsuarioPorCorreo(correoVal);
                if (usuarioConCorreo && (modo === 'crear' || usuarioConCorreo.run !== runVal)) {
                    inputCorreo.classList.add('is-invalid');
                    modalAlert.textContent = 'El correo ya pertenece a otro usuario.';
                    modalAlert.classList.remove('d-none');
                    modalAlert.classList.add('alert-danger');
                    return;
                }
                inputCorreo.classList.remove('is-invalid');
            }

            // Validar Rol
            if (!rolVal) {
                selectRol.classList.add('is-invalid');
                esValido = false;
            } else {
                selectRol.classList.remove('is-invalid');
            }

            // Validar Dirección
            if (!direccionVal || direccionVal.length > 300) {
                inputDireccion.classList.add('is-invalid');
                esValido = false;
            } else {
                inputDireccion.classList.remove('is-invalid');
            }

            // Validar Password
            if (!validarPasswordFormato(passwordVal)) {
                inputPassword.classList.add('is-invalid');
                esValido = false;
            } else {
                inputPassword.classList.remove('is-invalid');
            }

            if (!esValido) {
                modalAlert.textContent = 'Por favor complete todos los campos obligatorios cumpliendo los requisitos.';
                modalAlert.classList.remove('d-none');
                modalAlert.classList.add('alert-danger');
                return;
            }

            // Crear o Actualizar
            const datosUsuario = {
                run: runVal,
                nombre: nombreVal,
                apellidos: apellidosVal,
                correo: correoVal,
                rol: rolVal,
                carrera: carreraVal,
                region: regionVal,
                comuna: comunaVal,
                direccion: direccionVal,
                password: passwordVal,
                estado: 'Activo'
            };

            if (modo === 'crear') {
                guardarNuevoUsuario(datosUsuario);
            } else {
                actualizarUsuario(datosUsuario);
            }

            modalAlert.textContent = modo === 'crear' ? '¡Usuario registrado con éxito!' : '¡Usuario actualizado con éxito!';
            modalAlert.classList.remove('d-none', 'alert-danger');
            modalAlert.classList.add('alert-success');

            renderizarTabla();

            setTimeout(() => {
                usuarioModal.hide();
            }, 800);
        });
    }

    // 6. Eliminar Usuario
    function eliminarUsuarioAccion(run) {
        const usuario = buscarUsuarioPorRun(run);
        if (!usuario) return;

        if (confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellidos} (RUN: ${usuario.run})? Esta acción no se puede deshacer.`)) {
            eliminarUsuario(run);
            renderizarTabla();
        }
    }

    // 7. Eventos de Búsqueda y Filtros
    if (inputBusqueda) inputBusqueda.addEventListener('input', renderizarTabla);
    if (filtroRol) filtroRol.addEventListener('change', renderizarTabla);

    // Render Inicial
    renderizarTabla();
});

/**
 * ITUS - Lógica de Control para Registro e Inicio de Sesión
 * Integrado con auth.js y LocalStorage.
 * Cumple con validaciones de rúbrica:
 * - RUN chileno con Módulo 11 (sin puntos ni guión)
 * - Nombres (máx 50) y Apellidos (máx 100)
 * - Correo RFC2822 (máx 100)
 * - Contraseña (4-10 caracteres, alfanumérica con especiales)
 * - Selects dependientes de Región y Comuna
 * - Redirección según rol:
 *   * Administrador -> Dashboards/dashboard-admin.html
 *   * Profesor -> Dashboards/dashboard-profesor.html
 *   * Estudiante -> Dashboards/dashboard-alumno.html
 */

document.addEventListener('DOMContentLoaded', () => {

    // Helper: determinar prefijo según ubicación de la página
    const isSubdir = window.location.pathname.includes('/Dashboards/') || 
                     window.location.pathname.includes('/carreras/') || 
                     window.location.pathname.includes('/noticias/') || 
                     window.location.pathname.includes('/certificaciones/');
    const prefix = isSubdir ? '../' : '';

    // ==========================================
    // 1. CONFIGURACIÓN DEL FORMULARIO DE REGISTRO
    // ==========================================
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        // Configurar selects dependientes de Región y Comuna
        configurarSelectsRegionComuna('regRegion', 'regComuna');

        // Alternar campos según tipo de usuario (Estudiante o Profesor)
        const radioEstudiante = document.getElementById('tipoEstudiante');
        const radioProfesor = document.getElementById('tipoProfesor');
        const labelCarrera = document.getElementById('labelCarrera');
        const selectCarrera = document.getElementById('regCarrera');

        function actualizarOpcionesRol() {
            if (radioProfesor && radioProfesor.checked) {
                if (labelCarrera) labelCarrera.textContent = 'Departamento Académico *';
                if (selectCarrera) {
                    selectCarrera.innerHTML = `
                        <option value="" selected disabled>-- Seleccione departamento --</option>
                        <option value="Departamento de Ciencias e Ingeniería">Departamento de Ciencias e Ingeniería</option>
                        <option value="Departamento de Ciberseguridad y Redes">Departamento de Ciberseguridad y Redes</option>
                        <option value="Departamento de Inteligencia Artificial">Departamento de Inteligencia Artificial</option>
                        <option value="Departamento de Desarrollo de Software">Departamento de Desarrollo de Software</option>
                    `;
                }
            } else {
                if (labelCarrera) labelCarrera.textContent = 'Carrera / Área Académica *';
                if (selectCarrera) {
                    selectCarrera.innerHTML = `
                        <option value="" selected disabled>-- Seleccione su carrera --</option>
                        <option value="Ingeniería en Inteligencia Artificial">Ingeniería en Inteligencia Artificial</option>
                        <option value="Ingeniería Civil en Informática">Ingeniería Civil en Informática</option>
                        <option value="Ingeniería en Ciencia de Datos">Ingeniería en Ciencia de Datos</option>
                        <option value="Ingeniería en Ciberseguridad">Ingeniería en Ciberseguridad</option>
                        <option value="Ingeniería en Cloud Computing">Ingeniería en Cloud Computing</option>
                        <option value="Ingeniería en Robótica y Automatización">Ingeniería en Robótica y Automatización</option>
                        <option value="Ingeniería en Internet of Things (IoT)">Ingeniería en Internet of Things (IoT)</option>
                        <option value="Ingeniería en Videojuegos y VR">Ingeniería en Videojuegos y VR</option>
                        <option value="Ingeniería en Bioinformática">Ingeniería en Bioinformática</option>
                        <option value="Ingeniería en Conectividad y Redes">Ingeniería en Conectividad y Redes</option>
                    `;
                }
            }
        }

        if (radioEstudiante) radioEstudiante.addEventListener('change', actualizarOpcionesRol);
        if (radioProfesor) radioProfesor.addEventListener('change', actualizarOpcionesRol);

        // Envío del Formulario de Registro
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const alertBox = document.getElementById('registroAlert');
            alertBox.classList.add('d-none');
            alertBox.classList.remove('alert-danger', 'alert-success');

            // Captura de valores
            const runInput = document.getElementById('regRun');
            const runVal = runInput.value.trim().replace(/[\.\-\s]/g, '').toUpperCase();
            
            const nombreInput = document.getElementById('regNombre');
            const nombreVal = nombreInput.value.trim();

            const apellidosInput = document.getElementById('regApellidos');
            const apellidosVal = apellidosInput.value.trim();

            const correoInput = document.getElementById('regCorreo');
            const correoVal = correoInput.value.trim().toLowerCase();

            const fechaNacInput = document.getElementById('regFechaNac');
            const fechaNacVal = fechaNacInput ? fechaNacInput.value : '';

            const carreraInput = document.getElementById('regCarrera');
            const carreraVal = carreraInput.value;

            const regionInput = document.getElementById('regRegion');
            const regionVal = regionInput.value;

            const comunaInput = document.getElementById('regComuna');
            const comunaVal = comunaInput.value;

            const direccionInput = document.getElementById('regDireccion');
            const direccionVal = direccionInput.value.trim();

            const telefonoInput = document.getElementById('regTelefono');
            const telefonoVal = telefonoInput ? telefonoInput.value.trim() : '';

            const passwordInput = document.getElementById('regPassword');
            const passwordVal = passwordInput.value;

            const passConfirmInput = document.getElementById('regPasswordConfirm');
            const passConfirmVal = passConfirmInput.value;

            const rolVal = (radioProfesor && radioProfesor.checked) ? 'Profesor' : 'Estudiante';

            let esValido = true;

            // Función helper para marcar campos
            function marcarCampo(input, valido, mensajeFeedbackId = null, mensaje = '') {
                if (!valido) {
                    input.classList.add('is-invalid');
                    input.classList.remove('is-valid');
                    if (mensajeFeedbackId && mensaje) {
                        const feedbackEl = document.getElementById(mensajeFeedbackId);
                        if (feedbackEl) feedbackEl.textContent = mensaje;
                    }
                    esValido = false;
                } else {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            }

            // 1. Validar RUN
            if (!validarRutChileno(runVal)) {
                marcarCampo(runInput, false, 'regRunFeedback', 'El RUN ingresado no es válido o su dígito verificador es incorrecto.');
            } else if (buscarUsuarioPorRun(runVal)) {
                marcarCampo(runInput, false, 'regRunFeedback', 'Este RUN ya se encuentra registrado en el sistema.');
            } else {
                marcarCampo(runInput, true);
            }

            // 2. Validar Nombre
            if (!nombreVal || nombreVal.length > 50) {
                marcarCampo(nombreInput, false);
            } else {
                marcarCampo(nombreInput, true);
            }

            // 3. Validar Apellidos
            if (!apellidosVal || apellidosVal.length > 100) {
                marcarCampo(apellidosInput, false);
            } else {
                marcarCampo(apellidosInput, true);
            }

            // 4. Validar Correo
            if (!validarEmailRFC2822(correoVal)) {
                marcarCampo(correoInput, false, 'regCorreoFeedback', 'Formato de correo no válido según estándar RFC2822.');
            } else if (buscarUsuarioPorCorreo(correoVal)) {
                marcarCampo(correoInput, false, 'regCorreoFeedback', 'Este correo ya se encuentra registrado.');
            } else {
                marcarCampo(correoInput, true);
            }

            // 5. Validar Carrera / Depto
            if (!carreraVal) {
                marcarCampo(carreraInput, false);
            } else {
                marcarCampo(carreraInput, true);
            }

            // 6. Validar Región y Comuna
            if (!regionVal) {
                marcarCampo(regionInput, false);
            } else {
                marcarCampo(regionInput, true);
            }

            if (!comunaVal) {
                marcarCampo(comunaInput, false);
            } else {
                marcarCampo(comunaInput, true);
            }

            // 7. Validar Dirección
            if (!direccionVal || direccionVal.length > 300) {
                marcarCampo(direccionInput, false);
            } else {
                marcarCampo(direccionInput, true);
            }

            // 8. Validar Contraseña (4 a 10 car., alfanumérica con especiales)
            if (!validarPasswordFormato(passwordVal)) {
                marcarCampo(passwordInput, false, 'regPasswordFeedback', 'Debe tener entre 4 y 10 caracteres, incluir letras, números y al menos un caracter especial.');
            } else {
                marcarCampo(passwordInput, true);
            }

            // 9. Validar Confirmación
            if (passwordVal !== passConfirmVal) {
                marcarCampo(passConfirmInput, false, 'regPasswordConfirmFeedback', 'Las contraseñas no coinciden.');
            } else {
                marcarCampo(passConfirmInput, true);
            }

            if (!esValido) {
                alertBox.textContent = 'Por favor revise los campos destacados en rojo antes de continuar.';
                alertBox.classList.add('alert-danger');
                alertBox.classList.remove('d-none');
                return;
            }

            // Registro Exitoso
            const nuevoUsuario = {
                run: runVal,
                nombre: nombreVal,
                apellidos: apellidosVal,
                correo: correoVal,
                password: passwordVal,
                rol: rolVal,
                carrera: carreraVal,
                sede: "Antonio Varas (Sede Principal)",
                region: regionVal,
                comuna: comunaVal,
                direccion: direccionVal,
                telefono: telefonoVal || '+56900000000',
                fechaNacimiento: fechaNacVal || '2000-01-01',
                estado: 'Activo'
            };

            guardarNuevoUsuario(nuevoUsuario);

            alertBox.innerHTML = `
                <strong><i class="bi bi-check-circle-fill me-2"></i>¡Usuario registrado exitosamente!</strong><br>
                Cuenta creada como <strong>${rolVal}</strong> para <strong>${nombreVal} ${apellidosVal}</strong>. Redirigiendo al inicio de sesión...
            `;
            alertBox.classList.remove('d-none', 'alert-danger');
            alertBox.classList.add('alert-success');
            registroForm.reset();

            setTimeout(() => {
                window.location.href = 'login-alumno.html';
            }, 1800);
        });
    }

    // ==========================================
    // 2. CONFIGURACIÓN DEL FORMULARIO DE LOGIN
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            const loginAlert = document.getElementById('loginAlert');

            loginAlert.classList.add('d-none');
            loginAlert.classList.remove('alert-danger', 'alert-success');

            const emailVal = emailInput.value.trim().toLowerCase();
            const passVal = passInput.value;

            let valido = true;

            // Validación RFC2822 Correo
            if (!validarEmailRFC2822(emailVal)) {
                emailInput.classList.add('is-invalid');
                valido = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            // Validación de Contraseña no vacía
            if (!passVal) {
                passInput.classList.add('is-invalid');
                valido = false;
            } else {
                passInput.classList.remove('is-invalid');
            }

            if (!valido) {
                loginAlert.textContent = 'Por favor ingrese su correo electrónico institucional y contraseña.';
                loginAlert.classList.remove('d-none');
                loginAlert.classList.add('alert-danger');
                return;
            }

            // Autenticación contra LocalStorage
            const resultado = iniciarSesionUsuario(emailVal, passVal);

            if (!resultado.success) {
                loginAlert.textContent = resultado.message;
                loginAlert.classList.remove('d-none');
                loginAlert.classList.add('alert-danger');
                return;
            }

            // Login correcto
            loginAlert.innerHTML = `<strong><i class="bi bi-check-circle-fill me-2"></i>¡Bienvenido(a), ${resultado.user.nombre}!</strong> Redirigiendo a su portal...`;
            loginAlert.classList.remove('d-none', 'alert-danger');
            loginAlert.classList.add('alert-success');

            setTimeout(() => {
                if (resultado.user.rol === 'Administrador') {
                    window.location.href = prefix + 'Dashboards/dashboard-admin.html';
                } else if (resultado.user.rol === 'Profesor') {
                    window.location.href = prefix + 'Dashboards/dashboard-profesor.html';
                } else {
                    window.location.href = prefix + 'Dashboards/dashboard-alumno.html';
                }
            }, 1000);
        });
    }

    // ==========================================
    // 3. ACTUALIZAR VISTA EN DASHBOARD ALUMNO / PROFESOR
    // ==========================================
    const sesionActual = obtenerSesionActual();
    const btnCerrarSesion = document.querySelectorAll('.btn-cerrar-sesion');

    btnCerrarSesion.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesionUsuario();
            window.location.href = prefix + 'login-alumno.html';
        });
    });

    // Si estamos en dashboard de alumno
    const alumnoNombreHeader = document.getElementById('dashAlumnoNombre');
    if (alumnoNombreHeader && sesionActual && sesionActual.rol === 'Estudiante') {
        alumnoNombreHeader.textContent = `${sesionActual.nombre} ${sesionActual.apellidos}`;
        const runEl = document.getElementById('dashAlumnoRun');
        if (runEl) runEl.textContent = `RUN: ${sesionActual.run}`;
        const carreraEl = document.getElementById('dashAlumnoCarrera');
        if (carreraEl) carreraEl.textContent = sesionActual.carrera;
        const sedeEl = document.getElementById('dashAlumnoSede');
        if (sedeEl) sedeEl.textContent = sesionActual.sede;
    }

    // Si estamos en dashboard de profesor
    const profeNombreHeader = document.getElementById('dashProfeNombre');
    if (profeNombreHeader && sesionActual && sesionActual.rol === 'Profesor') {
        profeNombreHeader.textContent = `Prof. ${sesionActual.nombre} ${sesionActual.apellidos}`;
        const correoEl = document.getElementById('dashProfeCorreo');
        if (correoEl) correoEl.textContent = sesionActual.correo;
        const deptoEl = document.getElementById('dashProfeDepto');
        if (deptoEl) deptoEl.textContent = sesionActual.carrera;
    }
});

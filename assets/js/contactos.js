/**
 * ITUS - Lógica de Validación Formulario de Contacto
 * Cumple con especificación de rúbrica DSY1104:
 * - Nombre: Requerido, Máximo 100 caracteres
 * - Correo: Requerido, Máximo 100 caracteres, RFC2822
 * - Comentario: Requerido, Máximo 500 caracteres
 * - Mensajes de error y sugerencias contextuales sin uso de alert() intrusivos
 */

document.addEventListener('DOMContentLoaded', () => {
    const contactoForm = document.getElementById('contactoForm');
    if (!contactoForm) return;

    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const asuntoSelect = document.getElementById('asunto');
    const mensajeTextarea = document.getElementById('mensaje');
    const contactoAlert = document.getElementById('contactoAlert');
    const charCounter = document.getElementById('charCounter');

    // Contador de caracteres en tiempo real para el comentario
    if (mensajeTextarea && charCounter) {
        mensajeTextarea.addEventListener('input', () => {
            const currentLen = mensajeTextarea.value.length;
            charCounter.textContent = `${currentLen} / 500 caracteres`;
            if (currentLen > 500) {
                charCounter.classList.add('text-danger');
                charCounter.classList.remove('text-white-50');
            } else {
                charCounter.classList.remove('text-danger');
                charCounter.classList.add('text-white-50');
            }
        });
    }

    contactoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        contactoAlert.classList.add('d-none');
        contactoAlert.classList.remove('alert-danger', 'alert-success');

        const nombreVal = nombreInput.value.trim();
        const emailVal = emailInput.value.trim();
        const telefonoVal = telefonoInput ? telefonoInput.value.trim() : '';
        const asuntoVal = asuntoSelect.value;
        const mensajeVal = mensajeTextarea.value.trim();

        let esValido = true;
        let errores = [];

        // 1. Validar Nombre (Requerido, máx. 100 caracteres)
        if (!nombreVal) {
            nombreInput.classList.add('is-invalid');
            errores.push('El nombre completo es obligatorio.');
            esValido = false;
        } else if (nombreVal.length > 100) {
            nombreInput.classList.add('is-invalid');
            errores.push('El nombre no debe exceder los 100 caracteres.');
            esValido = false;
        } else {
            nombreInput.classList.remove('is-invalid');
            nombreInput.classList.add('is-valid');
        }

        // 2. Validar Correo (Requerido, máx. 100, RFC2822)
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailVal) {
            emailInput.classList.add('is-invalid');
            errores.push('El correo electrónico es obligatorio.');
            esValido = false;
        } else if (emailVal.length > 100 || !emailRegex.test(emailVal)) {
            emailInput.classList.add('is-invalid');
            errores.push('Ingrese un correo válido bajo norma RFC2822 (máximo 100 caracteres).');
            esValido = false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }

        // 3. Validar Asunto
        if (!asuntoVal) {
            asuntoSelect.classList.add('is-invalid');
            errores.push('Por favor seleccione un asunto de consulta.');
            esValido = false;
        } else {
            asuntoSelect.classList.remove('is-invalid');
            asuntoSelect.classList.add('is-valid');
        }

        // 4. Validar Comentario / Mensaje (Requerido, máx. 500 caracteres)
        if (!mensajeVal) {
            mensajeTextarea.classList.add('is-invalid');
            errores.push('El mensaje de comentario o consulta es obligatorio.');
            esValido = false;
        } else if (mensajeVal.length > 500) {
            mensajeTextarea.classList.add('is-invalid');
            errores.push(`El mensaje supera el límite máximo de 500 caracteres (actual: ${mensajeVal.length}).`);
            esValido = false;
        } else {
            mensajeTextarea.classList.remove('is-invalid');
            mensajeTextarea.classList.add('is-valid');
        }

        // Si hay errores, mostrarlos en el contenedor de alerta del DOM
        if (!esValido) {
            contactoAlert.innerHTML = `
                <div class="fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i>Revise los siguientes errores:</div>
                <ul class="mb-0 ps-3 small">
                    ${errores.map(err => `<li>${err}</li>`).join('')}
                </ul>
            `;
            contactoAlert.classList.add('alert-danger');
            contactoAlert.classList.remove('d-none');
            return;
        }

        // Éxito: Feedback en el DOM
        contactoAlert.innerHTML = `
            <div class="fw-bold"><i class="bi bi-check-circle-fill me-2"></i>¡Mensaje enviado con éxito!</div>
            <div class="small">Estimado(a) <strong>${nombreVal}</strong>, un asesor de ITUS te responderá a <strong>${emailVal}</strong> en menos de 24 horas hábiles.</div>
        `;
        contactoAlert.classList.remove('alert-danger', 'd-none');
        contactoAlert.classList.add('alert-success');

        contactoForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500 caracteres';
        
        // Quitar estados de validación
        contactoForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    });
});

document.addEventListener('DOMContentLoaded', function() {

    // Registro form validation
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const correo = document.getElementById('regCorreo').value;
            const correoConfirm = document.getElementById('regCorreoConfirm').value;
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;
            const telefono = document.getElementById('regTelefono').value;
            const carrera = document.getElementById('regCarrera').value;
            const region = document.getElementById('regRegion').value;
            const comuna = document.getElementById('regComuna').value;
            
            if (correo !== correoConfirm) {
                alert('Los correos no coinciden.');
                return;
            }
            if (password !== passwordConfirm) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (nombre && correo && password && carrera && region && comuna) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                registroForm.reset();
            }
        });
    }

    // Login form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const loginAlert = document.getElementById('loginAlert');

            // Validar dominios permitidos
            const allowedDomains = ['@gmail.com', '@hotmail.com', '@outlook.com', '@itus.cl'];
            const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));

            if (!isValidDomain) {
                loginAlert.textContent = 'Por favor, utiliza un correo válido (@gmail.com, @hotmail.com, @outlook.com o @itus.cl).';
                loginAlert.classList.remove('d-none');
                return;
            }

            if (password.length < 6) {
                loginAlert.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                loginAlert.classList.remove('d-none');
                return;
            }

            // Simular inicio de sesión exitoso y redirigir al dashboard
            loginAlert.classList.add('d-none');
            
            // Check if we are in a subdirectory based on the current URL
            const isSubdir = window.location.pathname.includes('/carreras/') || window.location.pathname.includes('/noticias/');
            const prefix = isSubdir ? '../' : '';

            window.location.href = prefix + 'dashboard-alumno.html';
        });
    }
});

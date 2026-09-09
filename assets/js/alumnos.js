document.addEventListener('DOMContentLoaded', function() {

    // Admision form validation
    const admisionForm = document.getElementById('admisionForm');
    if (admisionForm) {
        admisionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const rut = document.getElementById('rut').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const carrera = document.getElementById('carrera').value;
            
            if (nombre && rut && email && telefono && carrera) {
                alert('¡Postulación enviada con éxito! Te contactaremos a la brevedad.');
                admisionForm.reset();
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

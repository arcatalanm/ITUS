document.addEventListener('DOMContentLoaded', function() {
    // Login form validation for teachers
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim().toLowerCase();
            const password = document.getElementById('loginPassword').value;
            const loginAlert = document.getElementById('loginAlert');

            // Validar dominios permitidos para profesores
            const isValidDomain = email.endsWith('@itusprofesor.cl');

            if (!isValidDomain) {
                loginAlert.textContent = 'Acceso denegado. Solo se permiten correos @itusprofesor.cl.';
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

            window.location.href = prefix + 'dashboard-profesor.html';
        });
    }
});

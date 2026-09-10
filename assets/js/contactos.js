document.addEventListener('DOMContentLoaded', function() {
    const contactoForm = document.getElementById('contactoForm');
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const telefono = document.getElementById('telefono').value.trim();
            const email = document.getElementById('email').value.trim();
            const contactoAlert = document.getElementById('contactoAlert');
            
            // Basic regex for email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Phone validation: allows optional leading '+' and 8 to 15 digits
            const phoneRegex = /^\+?[0-9]{8,15}$/;

            if (!emailRegex.test(email)) {
                contactoAlert.textContent = 'Por favor ingresa un correo electrónico válido.';
                contactoAlert.classList.remove('d-none');
                return;
            }

            if (!phoneRegex.test(telefono)) {
                contactoAlert.textContent = 'Por favor ingresa un teléfono válido (ej: +56912345678 o 912345678). Solo se permiten números y el signo +.';
                contactoAlert.classList.remove('d-none');
                return;
            }

            // Success scenario
            contactoAlert.classList.add('d-none');
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactoForm.reset();
        });
    }
});

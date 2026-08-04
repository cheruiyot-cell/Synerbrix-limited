// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ---------- 1. Mobile Menu Toggle ----------
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ---------- 2. Throttled Header Shadow on Scroll ----------
    const header = document.getElementById('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                } else {
                    header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // passive for better scroll performance

    // ---------- 3. Form Validation & Submission ----------
    const quoteForm = document.getElementById('quote-form');
    const formSuccess = document.getElementById('formSuccess');
    const resetBtn = document.getElementById('reset-form-btn'); // added in HTML

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Clear previous errors
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });

            const name = document.getElementById('fullName');
            const phone = document.getElementById('phone');
            const service = document.getElementById('service');
            const message = document.getElementById('message');

            // Name
            if (!name.value.trim()) {
                showError(name);
                isValid = false;
            }

            // Phone (Kenyan format: +254XXXXXXXXX or 0XXXXXXXXX)
            const phoneRegex = /^(\+254|0)[0-9]{9}$/;
            if (!phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
                showError(phone);
                isValid = false;
            }

            // Service
            if (!service.value) {
                showError(service);
                isValid = false;
            }

            // Message
            if (!message.value.trim()) {
                showError(message);
                isValid = false;
            }

            if (isValid) {
                // Hide form and show success
                quoteForm.style.display = 'none';
                formSuccess.style.display = 'block';

                // Prepare WhatsApp message (plain text)
                const whatsappMsg =
                    `Hello Synerbrix, I would like to request a quote.\n\n` +
                    `Name: ${name.value.trim()}\n` +
                    `Phone: ${phone.value.trim()}\n` +
                    `Service: ${service.options[service.selectedIndex].text}\n` +
                    `Details: ${message.value.trim()}`;

                const encodedMsg = encodeURIComponent(whatsappMsg);

                // Open WhatsApp as a backup after a short delay
                setTimeout(() => {
                    window.open(`https://wa.me/254732832849?text=${encodedMsg}`, '_blank');
                }, 1500);
            }
        });

        // Reset form to allow re-submission
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                quoteForm.reset();
                quoteForm.style.display = 'block';
                formSuccess.style.display = 'none';
                document.querySelectorAll('.form-group').forEach(group => {
                    group.classList.remove('error');
                });
            });
        }
    }

    // ---------- 4. Helper Function ----------
    function showError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
        }
    }
});
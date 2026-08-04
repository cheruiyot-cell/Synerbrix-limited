(function() {
    'use strict';

    // ----- Page Loader -----
    const loader = document.getElementById('pageLoader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(() => loader.classList.add('hidden'), 600);
        });
        setTimeout(function() {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        }, 3000);
    }

    // ----- GSAP Scroll Animations (with fallback) -----
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero animations
        gsap.from('.hero-title', { duration: 1.2, y: 60, opacity: 0, ease: 'power3.out', delay: 0.3 });
        gsap.from('.hero-subtitle', { duration: 1.0, y: 40, opacity: 0, ease: 'power3.out', delay: 0.6 });
        gsap.from('.hero-buttons', { duration: 0.9, y: 30, opacity: 0, ease: 'power3.out', delay: 0.9 });
        gsap.from('.hero-graphic', { duration: 1.4, x: 60, opacity: 0, ease: 'power3.out', delay: 0.5 });

        // Staggered reveals (services, audience, steps, stats, ps-box)
        const staggerConfig = (selector, duration, delay, stagger, start = 'top 88%') => {
            gsap.utils.toArray(selector).forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
                    duration,
                    y: 40,
                    opacity: 0,
                    ease: 'power2.out',
                    delay: i * stagger
                });
            });
        };
        staggerConfig('.service-card', 0.8, 0, 0.1);
        staggerConfig('.audience-card', 0.7, 0, 0.08);
        staggerConfig('.step-card', 0.7, 0, 0.08);
        staggerConfig('.stat-card', 0.8, 0, 0.1, 'top 90%');
        gsap.from('.ps-box', {
            scrollTrigger: { trigger: '.ps-grid', start: 'top 85%', toggleActions: 'play none none none' },
            duration: 0.9,
            y: 40,
            opacity: 0,
            ease: 'power2.out',
            stagger: 0.15
        });
    }

    // ----- Mobile Toggle -----
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = navMenu.classList.contains('active') ?
                    'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });

        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // ----- Active Nav Link (scroll spy) -----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 120;
        let currentId = '';
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);

    // ----- Form Validation (with improved Kenyan phone regex) -----
    const form = document.getElementById('quote-form');
    const successEl = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;

            // Clear previous errors
            form.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
            form.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));

            const name = document.getElementById('fullName');
            if (!name.value.trim()) {
                name.classList.add('error');
                document.getElementById('nameError').classList.add('visible');
                valid = false;
            }

            const phone = document.getElementById('phone');
            const phoneVal = phone.value.trim();
            // Kenyan numbers: 07XXXXXXXX or +254XXXXXXXXX
            const phoneRegex = /^(0[7-9][0-9]{8}|\+254[0-9]{9})$/;
            if (!phoneVal || !phoneRegex.test(phoneVal)) {
                phone.classList.add('error');
                document.getElementById('phoneError').classList.add('visible');
                valid = false;
            }

            const service = document.getElementById('service');
            if (!service.value) {
                service.classList.add('error');
                document.getElementById('serviceError').classList.add('visible');
                valid = false;
            }

            const message = document.getElementById('message');
            if (!message.value.trim()) {
                message.classList.add('error');
                document.getElementById('messageError').classList.add('visible');
                valid = false;
            }

            if (valid) {
                if (successEl) {
                    successEl.style.display = 'block';
                    form.reset();
                    if (typeof gsap !== 'undefined') {
                        gsap.from(successEl, { duration: 0.6, scale: 0.95, opacity: 0, ease: 'power2.out' });
                    }
                    setTimeout(function() {
                        if (successEl) {
                            if (typeof gsap !== 'undefined') {
                                gsap.to(successEl, {
                                    duration: 0.5,
                                    opacity: 0,
                                    ease: 'power2.in',
                                    onComplete: () => {
                                        successEl.style.display = 'none';
                                        successEl.style.opacity = 1;
                                    }
                                });
                            } else {
                                successEl.style.display = 'none';
                            }
                        }
                    }, 7000);
                }
                // Form submission could be sent to a server here
            }
        });
    }

    // ----- Smooth Scroll for internal anchors -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
})();
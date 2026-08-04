/**
 * Features: High-performance IntersectionObservers, GSAP integration with fallbacks,
 * mobile drawer locks, full Kenyan mobile regex, and accessible form handling.
 */
(function() {
    'use strict';

    // ----- HELPER FUNCTIONS -----
    const getHeaderHeight = () => {
        const header = document.querySelector('.header');
        return header ? header.offsetHeight : 0;
    };

    // ----- 1. PAGE LOADER MANAGEMENT -----
    const initPageLoader = () => {
        const loader = document.getElementById('pageLoader');
        if (!loader) return;

        const hideLoader = () => {
            if (!loader.classList.contains('hidden')) {
                loader.classList.add('hidden');
            }
        };

        if (document.readyState === 'complete') {
            setTimeout(hideLoader, 300);
        } else {
            window.addEventListener('load', () => setTimeout(hideLoader, 400));
        }

        // Hard fallback to prevent infinite hanging
        setTimeout(hideLoader, 2500);
    };

    // ----- 2. GSAP ANIMATIONS & FALLBACK -----
    const initScrollAnimations = () => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Hero section timeline
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTl.from('.hero-title', { duration: 1, y: 50, opacity: 0, delay: 0.2 })
                  .from('.hero-subtitle', { duration: 0.8, y: 30, opacity: 0 }, '-=0.6')
                  .from('.hero-buttons', { duration: 0.8, y: 20, opacity: 0 }, '-=0.5')
                  .from('.hero-graphic', { duration: 1.2, x: 40, opacity: 0 }, '-=0.8');

            // Staggered reveals via GSAP ScrollTrigger
            const registerStagger = (selector, start = 'top 88%') => {
                const elements = gsap.utils.toArray(selector);
                if (!elements.length) return;

                ScrollTrigger.batch(elements, {
                    start: start,
                    onEnter: batch => gsap.fromTo(batch, 
                        { opacity: 0, y: 40 }, 
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }
                    ),
                    once: true
                });
            };

            registerStagger('.service-card');
            registerStagger('.audience-card');
            registerStagger('.step-card');
            registerStagger('.stat-card', 'top 90%');
            registerStagger('.ps-box', 'top 85%');

        } else {
            // IntersectionObserver Fallback if GSAP is unavailable
            const revealElements = document.querySelectorAll('.reveal, .service-card, .audience-card, .step-card, .stat-card, .ps-box');
            if (!('IntersectionObserver' in window)) {
                revealElements.forEach(el => el.classList.add('visible'));
                return;
            }

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            revealElements.forEach(el => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                observer.observe(el);
            });
        }
    };

    // ----- 3. ACCESSIBLE MOBILE DRAWER -----
    const initMobileNav = () => {
        const toggleBtn = document.getElementById('mobile-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (!toggleBtn || !navMenu) return;

        const openMenu = () => {
            navMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock background scroll
            toggleBtn.setAttribute('aria-expanded', 'true');
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-xmark';
        };

        const closeMenu = () => {
            navMenu.classList.remove('active');
            document.body.style.overflow = ''; // Unlock background scroll
            toggleBtn.setAttribute('aria-expanded', 'false');
            const icon = toggleBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('active');
            isOpen ? closeMenu() : openMenu();
        });

        // Close when clicking navigation links
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close when clicking outside drawer
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    };

    // ----- 4. HIGH-PERFORMANCE SCROLL SPY -----
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (!sections.length || !navLinks.length) return;

        const linkMap = new Map();
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                linkMap.set(href.substring(1), link);
            }
        });

        const observerOptions = {
            root: null,
            rootMargin: `-${getHeaderHeight() + 20}px 0px -40% 0px`,
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(l => l.classList.remove('active'));
                    const activeLink = linkMap.get(id);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    };

    // ----- 5. FORM VALIDATION & INTERACTION -----
    const initFormValidation = () => {
        const form = document.getElementById('quote-form');
        const successEl = document.getElementById('formSuccess');
        if (!form) return;

        const clearError = (inputEl, errorEl) => {
            inputEl.classList.remove('error');
            inputEl.removeAttribute('aria-invalid');
            if (errorEl) errorEl.classList.remove('visible');
        };

        const showError = (inputEl, errorEl) => {
            inputEl.classList.add('error');
            inputEl.setAttribute('aria-invalid', 'true');
            if (errorEl) errorEl.classList.add('visible');
        };

        // Live input cleaning as user types
        form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('input', () => {
                const errorEl = document.getElementById(`${input.id}Error`);
                clearError(input, errorEl);
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            let firstInvalidInput = null;

            // Validate Name
            const name = document.getElementById('fullName');
            const nameError = document.getElementById('nameError');
            if (name && !name.value.trim()) {
                showError(name, nameError);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = name;
            }

            // Validate Phone (Kenyan Formats: 0712345678, 0112345678, +254712345678, 254712345678)
            const phone = document.getElementById('phone');
            const phoneError = document.getElementById('phoneError');
            const phoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
            if (phone) {
                const phoneVal = phone.value.trim();
                if (!phoneVal || !phoneRegex.test(phoneVal)) {
                    showError(phone, phoneError);
                    isValid = false;
                    if (!firstInvalidInput) firstInvalidInput = phone;
                }
            }

            // Validate Service Selection
            const service = document.getElementById('service');
            const serviceError = document.getElementById('serviceError');
            if (service && !service.value) {
                showError(service, serviceError);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = service;
            }

            // Validate Message
            const message = document.getElementById('message');
            const messageError = document.getElementById('messageError');
            if (message && !message.value.trim()) {
                showError(message, messageError);
                isValid = false;
                if (!firstInvalidInput) firstInvalidInput = message;
            }

            if (!isValid) {
                if (firstInvalidInput) firstInvalidInput.focus();
                return;
            }

            // Successful Submission Handling
            if (successEl) {
                successEl.style.display = 'block';
                form.reset();

                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(successEl, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
                }

                setTimeout(() => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(successEl, {
                            duration: 0.4,
                            opacity: 0,
                            onComplete: () => {
                                successEl.style.display = 'none';
                                successEl.style.opacity = '1';
                            }
                        });
                    } else {
                        successEl.style.display = 'none';
                    }
                }, 6000);
            }
        });
    };

    // ----- 6. HEADER-OFFSET SMOOTH SCROLL -----
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const headerOffset = getHeaderHeight();
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    };

    // ----- INITIALIZATION -----
    document.addEventListener('DOMContentLoaded', () => {
        initPageLoader();
        initScrollAnimations();
        initMobileNav();
        initScrollSpy();
        initFormValidation();
        initSmoothScroll();
    });

})();
